"use server";

import { register } from "@/lib/auth-helper";

type InitialStateType = {
  arMessage: string;
  enMessage: string;
  success: boolean;
};

export const registerAction = async (
  _: InitialStateType,
  formData: FormData,
): Promise<InitialStateType> => {
  const name = (formData.get("name") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const password = (formData.get("password") ?? "").toString();

  // Optional: you can send these from the form as hidden inputs.
  const timezone = (formData.get("timezone") as string) || "UTC"; // or your app's default timezone
  const timeFormat = (formData.get("timeFormat") as "12h" | "24h") || "24h";

  // Basic validations (same style as loginAction)
  if (!name && !email && !password) {
    return {
      arMessage: "جميع الحقول مطلوبة",
      enMessage: "All fields are required",
      success: false,
    };
  }

  if (!name) {
    return {
      arMessage: "الاسم مطلوب",
      enMessage: "Name is required",
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

  if (password.length < 8) {
    return {
      arMessage: "يجب أن تكون كلمة المرور ثمانية أحرف على الأقل",
      enMessage: "Password must be at least 8 characters",
      success: false,
    };
  }

  const result = await register({
    name,
    email,
    password,
    timezone,
    timeFormat,
  });

  if (!result.success) {
    return {
      arMessage: "فشل إنشاء الحساب",
      enMessage: result.error || "Registration failed",
      success: false,
    };
  }

  // Backend returns MessageResponse; we only need to tell the client it worked.
  return {
    arMessage:
      "تم إنشاء الحساب بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب",
    enMessage:
      "Account created successfully. Please check your email to verify your account",
    success: true,
  };
};
