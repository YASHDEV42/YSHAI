"use server";
import { TUser } from "@/types";
import { cookies } from "next/headers";

const getUser = async (): Promise<{ user?: TUser; message: string }> => {
  const cookieStore = await cookies();
  if (!cookieStore.has("accessToken")) {
    return { message: "No access token found" };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/users/me`,
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
    return { message: "Failed to fetch user data" };
  }
  const data = await response.json();
  return { user: data, message: "Success" };
};
export { getUser };
