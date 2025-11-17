"use server";

import { ITag } from "@/interfaces";
import { apiRequest, ApiResult } from "./api-requester";

interface CreateTagDto {
  name: string;
  metadata?: Record<string, any>;
}

export async function listTags(): Promise<ApiResult<ITag[]>> {
  return apiRequest<ITag[]>({
    method: "GET",
    path: "/tags",
    cache: { tags: ["tags"], revalidate: 3600 },
  });
}

export async function createTag(dto: CreateTagDto): Promise<ApiResult<ITag>> {
  return apiRequest<ITag, CreateTagDto>({
    method: "POST",
    path: "/tags",
    body: dto,
    cache: "no-store",
  });
}

export async function deleteTag(id: number): Promise<ApiResult<void>> {
  return apiRequest<void>({
    method: "DELETE",
    path: `/tags/${id}`,
    cache: "no-store",
  });
}
