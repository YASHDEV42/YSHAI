"use server";
import { TUser } from "@/types";
import { cookies } from "next/headers";
const getUser = async (): Promise<{ user?: TUser; message: string }> => {
  const cookieSotre = await cookies();
  if (!cookieSotre.has("accessToken")) {
    return { message: "No access token found" };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/users/me`,
    {
      method: "GET",
      credentials: "include",
      next: { tags: ["current-user"] },
      headers: {
        Cookie: `accessToken=${cookieSotre.get("accessToken")?.value}`,
        "content-type": "application/json",
      },
    },
  );
  if (!response.ok) {
    return { message: "Failed to fetch user data" };
  }
  const data = await response.json();
  return { user: data, message: "Success" };
};
const getUserSocialMediaAccounts = async () => {
  const cookieStore = await cookies();
  if (!cookieStore.has("accessToken")) {
    return { message: "No access token found" };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/accounts/me`,
    {
      method: "GET",
      credentials: "include",
      next: { tags: ["current-user"] },
      headers: {
        Cookie: `accessToken=${cookieStore.get("accessToken")?.value}`,
        "content-type": "application/json",
      },
    },
  );
  if (!response.ok) {
    return { message: "Failed to fetch user social media accounts" };
  }
  const data = await response.json();
  return { socialAccounts: data, message: "Success" };
};
export { getUser, getUserSocialMediaAccounts };
