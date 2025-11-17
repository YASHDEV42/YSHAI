"use server";

import { apiRequest, ApiResult } from "./api-requester";

export interface ICampaign {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface CreateCampaignDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export async function listCampaigns(): Promise<ApiResult<ICampaign[]>> {
  return apiRequest<ICampaign[]>({
    method: "GET",
    path: "/campaigns",
    cache: { tags: ["campaigns"], revalidate: 3600 },
  });
}

export async function createCampaign(
  dto: CreateCampaignDto,
): Promise<ApiResult<ICampaign>> {
  return apiRequest<ICampaign, CreateCampaignDto>({
    method: "POST",
    path: "/campaigns",
    body: dto,
    cache: "no-store",
  });
}

export async function getCampaignById(
  id: number,
): Promise<ApiResult<ICampaign>> {
  return apiRequest<ICampaign>({
    method: "GET",
    path: `/campaigns/${id}`,
    cache: { tags: [`campaign-${id}`], revalidate: 3600 },
  });
}

export async function updateCampaign(
  id: number,
  dto: Partial<CreateCampaignDto>,
): Promise<ApiResult<ICampaign>> {
  return apiRequest<ICampaign, Partial<CreateCampaignDto>>({
    method: "PUT",
    path: `/campaigns/${id}`,
    body: dto,
    cache: "no-store",
  });
}

export async function deleteCampaign(id: number): Promise<ApiResult<void>> {
  return apiRequest<void>({
    method: "DELETE",
    path: `/campaigns/${id}`,
    cache: "no-store",
  });
}
