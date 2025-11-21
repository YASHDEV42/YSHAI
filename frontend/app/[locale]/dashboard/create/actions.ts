"use server";

import type { IPost } from "@/interfaces";
import type { ApiResult } from "@/lib/api-requester";
import { create } from "@/lib/post-helper";
import { uploadMedia } from "@/lib/media-helper";
import { extractErrorMessage } from "@/lib/error-utils";

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
    const files = formData.getAll("files") as File[];
    formData.delete("files"); // Do not send files to /posts endpoint
    const contentAr = formData.get("contentAr")?.toString() || undefined;
    const contentEn = formData.get("contentEn")?.toString() || undefined;
    const status = (formData.get("status")?.toString() || "draft") as any;
    const scheduledAt = formData.get("scheduledAt")?.toString() || undefined;

    const authorId = Number(formData.get("authorId"));
    const socialAccountIds = formData
      .getAll("socialAccountIds")
      .map((v) => Number(v));

    const campaignIdStr = formData.get("campaignId")?.toString();
    const campaignId = campaignIdStr ? Number(campaignIdStr) : undefined;

    const dto = {
      contentAr,
      contentEn,
      status,
      scheduledAt,
      authorId,
      socialAccountIds,
      campaignId,
    };

    const postResult: ApiResult<IPost> = await create(dto);

    if (!postResult.success || !postResult.data) {
      const msg = extractErrorMessage(postResult);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    console.log("Post created:", postResult.data);
    const post = postResult.data;

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("postId", String(post.id));

      const uploadResult = await uploadMedia(fd);

      if (!uploadResult.success) {
        console.error("Media upload failed:", uploadResult);
      }
    }

    // Finish
    return {
      success: true,
      enMessage: "Post created successfully",
      arMessage: "تم إنشاء المنشور بنجاح",
    };
  } catch (err) {
    console.error("createPostAction Error:", err);

    return {
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};
