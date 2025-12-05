"use server";

import type { IPost } from "@/interfaces";
import { apiRequest, type ApiResult } from "./api-requester";
type PostStatus =
  | "draft"
  | "scheduled"
  | "published"
  | "failed"
  | "pending_approval";

interface CreatePostDto {
  contentAr?: string;
  contentEn?: string;
  scheduledAt?: string;
  status?: PostStatus;
  isRecurring?: boolean;
  authorId: number;
  teamId?: number;
  socialAccountIds: number[];
  campaignId?: number;
  templateId?: number;
}

interface UpdatePostDto {
  contentAr?: string;
  contentEn?: string;
  scheduledAt?: string;
  status?: PostStatus;
  isRecurring?: boolean;
  teamId?: number;
  socialAccountIds?: number[];
  campaignId?: number;
  templateId?: number;
}

interface BulkCreatePostsDto {
  posts: CreatePostDto[];
}

interface RecurringPostDto {
  contentAr?: string;
  contentEn?: string;
  interval: string;
  authorId: number;
  teamId?: number;
}

interface DraftPostDto {
  contentAr?: string;
  contentEn?: string;
  authorId: number;
  teamId?: number;
  scheduleAt?: string;
  socialAccountIds?: number[];
  campaignId?: number;
  templateId?: number;
}

export async function create(dto: CreatePostDto): Promise<ApiResult<IPost>> {
  return apiRequest<IPost, CreatePostDto>({
    method: "POST",
    path: "/posts",
    body: dto,
    cache: "no-store",
  });
}

export async function list(params: {
  status?: PostStatus[];
  teamId: string;
  campaignId: string;
  scheduledFrom: string;
  scheduledTo: string;
}): Promise<ApiResult<IPost[]>> {
  return apiRequest<IPost[]>({
    method: "GET",
    path: "/posts",
    query: params,
    cache: "no-store",
  });
}

export async function getById(id: number): Promise<ApiResult<IPost>> {
  return apiRequest<IPost>({
    method: "GET",
    path: `/posts/${id}`,
    cache: "no-store",
  });
}

export async function update(
  id: number,
  dto: UpdatePostDto,
): Promise<ApiResult<IPost>> {
  return apiRequest<IPost, UpdatePostDto>({
    method: "PUT",
    path: `/posts/${id}`,
    body: dto,
    cache: "no-store",
  });
}

export async function remove(id: number): Promise<ApiResult<void>> {
  return apiRequest<void>({
    method: "DELETE",
    path: `/posts/${id}`,
    cache: "no-store",
  });
}

export async function publishNow(id: number): Promise<ApiResult<IPost>> {
  return apiRequest<IPost>({
    method: "POST",
    path: `/posts/${id}/publish`,
    cache: "no-store",
  });
}

export async function reschedule(
  id: number,
  scheduleAt: string,
): Promise<ApiResult<IPost>> {
  return apiRequest<IPost, { scheduleAt: string }>({
    method: "PUT",
    path: `/posts/${id}/reschedule`,
    body: { scheduleAt },
    cache: "no-store",
  });
}

export async function getStatus(
  id: number,
): Promise<ApiResult<{ id: number; status: string; scheduledAt: string }>> {
  return apiRequest({
    method: "GET",
    path: `/posts/${id}/status`,
    cache: "no-store",
  });
}

export async function createRecurring(
  dto: RecurringPostDto,
): Promise<ApiResult<IPost>> {
  return apiRequest<IPost, RecurringPostDto>({
    method: "POST",
    path: `/posts/recurring`,
    body: dto,
    cache: "no-store",
  });
}

export async function createDraft(
  dto: DraftPostDto,
): Promise<ApiResult<IPost>> {
  console.log("fromtend lib post-helper dto:", dto);
  return apiRequest<IPost, DraftPostDto>({
    method: "POST",
    path: `/posts/draft`,
    body: dto,
    cache: "no-store",
  });
}

export async function bulkCreate(
  posts: CreatePostDto[],
): Promise<ApiResult<IPost[]>> {
  return apiRequest<IPost[], BulkCreatePostsDto>({
    method: "POST",
    path: "/posts/bulk",
    body: { posts },
    cache: "no-store",
  });
}
