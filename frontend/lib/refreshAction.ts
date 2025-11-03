"use server";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const refreshAction = async (
  refreshToken: string,
): Promise<{ accessToken: string; newRefreshToken: string }> => {
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

  return { accessToken, newRefreshToken };
};
