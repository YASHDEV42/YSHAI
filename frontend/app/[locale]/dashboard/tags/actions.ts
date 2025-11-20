"use server";

import {
  createTag,
  deleteTag,
  updateTag,
  getOrCreateTag,
} from "@/lib/tag-helper";

import { ITag } from "@/interfaces";
import { revalidatePath, revalidateTag } from "next/cache";

interface ActionState {
  success: boolean;
  enMessage: string;
  arMessage: string;
  data?: ITag;
  error?: string;
}

/* ---------------------------------------------------------
 * Revalidate Helper
 * --------------------------------------------------------- */
function revalidateTags() {
  // Revalidate API tag cache
  revalidateTag("tags", "");

  // Revalidate UI pages
  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/create");
}

/* ---------------------------------------------------------
 * Unified Error Extractor
 * --------------------------------------------------------- */
function extractErrorMessage(err: any): string {
  if (!err) return "Unknown error";

  if (typeof err === "string") return err;
  if (err.error) return err.error;
  if (err.message) return err.message;

  return "Unknown error";
}

/* ---------------------------------------------------------
 * CREATE TAG
 * --------------------------------------------------------- */
export async function createTagAction(
  prevState: ActionState,
  data: { name: string },
): Promise<ActionState> {
  try {
    const result = await createTag(data);

    if (result.success && result.data) {
      revalidateTags();
      return {
        success: true,
        enMessage: "Tag created successfully!",
        arMessage: "تم إنشاء الوسم بنجاح!",
        data: result.data,
      };
    }

    const msg = extractErrorMessage(result);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
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

/* ---------------------------------------------------------
 * UPDATE TAG
 * --------------------------------------------------------- */
export async function updateTagAction(
  prevState: ActionState,
  id: number,
  data: { name?: string; metadata?: Record<string, any> },
): Promise<ActionState> {
  try {
    const result = await updateTag(id, data);

    if (result.success && result.data) {
      revalidateTags();
      return {
        success: true,
        enMessage: "Tag updated successfully!",
        arMessage: "تم تحديث الوسم بنجاح!",
        data: result.data,
      };
    }

    const msg = extractErrorMessage(result);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
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

/* ---------------------------------------------------------
 * GET OR CREATE TAG
 * (Useful for auto-creating tags from UI)
 * --------------------------------------------------------- */
export async function getOrCreateTagAction(
  prevState: ActionState,
  name: string,
): Promise<ActionState> {
  try {
    const result = await getOrCreateTag(name);

    if (result.success && result.data) {
      revalidateTags();
      return {
        success: true,
        enMessage: "Tag ready!",
        arMessage: "الوسم جاهز!",
        data: result.data,
      };
    }

    const msg = extractErrorMessage(result);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
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

/* ---------------------------------------------------------
 * DELETE TAG
 * --------------------------------------------------------- */
export async function deleteTagAction(
  prevState: ActionState,
  id: number,
): Promise<ActionState> {
  try {
    const result = await deleteTag(id);

    if (result.success) {
      revalidateTags();
      return {
        success: true,
        enMessage: "Tag deleted successfully!",
        arMessage: "تم حذف الوسم بنجاح!",
      };
    }

    const msg = extractErrorMessage(result);
    return {
      success: false,
      enMessage: msg,
      arMessage: msg,
      error: msg,
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
