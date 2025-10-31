"use server";

import { cookies } from "next/headers";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const refreshAction = async (
  refreshToken: string,
): Promise<{ accessToken: string }> => {
  const response = await fetch(`${BaseURL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const { accessToken, newRefreshToken } = await response.json();

  let cookiesStore = await cookies();
  cookiesStore.delete("accessToken");
  cookiesStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });
  cookiesStore.set("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return { accessToken };
};
