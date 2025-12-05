"use server";

import { login } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type initialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};
export const loginAction = async (
  _: initialStateType,
  formData: FormData,
): Promise<initialStateType> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email && !password) {
    return {
      arMessage: "جميع الحقول مطلوبة",
      enMessage: "All fields are required",
      success: false,
    };
  }
  if (!email) {
    return {
      arMessage: "البريد الإلكتروني مطلوب",
      enMessage: "Email is required",
      success: false,
    };
  }
  if (!password) {
    return {
      arMessage: "كلمة المرور مطلوبة",
      enMessage: "Password is required",
      success: false,
    };
  }
  const result = await login({ email, password });

  if (!result.success) {
    return {
      arMessage: "كلمة المرور أو البريد الإلكتروني غير صحيح",
      enMessage: result.error || "Login failed",
      success: false,
    };
  }

  const accessToken = result.data.accessToken;

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
  return {
    arMessage: "تم تسجيل الدخول بنجاح",
    enMessage: "Login successful",
    success: true,
  };
};
