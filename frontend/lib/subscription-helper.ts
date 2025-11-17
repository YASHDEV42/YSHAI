"use server";

import { apiRequest } from "./api-requester";
import type {
  IPlan,
  ISubscription,
  IInvoice,
  SubscriptionWithPlan,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from "@/interfaces";

// Get all available plans
export async function getPlans() {
  return await apiRequest<IPlan[]>({
    method: "GET",
    path: "/subscriptions/plans",
  });
}

// Get current user subscription
export async function getMySubscription() {
  return await apiRequest<SubscriptionWithPlan>({
    method: "GET",
    path: "/subscriptions/me",
  });
}

// Create a new subscription
export async function createSubscription(data: CreateSubscriptionDto) {
  return await apiRequest<ISubscription, CreateSubscriptionDto>({
    method: "POST",
    path: "/subscriptions",
    body: data,
  });
}

// Update subscription (change plan or cancel)
export async function updateSubscription(
  subscriptionId: number,
  data: UpdateSubscriptionDto,
) {
  return await apiRequest<ISubscription, UpdateSubscriptionDto>({
    method: "PATCH",
    path: `/subscriptions/${subscriptionId}`,
    body: data,
  });
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: number) {
  return await apiRequest<ISubscription>({
    method: "DELETE",
    path: `/subscriptions/${subscriptionId}`,
  });
}

// Get invoices
export async function getMyInvoices() {
  return await apiRequest<IInvoice[]>({
    method: "GET",
    path: "/subscriptions/invoices",
  });
}

// Download invoice PDF
export async function downloadInvoice(invoiceId: number) {
  return await apiRequest<{ url: string }>({
    method: "GET",
    path: `/subscriptions/invoices/${invoiceId}/download`,
  });
}
