"use server";

import { apiRequest, ApiResult } from "./api-requester";
import { updateTag } from "next/cache";

// ----------------------------
// Types
// ----------------------------

export type NotificationType =
  | "post.published"
  | "post.failed"
  | "analytics.updated"
  | "subscription.ending";

export interface BaseNotificationData {
  postId: number;
}

export interface PostScheduledPayloadDto extends BaseNotificationData {
  platform: string;
  scheduledAt: string;
}

export interface PublishFailedPayloadDto extends BaseNotificationData {
  error: string;
}

export interface AiReadyPayloadDto extends BaseNotificationData {
  artifact: "caption" | "hashtags" | "alt_text";
}

export interface ApprovedPayloadDto extends BaseNotificationData {}

export type NotificationData =
  | PostScheduledPayloadDto
  | PublishFailedPayloadDto
  | AiReadyPayloadDto
  | ApprovedPayloadDto
  | null;

export interface INotification {
  id: number;
  type: NotificationType;
  title: { value: { ar: string; en: string } };
  message: { value: { ar: string; en: string } };
  data: NotificationData;
  read: boolean;
  createdAt: string;
  readAt: string | null;
  link: string | null;
}

// ----------------------------
// Helpers
// ----------------------------

export async function listNotifications(params?: {
  limit?: number;
  offset?: number;
}): Promise<ApiResult<INotification[]>> {
  const query = new URLSearchParams();

  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.offset) query.set("offset", params.offset.toString());

  return apiRequest<INotification[]>({
    method: "GET",
    path: `/notifications?${query.toString()}`,
    cache: {
      tags: ["notifications"],
    },
  });
}

export async function getUnreadNotificationsCount(): Promise<
  ApiResult<{ count: number }>
> {
  return apiRequest<{ count: number }>({
    method: "GET",
    path: "/notifications/unread-count",
    cache: {
      tags: ["notifications"],
    },
  });
}

export async function markNotificationRead(
  notificationId: number,
): Promise<ApiResult<{ message: string }>> {
  const result = await apiRequest<{ message: string }>({
    method: "PATCH",
    path: `/notifications/${notificationId}/read`,
    cache: "no-store",
  });

  if (result.success) updateTag("notifications");

  return result;
}

export async function markAllNotificationsRead(): Promise<
  ApiResult<{ message: string }>
> {
  const result = await apiRequest<{ message: string }>({
    method: "PATCH",
    path: "/notifications/mark-all-read",
    cache: "no-store",
  });

  if (result.success) updateTag("notifications");

  return result;
}

export async function deleteNotification(
  notificationId: number,
): Promise<ApiResult<{ message: string }>> {
  const result = await apiRequest<{ message: string }>({
    method: "DELETE",
    path: `/notifications/${notificationId}`,
    cache: "no-store",
  });

  if (result.success) updateTag("notifications");

  return result;
}

export async function deleteAllNotifications(): Promise<
  ApiResult<{ message: string }>
> {
  const result = await apiRequest<{ message: string }>({
    method: "DELETE",
    path: "/notifications",
    cache: "no-store",
  });

  if (result.success) updateTag("notifications");

  return result;
}
