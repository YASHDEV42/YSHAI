"use server";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";

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

  if (data.length === 0) {
    return {
      socialAccounts: [],
      message: "No connected social media accounts",
    };
  }
  return { socialAccounts: data, message: "Success" };
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

export async function getInstagramPostsAction(
  igUserId: string,
  limit?: number,
  after?: string,
) {
  const params = new URLSearchParams({ igUserId });
  if (limit) params.append("limit", limit.toString());
  if (after) params.append("after", after);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/instagram/posts?${params.toString()}`,
    {
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  console.log("Response data:", await res.clone().text());

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Failed to fetch Instagram posts:", text);
    return { success: false, message: "Failed to fetch Instagram posts" };
  }

  const data = await res.json();
  return { success: true, posts: data };
}

export async function publishInstagramPostAction(caption: string, file: File) {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("file", file);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      success: false,
      message: "No access token found. Please log in again.",
    };
  }
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/publish`,
      {
        method: "POST",
        body: formData,
        cache: "no-store",
        headers: {
          Cookie: `accessToken=${accessToken}`,
        },
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Failed to publish Instagram post:", text);
      return { success: false, message: "Failed to publish Instagram post" };
    }

    const data = await res.json();
    return { success: true, post: data };
  } catch (error) {
    console.error("❌ Error publishing Instagram post:", error);
    return { success: false, message: "Error publishing Instagram post" };
  }
}

export async function handleMetaOAuthCallbackAction(shortToken: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/oauth/callback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortToken }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ OAuth callback failed:", text);
    return { success: false, message: "Failed to handle Meta OAuth callback" };
  }

  const data = await res.json();
  return { success: true, linked: data };
}
export { getUserSocialMediaAccounts, disconnectAccount };
