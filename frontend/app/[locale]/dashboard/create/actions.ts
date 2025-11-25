"use server";

import type { IPost } from "@/interfaces";
import type { ApiResult } from "@/lib/api-requester";
import {
  create,
  update as updatePost,
  remove as removePost,
  publishNow as publishPostNow,
  reschedule as reschedulePost,
  createDraft,
} from "@/lib/post-helper";
import { uploadMedia } from "@/lib/media-helper";
import { extractErrorMessage } from "@/lib/error-utils";

export type PostActionState = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

const defaultState: PostActionState = {
  success: false,
  enMessage: "",
  arMessage: "",
};

/**
 * CREATE POST + upload attached media files
 */
export const createPostAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
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
      .map((v) => Number(v))
      .filter((n) => !Number.isNaN(n));

    const campaignIdStr = formData.get("campaignId")?.toString();
    const campaignId = campaignIdStr ? Number(campaignIdStr) : undefined;

    if (!authorId || Number.isNaN(authorId)) {
      return {
        success: false,
        enMessage: "Invalid author",
        arMessage: "المؤلف غير صالح",
      };
    }

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

    const post = postResult.data;

    // Upload media files linked to this post
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("postId", String(post.id));

      const uploadResult = await uploadMedia(fd);
      if (!uploadResult.success) {
        console.error("Media upload failed:", uploadResult);
      }
    }

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

/**
 * UPDATE POST + optionally upload new media
 * Expecting: formData has "postId" or "id" and same fields as create.
 */
export const updatePostAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  try {
    const files = formData.getAll("files") as File[];
    formData.delete("files");

    const idStr =
      formData.get("id")?.toString() || formData.get("postId")?.toString();
    const id = idStr ? Number(idStr) : NaN;

    if (!id || Number.isNaN(id)) {
      return {
        ...defaultState,
        success: false,
        enMessage: "Invalid post id",
        arMessage: "معرّف المنشور غير صالح",
      };
    }

    const contentAr = formData.get("contentAr")?.toString() || undefined;
    const contentEn = formData.get("contentEn")?.toString() || undefined;
    const status = (formData.get("status")?.toString() || undefined) as
      | any
      | undefined;
    const scheduledAt = formData.get("scheduledAt")?.toString() || undefined;

    const socialAccountIdsRaw = formData.getAll("socialAccountIds");
    const socialAccountIds =
      socialAccountIdsRaw.length > 0
        ? socialAccountIdsRaw
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n))
        : undefined;

    const campaignIdStr = formData.get("campaignId")?.toString();
    const campaignId =
      campaignIdStr && campaignIdStr.length > 0
        ? Number(campaignIdStr)
        : undefined;

    const dto: Parameters<typeof updatePost>[1] = {
      contentAr,
      contentEn,
      status,
      scheduledAt,
      socialAccountIds,
      campaignId,
    };

    const result = await updatePost(id, dto);

    if (!result.success || !result.data) {
      const msg = extractErrorMessage(result);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    // Upload new media, if any
    if (files.length > 0) {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("postId", String(id));

        const uploadResult = await uploadMedia(fd);
        if (!uploadResult.success) {
          console.error("Media upload failed:", uploadResult);
        }
      }
    }

    return {
      success: true,
      enMessage: "Post updated successfully",
      arMessage: "تم تحديث المنشور بنجاح",
    };
  } catch (err) {
    console.error("updatePostAction Error:", err);
    return {
      ...defaultState,
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};

/**
 * DELETE POST
 */
export const deletePostAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  try {
    const idStr =
      formData.get("id")?.toString() || formData.get("postId")?.toString();
    const id = idStr ? Number(idStr) : NaN;

    if (!id || Number.isNaN(id)) {
      return {
        success: false,
        enMessage: "Invalid post id",
        arMessage: "معرّف المنشور غير صالح",
      };
    }

    const result = await removePost(id);

    if (!result.success) {
      const msg = extractErrorMessage(result);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    return {
      success: true,
      enMessage: "Post deleted successfully",
      arMessage: "تم حذف المنشور بنجاح",
    };
  } catch (err) {
    console.error("deletePostAction Error:", err);
    return {
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};

/**
 * PUBLISH NOW
 */
export const publishNowAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  try {
    const idStr =
      formData.get("id")?.toString() || formData.get("postId")?.toString();
    const id = idStr ? Number(idStr) : NaN;

    if (!id || Number.isNaN(id)) {
      return {
        success: false,
        enMessage: "Invalid post id",
        arMessage: "معرّف المنشور غير صالح",
      };
    }

    const result = await publishPostNow(id);

    if (!result.success || !result.data) {
      const msg = extractErrorMessage(result);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    return {
      success: true,
      enMessage: "Post published successfully",
      arMessage: "تم نشر المنشور بنجاح",
    };
  } catch (err) {
    console.error("publishNowAction Error:", err);
    return {
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};

/**
 * RESCHEDULE POST
 */
export const reschedulePostAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  try {
    const idStr =
      formData.get("id")?.toString() || formData.get("postId")?.toString();
    const id = idStr ? Number(idStr) : NaN;

    const scheduledAt =
      formData.get("scheduledAt")?.toString() ||
      formData.get("scheduleAt")?.toString() ||
      "";

    if (!id || Number.isNaN(id)) {
      return {
        success: false,
        enMessage: "Invalid post id",
        arMessage: "معرّف المنشور غير صالح",
      };
    }

    if (!scheduledAt) {
      return {
        success: false,
        enMessage: "Scheduled date is required",
        arMessage: "تاريخ النشر مطلوب",
      };
    }

    const result = await reschedulePost(id, scheduledAt);

    if (!result.success || !result.data) {
      const msg = extractErrorMessage(result);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    return {
      success: true,
      enMessage: "Post rescheduled successfully",
      arMessage: "تم إعادة جدولة المنشور بنجاح",
    };
  } catch (err) {
    console.error("reschedulePostAction Error:", err);
    return {
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};

/**
 * CREATE DRAFT POST
 */
export const createDraftPostAction = async (
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> => {
  try {
    const contentAr = formData.get("contentAr")?.toString() || undefined;
    const contentEn = formData.get("contentEn")?.toString() || undefined;

    const authorIdStr = formData.get("authorId")?.toString();
    const authorId = authorIdStr ? Number(authorIdStr) : NaN;

    const teamIdStr = formData.get("teamId")?.toString();
    const teamId =
      teamIdStr && teamIdStr.length > 0 ? Number(teamIdStr) : undefined;

    if (!authorId || Number.isNaN(authorId)) {
      return {
        success: false,
        enMessage: "Invalid author",
        arMessage: "المؤلف غير صالح",
      };
    }

    const dto = {
      contentAr,
      contentEn,
      authorId,
      teamId,
    };

    const result = await createDraft(dto);

    if (!result.success || !result.data) {
      const msg = extractErrorMessage(result);
      return {
        success: false,
        enMessage: msg,
        arMessage: msg,
      };
    }

    return {
      success: true,
      enMessage: "Draft created successfully",
      arMessage: "تم إنشاء المسودة بنجاح",
    };
  } catch (err) {
    console.error("createDraftPostAction Error:", err);
    return {
      success: false,
      enMessage: "Something went wrong",
      arMessage: "حدث خطأ غير متوقع",
    };
  }
};
