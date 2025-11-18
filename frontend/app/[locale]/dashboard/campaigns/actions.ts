"use server";

import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  ICampaign,
} from "@/lib/campaign-helper";
import { revalidatePath } from "next/cache";

interface ActionState {
  success: boolean;
  enMessage: string;
  arMessage: string;
  data?: ICampaign;
  error?: string;
}
function revalidateCampaigns() {
  revalidatePath("/dashboard/campaigns");
  revalidatePath("/dashboard/create");
}
function extractErrorMessage(err: any): string {
  if (!err) return "Unknown error";

  // from apiRequest: { success: false, error: "..."}
  if (typeof err === "string") return err;

  if (err?.error) return err.error;

  if (err?.message) return err.message;

  return "Unknown error";
}
export async function createCampaignAction(
  prevState: ActionState,
  data: {
    name: string;
    description?: string | null;
    startsAt?: string | null;
    endsAt?: string | null;
    status?: string;
  },
): Promise<ActionState> {
  try {
    const result = await createCampaign(data);

    if (result.success && result.data) {
      revalidateCampaigns();
      return {
        success: true,
        enMessage: "Campaign created successfully!",
        arMessage: "تم إنشاء الحملة بنجاح!",
        data: result.data,
      };
    }

    return {
      success: false,
      enMessage: extractErrorMessage(result),
      arMessage: extractErrorMessage(result),
      error: extractErrorMessage(result),
    };
  } catch (err) {
    const msg = extractErrorMessage(err);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
    };
  }
}

export async function updateCampaignAction(
  prevState: ActionState,
  id: number,
  data: Partial<{
    name: string;
    description?: string | null;
    startsAt?: string | null;
    endsAt?: string | null;
    status?: string;
  }>,
): Promise<ActionState> {
  try {
    const result = await updateCampaign(id, data);

    if (result.success && result.data) {
      revalidateCampaigns();
      return {
        success: true,
        enMessage: "Campaign updated successfully!",
        arMessage: "تم تحديث الحملة بنجاح!",
        data: result.data,
      };
    }

    return {
      success: false,
      enMessage: extractErrorMessage(result),
      arMessage: extractErrorMessage(result),
      error: extractErrorMessage(result),
    };
  } catch (err) {
    const msg = extractErrorMessage(err);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
    };
  }
}

export async function deleteCampaignAction(
  prevState: ActionState,
  id: number,
): Promise<ActionState> {
  try {
    const result = await deleteCampaign(id);

    if (result.success) {
      revalidateCampaigns();
      return {
        success: true,
        enMessage: "Campaign deleted successfully!",
        arMessage: "تم حذف الحملة بنجاح!",
      };
    }

    return {
      success: false,
      enMessage: extractErrorMessage(result),
      arMessage: extractErrorMessage(result),
      error: extractErrorMessage(result),
    };
  } catch (err) {
    const msg = extractErrorMessage(err);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
    };
  }
}
