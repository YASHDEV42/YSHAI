"use server";

import { ITag } from "@/interfaces";
import { apiRequest, ApiResult } from "./api-requester";

interface CreateTagDto {
  name: string;
}

interface ListTagParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* ---------------------------------------------------------
 * LIST TAGS (pagination + search + correct query params)
 * --------------------------------------------------------- */
export async function listTags(
  page = 1,
  limit = 50,
  search?: string,
): Promise<ApiResult<ITag[]>> {
  return apiRequest<ITag[]>({
    method: "GET",
    path: `/tags?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`,
    cache: { tags: ["tags"], revalidate: 3600 },
  });
}

/* ---------------------------------------------------------
 * CREATE TAG
 * --------------------------------------------------------- */
export async function createTag(dto: CreateTagDto): Promise<ApiResult<ITag>> {
  return apiRequest<ITag, CreateTagDto>({
    method: "POST",
    path: "/tags",
    body: dto,
    cache: "no-store",
  });
}

/* ---------------------------------------------------------
 * GET ONE TAG
 * --------------------------------------------------------- */
export async function getTag(id: number): Promise<ApiResult<ITag>> {
  return apiRequest<ITag>({
    method: "GET",
    path: `/tags/${id}`,
    cache: "no-store",
  });
}

/* ---------------------------------------------------------
 * DELETE TAG
 * --------------------------------------------------------- */
export async function deleteTag(id: number): Promise<ApiResult<void>> {
  return apiRequest<void>({
    method: "DELETE",
    path: `/tags/${id}`,
    cache: "no-store",
  });
}
