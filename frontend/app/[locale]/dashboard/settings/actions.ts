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
const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
type initialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const changeNameAction = async (
  _: initialStateType,
  formData: FormData,
) => {
  const name = formData.get("name") as string;
  const timezone = formData.get("timezone") as string;
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
  const cookieStore = await cookies();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/users/me`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({ name, timezone }),
      },
    );
    updateTag("current-user");
    return {
      arMessage: "تم تغيير الاسم بنجاح",
      enMessage: "Name changed successfully",
      success: true,
    };
  } catch (error) {
    console.error("Error changing name:", error);

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

  // Optionally log on failure
  if (!result.success) {
    console.error("❌ Meta OAuth callback failed:", result.error);
  } else {
    console.log("✅ Meta OAuth callback success:", result.data);
  }

  // Just return the ApiResult; client already expects { success, data?, error? }
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
