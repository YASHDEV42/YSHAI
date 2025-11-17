"use server";

import { IMedia, IPost, IPostTarget } from "@/interfaces";
import { apiRequest, ApiResult } from "./api-requester";

interface CreatePostDto {
  contentAr?: string;
  contentEn?: string;
  scheduledAt?: string;
  status?: "draft" | "scheduled" | "published" | "failed" | "pending_approval";
  isRecurring?: boolean;
  authorId: number;
  teamId?: number;
  socialAccountIds: number[];
  campaignId?: number;
  templateId?: number;
  tagIds?: number[]; // Add tagIds support
}

interface UpdatePostDto {
  contentAr?: string;
  contentEn?: string;
  scheduledAt?: string;
  status?: "draft" | "scheduled" | "published" | "failed" | "pending_approval";
  isRecurring?: boolean;
  teamId?: number;
  socialAccountIds?: number[];
  campaignId?: number;
  templateId?: number;
  tagIds?: number[]; // Add tagIds support
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
