"use server";

import { updateTag, revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  getMySubscription,
  cancelSubscription as cancelUserSubscription,
  updateSubscription as updateUserSubscription,
  getPlans,
  getMyInvoices,
} from "@/lib/subscription-helper";

import { handleOAuthCallback } from "@/lib/meta-helper";
import { updateProfile } from "@/lib/user-helper"; // adjust path if different

type InitialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const changeNameAction = async (
  _prevState: InitialStateType,
  formData: FormData,
): Promise<InitialStateType> => {
  const name = formData.get("name") as string | null;
  const timezone = formData.get("timezone") as string | null;

  console.log("Form Data Received:", { name, timezone });

  if (!name || !timezone) {
    return {
      arMessage: "الاسم والمنطقة الزمنية مطلوبان!",
      enMessage: "Name and timezone are required!",
      success: false,
    };
  }

  if (name.length < 3 || name.length > 15) {
    return {
      arMessage: "يجب أن يكون الاسم بين 3 و 15 حرفًا.",
      enMessage: "Name must be between 3 and 15 characters.",
      success: false,
    };
  }

  try {
    const result = await updateProfile({
      name,
      timezone,
    });

    if (!result.success) {
      console.error("Error changing profile:", result.error);

      return {
        arMessage: "فشل تغيير الاسم",
        enMessage: "Failed to change name",
        success: false,
      };
    }

    // user-helper already calls updateTag("user"), but calling again is harmless.
    updateTag("user");
    // Optionally revalidate the settings page if needed
    revalidatePath("/dashboard/settings");

    return {
      arMessage: "تم تغيير الاسم بنجاح",
      enMessage: "Name changed successfully",
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error changing name:", error);

    return {
      arMessage: "فشل تغيير الاسم",
      enMessage: "Failed to change name",
      success: false,
    };
  }
};

export async function connectInstagram(shortToken: string, expiry?: any) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }

  // Delegate to the meta-helper (which uses apiRequest and ApiResult)
  const result = await handleOAuthCallback(shortToken);

  if (!result.success) {
    console.error("❌ Meta OAuth callback failed:", result.error);
  } else {
    console.log("✅ Meta OAuth callback success:", result.data);
  }

  return result;
}

export async function fetchSubscriptionData() {
  const [subscriptionResult, plansResult, invoicesResult] = await Promise.all([
    getMySubscription(),
    getPlans(),
    getMyInvoices(),
  ]);

  return {
    subscription: subscriptionResult.success
      ? subscriptionResult.data
      : undefined,
    plans: plansResult.success ? plansResult.data : [],
    invoices: invoicesResult.success ? invoicesResult.data : [],
  };
}

export async function changePlan(
  subscriptionId: number,
  newPlanId: number,
): Promise<{ success: boolean; error?: string }> {
  const result = await updateUserSubscription(subscriptionId, {
    planId: newPlanId,
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function cancelSubscription(
  subscriptionId: number,
): Promise<{ success: boolean; error?: string }> {
  const result = await cancelUserSubscription(subscriptionId);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}
