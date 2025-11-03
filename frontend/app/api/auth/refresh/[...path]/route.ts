import { cookies, headers } from "next/headers";
import { refreshAction } from "@/lib/refreshAction";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

// 🔁 Shared handler for all HTTP verbs
export async function handler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const originalPath = path.join("/");

  // ✅ Preserve query params
  const url = new URL(request.url);
  const queryString = url.search;
  const targetUrl = `${API_BASE_URL.replace(/\/+$/, "")}/${originalPath}${queryString}`;
  const cookieStore = await cookies();

  // ✅ Get tokens
  const refreshToken = cookieStore.get("refreshToken")?.value;
  if (!refreshToken) {
    console.log("No refresh token found");
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let accessToken = cookieStore.get("accessToken")?.value;
  const headersList = new Headers();
  // 🔄 If no accessToken, refresh it
  if (!accessToken) {
    try {
      const { accessToken: newAccessToken, newRefreshToken } =
        await refreshAction(refreshToken);

      headersList.append(
        "Set-Cookie",
        `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=${15 * 60}; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
      );

      accessToken = newAccessToken;
      console.log("Access token refreshed successfully");
      console.log("New Access Token:", newAccessToken);
    } catch (err) {
      console.error("Token refresh failed:", err);
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  // ✅ Only include body if the method allows it
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  // ✅ Forward the request to backend
  const res = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...(hasBody && { body }),
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    console.log("No JSON response");
    // Non-JSON response (e.g. 204 No Content)
  }

  return Response.json(data, { status: res.status, headers: headersList });
}

// ✅ Export handlers for all HTTP methods
export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
