import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { refreshAction } from "@/lib/refreshAction";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Support all methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;

async function handler(req: NextRequest, context: { params: { path: string[] } }) {
  const path = context.params.path.join("/");
  const cookieStore = await cookies();

  // 🟢 Try to read cookies from the incoming request (since we’re forwarding them manually)
  const accessToken = cookieStore.get("accessToken")?.value || req.cookies.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value || req.cookies.get("refreshToken")?.value;

  console.log(`Proxying ${req.method} → ${BaseURL}/${path}`);
  console.log("accessToken:", accessToken ? "✅ present" : "❌ absent");
  console.log("refreshToken:", refreshToken ? "✅ present" : "❌ absent");

  // Build headers
  const headers = new Headers(req.headers);
  headers.delete("host");
  headers.delete("connection");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const body =
    req.method === "GET" || req.method === "HEAD" ? undefined : await req.text();

  let res = await fetch(`${BaseURL}/${path}`, {
    method: req.method,
    headers,
    body,
  });

  // 🟡 Refresh token flow
  if (res.status === 401 && refreshToken) {
    console.log("Access token expired → trying refresh...");
    try {
      const { accessToken: newAccessToken, newRefreshToken } = await refreshAction(refreshToken);

      // 🟢 Save new cookies (this now works because we’re in a route handler)
      const nextCookies = await cookies();
      nextCookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
      if (newRefreshToken) {
        nextCookies.set("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
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
    }
  }

  // 🧩 Return final response
  const data = await safeJson(res);
  return NextResponse.json(data, { status: res.status });
}

async function safeJson(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
