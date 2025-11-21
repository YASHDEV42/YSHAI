"use server";

import { update } from "@/lib/post-helper";

interface ActionState {
  success: boolean;
  enMessage: string;
  arMessage: string;
}

export async function updatePostAction(
  prevState: ActionState,
  postId: number,
  formData: FormData,
): Promise<ActionState> {
  try {
    const contentAr = formData.get("contentAr") as string;
    const contentEn = formData.get("contentEn") as string;
    const scheduledAt = formData.get("scheduledAt") as string;
    const status = formData.get("status") as any;
    const campaignId = formData.get("campaignId");
    const socialAccountIds = formData.getAll("socialAccountIds").map(Number);

    const result = await update(postId, {
      contentAr: contentAr || undefined,
      contentEn: contentEn || undefined,
      scheduledAt: scheduledAt || undefined,
      status,
      socialAccountIds:
        socialAccountIds.length > 0 ? socialAccountIds : undefined,
      campaignId: campaignId ? Number(campaignId) : undefined,
    });

    if (result.success) {
      return {
        success: true,
        enMessage: "Post updated successfully!",
        arMessage: "تم تحديث المنشور بنجاح!",
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to update post",
      arMessage: result.error || "فشل في تحديث المنشور",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while updating the post",
      arMessage: "حدث خطأ أثناء تحديث المنشور",
    };
  }
}
