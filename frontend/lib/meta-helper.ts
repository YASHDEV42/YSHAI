"use server";

import { apiRequest, ApiResult } from "./api-requester";

interface OauthCallbackDto {
  shortToken: string;
}

interface InstagramProfileDto {
  igUserId: string;
  username: string;
  followersCount: number;
  profilePicture: string;
}

interface PublishDto {
  caption: string;
  // On backend you are actually passing media via multipart,
  // but OpenAPI shows only caption – we keep this DTO for clarity.
}

export async function handleOAuthCallback(
  shortToken: string,
): Promise<ApiResult<any>> {
  return apiRequest<any, OauthCallbackDto>({
    method: "POST",
    path: "/meta/oauth/callback",
    body: { shortToken },
    cache: "no-store",
  });
}

export async function getInstagramProfile(
  pageId: string,
  pageToken: string,
): Promise<ApiResult<InstagramProfileDto>> {
  return apiRequest<InstagramProfileDto>({
    method: "GET",
    path: "/meta/instagram/profile",
    query: { pageId, pageToken },
    cache: "no-store",
  });
}

export async function getPageFromIgAccount(
  igUserId: string,
): Promise<ApiResult<any>> {
  return apiRequest<any>({
    method: "GET",
    path: "/meta/instagram/page",
    query: { igUserId },
    cache: "no-store",
  });
}

export async function getInstagramPosts(
  igUserId: string,
  options?: { limit?: number; after?: string },
): Promise<ApiResult<any>> {
  return apiRequest<any>({
    method: "GET",
    path: "/meta/instagram/posts",
    query: {
      igUserId,
      limit: options?.limit,
      after: options?.after,
    },
    cache: "no-store",
  });
}

export async function publishInstagramPost(
  caption: string,
  file: File,
): Promise<ApiResult<any>> {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("file", file);

  return apiRequest<any>({
    method: "POST",
    path: "/meta/publish",
    formData,
    cache: "no-store",
  });
}
