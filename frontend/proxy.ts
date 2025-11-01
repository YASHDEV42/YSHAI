import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// Track ongoing refresh attempts by refresh token value
const refreshPromises = new Map<
  string,
  Promise<{
    accessToken: string;
    refreshToken: string;
  }>
>();

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/api/proxy")) {
    return intlMiddleware(req);
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/proxy/, "");
  const targetUrl = `${API_BASE_URL}${path}${url.search}`;

  let accessToken = req.cookies.get("accessToken");
  let refreshToken = req.cookies.get("refreshToken");

  console.log(`Proxying ${req.method} → ${targetUrl}`);
  console.log("AccessToken:", accessToken ? "✅ present" : "❌ absent");
  console.log("RefreshToken:", refreshToken ? "✅ present" : "❌ absent");

  // Prepare headers
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken.value}`);
  }

  // Read body once and store it
  const body =
    req.method === "GET" || req.method === "HEAD"
      ? undefined
      : await req.text();

  // Initial request
  let res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  });

  // Handle 401 with token refresh
  if (res.status === 401 && refreshToken) {
    console.log("Access token expired → attempting refresh...");

    try {
      // Deduplicate concurrent refresh attempts
      const refreshKey = refreshToken.value;
      if (!refreshPromises.has(refreshKey)) {
        refreshPromises.set(
          refreshKey,
          performTokenRefresh(refreshToken.value),
        );
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        await refreshPromises.get(refreshKey)!;

      console.log("✅ Token refresh successful");

      // Retry the original request with new access token
      const retryHeaders = new Headers(req.headers);
      retryHeaders.delete("host");
      retryHeaders.delete("connection");
      retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

      const retryRes = await fetch(targetUrl, {
        method: req.method,
        headers: retryHeaders,
        body,
      });

      const data = await safeJson(retryRes);
      const response = NextResponse.json(data, { status: retryRes.status });

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 15 * 60, // 15 minutes
      });

      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (err) {
      console.error("❌ Token refresh failed:", err);

      // Clear invalid tokens
      const errorResponse = NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 },
      );
      errorResponse.cookies.delete("accessToken");
      errorResponse.cookies.delete("refreshToken");

      return errorResponse;
    } finally {
      // Clean up the promise after a short delay to allow concurrent requests to use it
      setTimeout(() => refreshPromises.delete(refreshToken.value), 1000);
    }
  }

  const data = await safeJson(res);
  return NextResponse.json(data, { status: res.status });
}

async function performTokenRefresh(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const { accessToken, newRefreshToken } = await response.json();

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
