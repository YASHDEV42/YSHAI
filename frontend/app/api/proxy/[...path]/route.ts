import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshAction } from "@/lib/refreshAction";

const BaseURL = process.env.API_BASE_URL || "http://localhost:5000";
let refreshPromise: Promise<{ accessToken: string, newRefreshToken: string }> | null = null;

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

async function handler(req: NextRequest, context: { params: { path: string[] } }) {
  const path = context.params.path.join("/");
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  console.log(`Proxying ${req.method} → ${BaseURL}/${path}`);
  console.log("accessToken:", accessToken ? "✅ present" : "❌ absent");
  console.log("refreshToken:", refreshToken ? "✅ present" : "❌ absent");

  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let res = await fetch(`${BaseURL}/${path}`, {
    method: req.method,
    headers,
    body,
  });

  if (res.status === 401 && refreshToken) {
    console.log("Access token expired → trying refresh...");
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAction(refreshToken);
      }
      const { accessToken: newAccessToken, newRefreshToken } = await refreshPromise;

      console.log("New access token obtained:", newAccessToken ? "✅ present" : "❌ absent");
      const nextCookies = await cookies();
      nextCookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      console.log("Access token cookie set.");

      if (newRefreshToken) {
        nextCookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "lax",
          path: "/",
          maxAge: 7 * 24 * 60 * 60,
        });
      }

      console.log("✅ Token refreshed successfully. Retrying request...");

      const retryHeaders = new Headers(req.headers);
      retryHeaders.delete("host");
      retryHeaders.delete("connection");
      retryHeaders.set("Authorization", `Bearer ${newAccessToken}`);

      res = await fetch(`${BaseURL}/${path}`, {
        method: req.method,
        headers: retryHeaders,
        body,
      });
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    } finally {
      refreshPromise = null;
    }
  }

  const data = await safeJson(res);
  return NextResponse.json(data, { status: res.status });
}

async function safeJson(res: Response) {
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  }
  return res.text();
}
