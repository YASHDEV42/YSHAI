"use server";

import { cookies } from "next/headers";
import type { ValidationErrorDto, ErrorResponseDto } from "@/interfaces";

const APP_URL = "/api/protected";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type ApiSuccess<T> = {
  success: true;
  status: number;
  data: T;
};

export type ApiError = {
  success: false;
  status: number;
  error: string;
  validationErrors?: ValidationErrorDto["errors"];
  errorCode?: string;
};

export type ApiResult<T> = ApiSuccess<T> | ApiError;

interface ApiRequestOptions<TBody> {
  method?: ApiMethod;
  path: string;
  query?: Record<
    string,
    | string
    | number
    | boolean
    | undefined
    | (string | number | boolean | undefined)[]
  >;
  body?: TBody;
  formData?: FormData;
  cache?:
    | "no-store"
    | {
        revalidate?: number;
        tags?: string[];
      };
}

export async function apiRequest<TResponse, TBody = any>(
  opts: ApiRequestOptions<TBody>,
): Promise<ApiResult<TResponse>> {
  const { method = "GET", path, query, body, formData, cache } = opts;
  console.log("API path:", path);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken && path !== "/auth/login" && path !== "/auth/register") {
    return {
      success: false,
      status: 401,
      error: "Unauthorized. No access token found.",
    };
  }

  // BUILD QUERY STRING

  const qs =
    query &&
    Object.entries(query)
      .filter(([, v]) => v !== undefined)
      .flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          // multiple ?key=value parameters
          return value.map(
            (item) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`,
          );
        }

        // single parameter
        return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
      })
      .join("&");

  const url = `${APP_URL}${path}${qs ? `?${qs}` : ""}`;

  // BUILD REQUEST INIT
  const init: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {
    method,
    credentials: "include",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Cookie: `accessToken=${accessToken}`,
    },
  };

  // Cache handling
  if (cache === "no-store") {
    (init as any).cache = "no-store";
  } else if (cache) {
    init.next = {
      ...(init.next ?? {}),
      revalidate: cache.revalidate,
      tags: cache.tags,
    };
  }

  // Body / form
  if (formData) {
    init.body = formData;
  } else if (body !== undefined) {
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
    init.body = JSON.stringify(body);
  }

  // SEND REQUEST TO NEXT.JS PROXY
  console.log(`[API] ${method} ${url}`);
  let res: Response;
  try {
    res = await fetch(url, init);
  } catch (err) {
    console.error(`[API] ${method} ${url} failed:`, err);
    return {
      success: false,
      status: 0,
      error: "Network error",
    };
  }

  // PARSE JSON (if exists)
  const rawText = await res.text();
  let json = undefined;
  try {
    json = rawText ? JSON.parse(rawText) : undefined;
  } catch {
    json = rawText;
  }

  if (!res.ok) {
    // Check if this is a validation error (400 with errors array)
    if (res.status === 400 && json && Array.isArray(json.errors)) {
      return {
        success: false,
        status: res.status,
        error: json.message || "Validation failed",
        validationErrors: json.errors,
      };
    }

    // Standard error response
    const message =
      (json && (json.message || json.error)) ||
      rawText ||
      `Request failed with ${res.status}`;

    return {
      success: false,
      status: res.status,
      error: message,
      errorCode: json?.error,
    };
  }

  return {
    success: true,
    status: res.status,
    data: json as TResponse,
  };
}
