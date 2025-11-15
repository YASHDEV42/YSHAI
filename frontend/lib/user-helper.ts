"use server";
import { IUser } from "@/interfaces";
import { apiRequest, ApiResult } from "./api-requester";
import { updateTag } from "next/cache";

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface ChangeEmailDto {
  newEmail: string;
}

interface UpdatePreferencesDto {
  timezone?: string;
  language?: string;
  locale?: string;
  timeFormat?: "12h" | "24h";
}

interface UpdateUserDto {
  name?: string;
  timezone?: string;
  timeFormat?: "12h" | "24h";
  language?: string;
  locale?: string;
}

export async function me(): Promise<ApiResult<IUser>> {
  return apiRequest<IUser>({
    method: "GET",
    path: "/users/me",
    cache: {
      tags: ["user"],
    },
  });
}

export async function updateProfile(
  dto: UpdateUserDto,
): Promise<ApiResult<IUser>> {
  const result = await apiRequest<IUser, UpdateUserDto>({
    method: "PUT",
    path: "/users/me",
    body: dto,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user");
  }

  return result;
}

export async function changePassword(
  dto: ChangePasswordDto,
): Promise<ApiResult<void>> {
  return apiRequest<void, ChangePasswordDto>({
    method: "PUT",
    path: "/users/me/password",
    body: dto,
    cache: "no-store",
  });
}

export async function changeEmail(
  dto: ChangeEmailDto,
): Promise<ApiResult<void>> {
  return apiRequest<void, ChangeEmailDto>({
    method: "PUT",
    path: "/users/me/email",
    body: dto,
    cache: "no-store",
  });
}

export async function updatePreferences(
  dto: UpdatePreferencesDto,
): Promise<ApiResult<void>> {
  const result = await apiRequest<void, UpdatePreferencesDto>({
    method: "PUT",
    path: "/users/me/preferences",
    body: dto,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user");
  }

  return result;
}

export async function deleteAccount(
  confirm = "DELETE",
): Promise<ApiResult<void>> {
  return apiRequest<void, { confirm: string }>({
    method: "DELETE",
    path: "/users/me",
    body: { confirm },
    cache: "no-store",
  });
}

export async function uploadAvatar(file: File): Promise<ApiResult<IUser>> {
  const formData = new FormData();
  formData.append("file", file);

  const result = await apiRequest<IUser>({
    method: "POST",
    path: "/users/me/avatar",
    formData,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user");
  }

  return result;
}

export async function removeAvatar(): Promise<ApiResult<IUser>> {
  const result = await apiRequest<IUser>({
    method: "DELETE",
    path: "/users/me/avatar",
    cache: "no-store",
  });

  if (result.success) {
    updateTag("user");
  }

  return result;
}
