import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function handler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  const targetPath = path.join("/");
  const url = new URL(request.url);
  const targetUrl = `${API_BASE_URL.replace(/\/+$/, "")}/${targetPath}${url.search}`;

  console.log("Proxying request to:", targetUrl);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const headers = new Headers(request.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.delete("host");

  const contentType = request.headers.get("content-type") || "";

  let fetchOptions: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
  };

  if (contentType.includes("multipart/form-data")) {
    // 🔥 pass raw body
    fetchOptions.body = request.body;

    // 🔥 REQUIRED for streaming uploads in Node.js
    (fetchOptions as any).duplex = "half";
  } else if (!["GET", "HEAD"].includes(request.method)) {
    // JSON or text body
    fetchOptions.body = await request.text();
  }

  const response = await fetch(targetUrl, fetchOptions);

  const respType = response.headers.get("content-type") || "";

  if (respType.includes("application/json")) {
    const json = await response.json();
    return Response.json(json, { status: response.status });
  }

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
