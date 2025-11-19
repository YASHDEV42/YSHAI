"use server";

import { createTag, deleteTag } from "@/lib/tag-helper";
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
 * Revalidate Helper (aligned with campaign actions)
 * --------------------------------------------------------- */
function revalidateTags() {
  // Revalidate cache tags if used elsewhere
  revalidateTag("tags", "");

  // Revalidate UI pages
  revalidatePath("/dashboard/tags");
  revalidatePath("/dashboard/create");
}

/* ---------------------------------------------------------
 * Unified Error Extractor (same as campaign actions)
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
