"use server";

import { ITag } from "@/interfaces";
import { apiRequest, ApiResult } from "./api-requester";

interface CreateTagDto {
  name: string;
  metadata?: Record<string, any>;
}

interface UpdateTagDto {
  name?: string;
  metadata?: Record<string, any>;
}

interface ListTagParams {
  page?: number;
  limit?: number;
  search?: string;
}

/* ----------------------------------------
 * LIST TAGS (pagination + search)
 * --------------------------------------- */
export async function listTags(
  page = 1,
  limit = 50,
  search?: string,
): Promise<ApiResult<ITag[]>> {
  const q = `/tags?page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`;

  return apiRequest<ITag[]>({
    method: "GET",
    path: q,
    cache: { tags: ["tags"], revalidate: 3600 },
  });
}

/* ----------------------------------------
 * CREATE TAG
 * --------------------------------------- */
export async function createTag(dto: CreateTagDto): Promise<ApiResult<ITag>> {
  return apiRequest<ITag, CreateTagDto>({
    method: "POST",
    path: "/tags",
    body: dto,
    cache: "no-store",
  });
}

/* ----------------------------------------
 * GET TAG BY ID
 * --------------------------------------- */
export async function getTag(id: number): Promise<ApiResult<ITag>> {
  return apiRequest<ITag>({
    method: "GET",
    path: `/tags/${id}`,
    cache: "no-store",
  });
}

/* ----------------------------------------
 * UPDATE TAG (💡 Missing in your version)
 * --------------------------------------- */
export async function updateTag(
  id: number,
  dto: UpdateTagDto,
): Promise<ApiResult<ITag>> {
  return apiRequest<ITag, UpdateTagDto>({
    method: "PATCH",
    body: dto,
    path: `/tags/${id}`,
    cache: "no-store",
  });
}

/* ----------------------------------------
 * DELETE TAG
 * --------------------------------------- */
export async function deleteTag(id: number): Promise<ApiResult<void>> {
  return apiRequest<void>({
    method: "DELETE",
    path: `/tags/${id}`,
    cache: "no-store",
  });
}

/* ----------------------------------------
 * GET OR CREATE TAG (🔥 Optional but useful)
 * --------------------------------------- */
export async function getOrCreateTag(name: string): Promise<ApiResult<ITag>> {
  return apiRequest<ITag>({
    method: "POST",
    path: "/tags/get-or-create",
    body: { name },
    cache: "no-store",
  });
}
