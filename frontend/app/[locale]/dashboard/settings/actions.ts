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
    throw new Error("Not authenticated");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PROTECTED_API_KEY}/meta/oauth/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString(),
        },
        body: JSON.stringify({
          shortToken,
        }),
      },
    );
    return await res.json();
  } catch (error) {
    console.error("Error during fetch:", error);
    return { error: "Failed to connect Instagram account" };
  }
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
