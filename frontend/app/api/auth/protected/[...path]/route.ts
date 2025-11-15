import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

export async function handler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const originalPath = path.join("/");

  const url = new URL(request.url);
  const queryString = url.search;
  const targetUrl = `${API_BASE_URL.replace(/\/+$/, "")}/${originalPath}${queryString}`;
  console.log("Proxying request to:", targetUrl);
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    console.log("No access token found");
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.text() : undefined;

  const res = await fetch(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Cookies: `accessToken=${accessToken}`,
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

  return Response.json(data, { status: res.status });
}

export { handler as GET };
export { handler as POST };
export { handler as PUT };
export { handler as PATCH };
export { handler as DELETE };
