"use server";

import { resetPassword } from "@/lib/auth-helper";
import { redirect } from "next/navigation";

type initialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const resetPasswordAction = async (
  token: string,
  _: initialStateType,
  formData: FormData,
): Promise<initialStateType> => {
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!newPassword || !confirmPassword) {
    return {
      arMessage: "كلمة المرور مطلوبة",
      enMessage: "Password is required",
      success: false,
    };
  }

  if (newPassword.length < 8) {
    return {
      arMessage: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
      enMessage: "Password must be at least 8 characters",
      success: false,
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      arMessage: "كلمات المرور غير متطابقة",
      enMessage: "Passwords do not match",
      success: false,
    };
  }

  const result = await resetPassword(token, newPassword);

  if (result.success) {
    redirect("/login");
  }

  return {
    arMessage: result.error || "فشل إعادة تعيين كلمة المرور",
    enMessage: result.error || "Failed to reset password",
    success: false,
  };
};
