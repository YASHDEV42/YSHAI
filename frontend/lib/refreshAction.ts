"use server";

import { cookies } from "next/headers";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
export const refreshAction = async (refreshToken: string): Promise<{ accessToken: string, newRefreshToken: string }> => {
  console.log("In refreshAction with refreshToken:", refreshToken);
  const cookieStore = await cookies();
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
  console.log("Received new accessToken:", accessToken);
  return { accessToken, newRefreshToken };
}
