"use server";

import { forgotPassword } from "@/lib/auth-helper";

type initialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const forgotPasswordAction = async (
  _: initialStateType,
  formData: FormData,
): Promise<initialStateType> => {
  const email = formData.get("email") as string;

  if (!email) {
    return {
      arMessage: "البريد الإلكتروني مطلوب",
      enMessage: "Email is required",
      success: false,
    };
  }

  const result = await forgotPassword(email);

  if (result.success) {
    return {
      arMessage: "تم إرسال رابط إعادة التعيين! تحقق من بريدك الإلكتروني.",
      enMessage: "Reset link sent! Check your email.",
      success: true,
    };
  }

  return {
    arMessage: result.error || "فشل إرسال رابط إعادة التعيين",
    enMessage: result.error || "Failed to send reset link",
    success: false,
  };
};
