"use server";

import { apiRequest, ApiResult } from "./api-requester";
import { updateTag } from "next/cache";
import { IMedia } from "@/interfaces";

export interface UploadMediaDto {
  postId?: number;
}

export interface UploadMediaResponse extends IMedia {}

export async function uploadMedia(
  formData: FormData,
): Promise<ApiResult<IMedia>> {
  return apiRequest<IMedia>({
    method: "POST",
    path: "/media",
    formData,
    cache: "no-store",
  });
}

export async function listMedia(): Promise<ApiResult<IMedia[]>> {
  return apiRequest<IMedia[]>({
    method: "GET",
    path: "/media",
    cache: {
      tags: ["media"],
    },
  });
}

export async function deleteMedia(
  mediaId: number,
): Promise<ApiResult<{ message: string }>> {
  const result = await apiRequest<{ message: string }>({
    method: "DELETE",
    path: `/media/${mediaId}`,
    cache: "no-store",
  });

  if (result.success) {
    updateTag("media");
  }

  return result;
}
