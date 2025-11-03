"use server";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";

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

export async function connectInstagram(shortToken: string) {
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
          userId: "1",
        }),
      },
    );
    return await res.json();
  } catch (error) {
    console.error("Error during fetch:", error);
    return { error: "Failed to connect Instagram account" };
  }
}
