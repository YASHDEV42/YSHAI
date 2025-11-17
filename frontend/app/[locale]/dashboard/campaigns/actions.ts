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
}

export async function createCampaignAction(
  prevState: ActionState,
  data: {
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
  },
): Promise<ActionState> {
  try {
    const result = await createCampaign(data);

    if (result.success && result.data) {
      revalidatePath("/dashboard/campaigns");
      revalidatePath("/dashboard/create");
      return {
        success: true,
        enMessage: "Campaign created successfully!",
        arMessage: "تم إنشاء الحملة بنجاح!",
        data: result.data,
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to create campaign",
      arMessage: result.errorAr || "فشل في إنشاء الحملة",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while creating the campaign",
      arMessage: "حدث خطأ أثناء إنشاء الحملة",
    };
  }
}

export async function updateCampaignAction(
  prevState: ActionState,
  id: number,
  data: Partial<{
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    isActive: boolean;
  }>,
): Promise<ActionState> {
  try {
    const result = await updateCampaign(id, data);

    if (result.success && result.data) {
      revalidatePath("/dashboard/campaigns");
      revalidatePath("/dashboard/create");
      return {
        success: true,
        enMessage: "Campaign updated successfully!",
        arMessage: "تم تحديث الحملة بنجاح!",
        data: result.data,
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to update campaign",
      arMessage: result.errorAr || "فشل في تحديث الحملة",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while updating the campaign",
      arMessage: "حدث خطأ أثناء تحديث الحملة",
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
      revalidatePath("/dashboard/campaigns");
      revalidatePath("/dashboard/create");
      return {
        success: true,
        enMessage: "Campaign deleted successfully!",
        arMessage: "تم حذف الحملة بنجاح!",
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to delete campaign",
      arMessage: result.errorAr || "فشل في حذف الحملة",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while deleting the campaign",
      arMessage: "حدث خطأ أثناء حذف الحملة",
    };
  }
}
