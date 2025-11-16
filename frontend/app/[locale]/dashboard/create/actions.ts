"use server";

import { IPost } from "@/interfaces";
import { ApiResult } from "@/lib/api-requester";
import { create } from "@/lib/post-helper";

type InitialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const createPostAction = async (
  _: InitialStateType,
  formData: FormData,
): Promise<InitialStateType> => {
  try {
    const contentAr = formData.get("contentAr")?.toString() || undefined;
    const contentEn = formData.get("contentEn")?.toString() || undefined;

    const status = (formData.get("status")?.toString() || "draft") as
      | "draft"
      | "scheduled"
      | "published"
      | "failed"
      | "pending_approval";

    const scheduledAtRaw = formData.get("scheduledAt")?.toString() || undefined;

    const authorId = Number(formData.get("authorId"));
    const teamId =
      formData.get("teamId") !== null
        ? Number(formData.get("teamId"))
        : undefined;

    const socialIdsRaw = formData.getAll("socialAccountIds");
    const socialAccountIds =
      socialIdsRaw.length > 0 ? socialIdsRaw.map((v) => Number(v)) : undefined;

    const campaignId =
      formData.get("campaignId") !== null
        ? Number(formData.get("campaignId"))
        : undefined;

    const templateId =
      formData.get("templateId") !== null
        ? Number(formData.get("templateId"))
        : undefined;

    const isRecurring =
      formData.get("isRecurring")?.toString() === "true" ? true : false;

    if (!authorId || isNaN(authorId)) {
      return {
        success: false,
        enMessage: "Author is required",
        arMessage: "المؤلف مطلوب",
      };
    }

    if (!socialAccountIds || socialAccountIds.length === 0) {
      return {
        success: false,
        enMessage: "At least one social account is required",
        arMessage: "مطلوب اختيار حساب اجتماعي واحد على الأقل",
      };
    }

    if (status === "scheduled") {
      if (!scheduledAtRaw) {
        return {
          success: false,
          enMessage: "scheduledAt is required for scheduled posts",
          arMessage: "وقت النشر مطلوب للمنشورات المجدولة",
        };
      }

      const dateCheck = new Date(scheduledAtRaw);

      if (isNaN(dateCheck.getTime())) {
        return {
          success: false,
          enMessage: "Invalid scheduledAt date format",
          arMessage: "صيغة التاريخ غير صحيحة",
        };
      }

      if (dateCheck < new Date()) {
        return {
          success: false,
          enMessage: "scheduledAt must be a future date",
          arMessage: "وقت النشر يجب أن يكون في المستقبل",
        };
      }
    }

    const dto = {
      contentAr,
      contentEn,
      status,
      scheduledAt: scheduledAtRaw,
      authorId,
      teamId,
      socialAccountIds,
      campaignId,
      templateId,
      isRecurring,
    };

    try {
      const result: ApiResult<IPost> = await create(dto);
      console.log("createPostAction Result:", result);
    } catch (e) {
      console.log(e);
      return {
        success: false,
        enMessage: "Failed to create post due to server error",
        arMessage: "فشل في إنشاء المنشور بسبب خطأ في الخادم",
      };
    }

    return {
      success: true,
      enMessage: "Post created successfully",
      arMessage: "تم إنشاء المنشور بنجاح",
    };
  } catch (err: any) {
    console.error("createPostAction Error:", err);

    return {
      success: false,
      enMessage: "Something went wrong while creating the post",
      arMessage: "حدث خطأ أثناء إنشاء المنشور",
    };
  }
};
