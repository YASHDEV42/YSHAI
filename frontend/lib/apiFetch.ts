
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export type ApiResponse<T = any> = { data: T | null; status: number; headers: Headers };

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status: number, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
  Object.setPrototypeOf(this, ApiError.prototype);
}

/**
 * Central fetch wrapper used by Orval-generated code (replace default fetch)
 *
 * - Ensures base URL
 * - Attaches default headers (and token if present)
 * - Parses JSON safely based on content-type
 * - Throws ApiError for non-2xx responses (you can change to return instead)
 */
export const apiFetch = async (pathOrUrl: string, options: RequestInit = {}) => {
  // compute the full URL
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${API_BASE_URL}${pathOrUrl}`;

  const headers = new Headers({
    "Accept": "application/json",
    ...(options.headers ? (options.headers as Record<string, string>) : {}),
  });

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers, credentials: "include" });

  // handle no-content explicitly
  if ([204, 205].includes(res.status)) {
    return { data: null, status: res.status, headers: res.headers } as ApiResponse<null>;
  }

  // parse based on content-type
  const contentType = res.headers.get("content-type") ?? "";
  let parsed: any = null;
  if (contentType.includes("application/json")) {
    // use res.json() which will throw on invalid JSON; catch below
    try {
      parsed = await res.json();
    } catch (e) {
      parsed = null;
    }
  } else {
    // fallback to text
    try {
      parsed = await res.text();
    } catch (e) {
      parsed = null;
    }
  }

  if (!res.ok) {
    // throw, so callers can handle via try/catch, or change to return structured error object
    throw new ApiError(`Request failed with status ${res.status}`, res.status, parsed);
  }

  return { data: parsed, status: res.status, headers: res.headers } as ApiResponse<typeof parsed>;
};
