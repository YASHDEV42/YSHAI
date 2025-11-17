"use server";

import { createTag, deleteTag } from "@/lib/tag-helper";
import { ITag } from "@/interfaces";
import { revalidatePath } from "next/cache";

interface ActionState {
  success: boolean;
  enMessage: string;
  arMessage: string;
  data?: ITag;
}

export async function createTagAction(
  prevState: ActionState,
  data: { name: string },
): Promise<ActionState> {
  try {
    const result = await createTag(data);

    if (result.success && result.data) {
      revalidatePath("/dashboard/tags");
      revalidatePath("/dashboard/create");
      return {
        success: true,
        enMessage: "Tag created successfully!",
        arMessage: "تم إنشاء الوسم بنجاح!",
        data: result.data,
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to create tag",
      arMessage: result.errorAr || "فشل في إنشاء الوسم",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while creating the tag",
      arMessage: "حدث خطأ أثناء إنشاء الوسم",
    };
  }
}

export async function deleteTagAction(
  prevState: ActionState,
  id: number,
): Promise<ActionState> {
  try {
    const result = await deleteTag(id);

    if (result.success) {
      revalidatePath("/dashboard/tags");
      revalidatePath("/dashboard/create");
      return {
        success: true,
        enMessage: "Tag deleted successfully!",
        arMessage: "تم حذف الوسم بنجاح!",
      };
    }

    return {
      success: false,
      enMessage: result.error || "Failed to delete tag",
      arMessage: result.errorAr || "فشل في حذف الوسم",
    };
  } catch (error) {
    return {
      success: false,
      enMessage: "An error occurred while deleting the tag",
      arMessage: "حدث خطأ أثناء حذف الوسم",
    };
  }
}
