"use server";

import { login, resendVerification } from "@/lib/auth-helper";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type initialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
  needsVerification?: boolean;
  userEmail?: string;
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
    const errorMessage = result.error || "Login failed";
    const isVerificationError =
      errorMessage.toLowerCase().includes("verify") ||
      errorMessage.toLowerCase().includes("not verified");

    return {
      arMessage: isVerificationError
        ? "يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول"
        : "كلمة المرور أو البريد الإلكتروني غير صحيح",
      enMessage: errorMessage,
      success: false,
      needsVerification: isVerificationError,
      userEmail: isVerificationError ? email : undefined,
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

export const resendVerificationAction = async (
  email: string,
): Promise<{ arMessage: string; enMessage: string; success: boolean }> => {
  if (!email) {
    return {
      arMessage: "البريد الإلكتروني مطلوب",
      enMessage: "Email is required",
      success: false,
    };
  }

  const result = await resendVerification(email);

  if (!result.success) {
    return {
      arMessage: "فشل إرسال بريد التحقق. يرجى المحاولة مرة أخرى.",
      enMessage: result.error || "Failed to send verification email",
      success: false,
    };
  }

  return {
    arMessage: "تم إرسال بريد التحقق! يرجى التحقق من بريدك الوارد.",
    enMessage: "Verification email sent! Please check your inbox.",
    success: true,
  };
};
