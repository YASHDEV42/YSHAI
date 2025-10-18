"use server";

import {
  authControllerRegister,
  authControllerLogin,
  authControllerLogout,
  authControllerRefresh,
  authControllerForgotPassword,
  authControllerResetPassword,
  authControllerResendVerification,
  authControllerVerifyEmail,
} from "@/api/auth/auth";

// ✅ Helper function for safe responses
const errorResponse = (en: string, ar: string) => ({
  success: false,
  enMessage: en,
  arMessage: ar,
});

// ✅ REGISTER
export const registerUser = async (_: any, formData: FormData) => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const timezone = formData.get("timezone") as string;
  const timeFormat = formData.get("timeFormat") as string;

  if (!name || !email || !password || !timezone || !timeFormat) {
    return errorResponse("All fields are required", "جميع الحقول مطلوبة");
  }

  try {
    await authControllerRegister({ name, email, password, timezone, timeFormat });
    return {
      success: true,
      enMessage: "Registration successful",
      arMessage: "تم التسجيل بنجاح",
    };
  } catch {
    return errorResponse(
      "Registration failed. Try again.",
      "فشل في التسجيل، حاول مرة أخرى"
    );
  }
};

// ✅ LOGIN
export const loginUser = async (_: any, formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return errorResponse("Email and password are required", "البريد الإلكتروني وكلمة المرور مطلوبان");
  }

  try {
    await authControllerLogin({ email, password });
    return {
      success: true,
      enMessage: "Logged in successfully",
      arMessage: "تم تسجيل الدخول بنجاح",
    };
  } catch {
    return errorResponse(
      "Invalid email or password",
      "البريد الإلكتروني أو كلمة المرور غير صحيحة"
    );
  }
};

// ✅ LOGOUT
export const logoutUser = async () => {
  try {
    await authControllerLogout();
    return {
      success: true,
      enMessage: "Logged out successfully",
      arMessage: "تم تسجيل الخروج بنجاح",
    };
  } catch {
    return errorResponse(
      "Failed to logout. Try again.",
      "فشل في تسجيل الخروج، حاول مرة أخرى"
    );
  }
};

// ✅ REFRESH TOKEN
export const refreshUserToken = async (_: any, formData: FormData) => {
  const refreshToken = formData.get("refreshToken") as string;
  const userId = Number(formData.get("userId"));

  if (!refreshToken || !userId) {
    return errorResponse("Invalid session", "الجلسة غير صالحة");
  }

  try {
    const tokens = await authControllerRefresh({ refreshToken, userId });
    return {
      success: true,
      tokens,
      enMessage: "Session refreshed",
      arMessage: "تم تحديث الجلسة",
    };
  } catch {
    return errorResponse("Session expired", "انتهت الجلسة");
  }
};

// ✅ FORGOT PASSWORD
export const forgotPassword = async (_: any, formData: FormData) => {
  const email = formData.get("email") as string;

  if (!email) {
    return errorResponse("Email is required", "البريد الإلكتروني مطلوب");
  }

  try {
    await authControllerForgotPassword({ email });
    return {
      success: true,
      enMessage: "Password reset link sent",
      arMessage: "تم إرسال رابط إعادة تعيين كلمة المرور",
    };
  } catch {
    return errorResponse(
      "Failed to send reset link",
      "فشل في إرسال رابط إعادة التعيين"
    );
  }
};

// ✅ RESET PASSWORD
export const resetPassword = async (_: any, formData: FormData) => {
  const token = formData.get("token") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!token || !newPassword) {
    return errorResponse(
      "Invalid reset information",
      "بيانات إعادة التعيين غير صحيحة"
    );
  }

  try {
    await authControllerResetPassword({ token, newPassword });
    return {
      success: true,
      enMessage: "Password reset successfully",
      arMessage: "تم إعادة تعيين كلمة المرور بنجاح",
    };
  } catch {
    return errorResponse("Reset failed", "فشل إعادة التعيين");
  }
};

// ✅ RESEND VERIFICATION
export const resendVerification = async (_: any, formData: FormData) => {
  const email = formData.get("email") as string;

  if (!email) {
    return errorResponse("Email is required", "البريد الإلكتروني مطلوب");
  }

  try {
    await authControllerResendVerification({ email });
    return {
      success: true,
      enMessage: "Verification email resent",
      arMessage: "تم إعادة إرسال البريد الإلكتروني للتفعيل",
    };
  } catch {
    return errorResponse(
      "Failed to resend verification email",
      "فشل في إعادة إرسال بريد التفعيل"
    );
  }
};

// ✅ VERIFY EMAIL
export const verifyEmail = async (token: string) => {
  if (!token) {
    return errorResponse("Invalid verification link", "رابط التفعيل غير صالح");
  }

  try {
    await authControllerVerifyEmail({ token });
    return {
      success: true,
      enMessage: "Email verified successfully",
      arMessage: "تم تفعيل البريد الإلكتروني بنجاح",
    };
  } catch {
    return errorResponse(
      "Verification failed",
      "فشل تفعيل البريد الإلكتروني"
    );
  }
};
