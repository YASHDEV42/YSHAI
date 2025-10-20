"use server";

import { cookies } from "next/headers";

const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function apiClient(path: string, options: RequestInit = {}) {
  const cookieStore = await cookies();

  // manually build the cookie header
  const cookieHeader = [
    cookieStore.get("accessToken") ? `accessToken=${cookieStore.get("accessToken")?.value}` : null,
    cookieStore.get("refreshToken") ? `refreshToken=${cookieStore.get("refreshToken")?.value}` : null,
  ]
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${APP_BASE_URL}/api/proxy${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
