"use server";
import type { TUser } from "@/types";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";

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
      next: { tags: ["user-socialMedia"] },
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

const getConnectedAccounts = async () => {
  const cookieStore = await cookies();
  if (!cookieStore.has("accessToken")) {
    return { accounts: [], message: "No access token found" };
  }
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/accounts/me`,
    {
      method: "GET",
      credentials: "include",
      next: { tags: ["user-socialMedia"] },
      headers: {
        Cookie: `accessToken=${cookieStore.get("accessToken")?.value}`,
        "content-type": "application/json",
      },
    },
  );
  if (!response.ok) {
    return { accounts: [], message: "Failed to fetch connected accounts" };
  }
  const data = await response.json();
  return { accounts: data, message: "Success" };
};

const disconnectAccount = async (
  accountId: number,
): Promise<{ success: boolean; message: string }> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) throw new Error("Unauthorized");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/accounts/${accountId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error(text);
    return { success: false, message: "Failed to disconnect account" };
  }
  updateTag("user-socialMedia");
  const data = await response.json();
  return { success: true, message: data.message ?? "Account disconnected" };
};

export async function reconnectAccount({
  provider,
  providerAccountId,
  accessToken,
  refreshToken,
  expiresAt,
}: {
  provider: "x" | "instagram" | "linkedin" | "tiktok";
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/accounts`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${token}`,
        },
        body: JSON.stringify({
          provider,
          providerAccountId,
          accessToken,
          refreshToken,
          expiresAt,
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(text);
      return { success: false, message: "Failed to reconnect account" };
    }

    const data = await res.json();
    return { success: true, message: data.message, id: data.id };
  } catch (err) {
    return { success: false, message: "Unexpected error while reconnecting" };
  }
}

export async function getInstagramProfileAction(
  pageId: string,
  pageToken: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/instagram/profile?pageId=${pageId}&pageToken=${pageToken}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Failed to fetch IG profile:", text);
    return { success: false, message: "Failed to fetch Instagram profile" };
  }

  const data = await res.json();
  return { success: true, profile: data };
}

/**
 * 3️⃣ Resolve Page ID from IG account — GET /meta/instagram/page
 */
export async function getPageFromIgAccountAction(
  igUserId: string,
  userToken: string,
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/instagram/page?igUserId=${igUserId}&userToken=${userToken}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Failed to fetch page ID:", text);
    return { success: false, message: "Failed to get Page ID" };
  }

  const data = await res.json();
  return { success: true, page: data };
}

export {
  getUser,
  getUserSocialMediaAccounts,
  getConnectedAccounts,
  disconnectAccount,
};
