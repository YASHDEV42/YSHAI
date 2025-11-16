"use server";
import { updateTag } from "next/cache";
import { apiRequest, ApiResult } from "./api-requester";
import { ISocialAccount } from "@/interfaces";
import { MessageResponse } from "./auth-helper";

interface LinkAccountDto {
  provider: "x" | "instagram" | "linkedin" | "tiktok";
  providerAccountId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

interface LinkAccountResponse {
  id: number;
  message: string;
}

export async function listMyAccounts(): Promise<ApiResult<ISocialAccount[]>> {
  return apiRequest<ISocialAccount[]>({
    method: "GET",
    path: "/accounts/me",
    cache: {
      tags: ["user-socialMedia"],
    },
  });
}

export async function linkAccount(
  dto: LinkAccountDto,
): Promise<ApiResult<LinkAccountResponse>> {
  const result = await apiRequest<LinkAccountResponse, LinkAccountDto>({
    method: "POST",
    path: "/accounts",
    body: dto,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user-socialMedia");
  }

  return result;
}

export async function unlinkAccount(
  accountId: number,
): Promise<ApiResult<MessageResponse>> {
  const result = await apiRequest<MessageResponse>({
    method: "DELETE",
    path: `/accounts/${accountId}`,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user-socialMedia");
  }

  return result;
}
