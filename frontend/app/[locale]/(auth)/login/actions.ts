"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
type initialStateType = {
  arMessage: string,
  enMessage: string,
  success: boolean,
}
export const loginAction = async (_: initialStateType, formData: FormData): Promise<initialStateType> => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email && !password) {
    return {
      arMessage: 'جميع الحقول مطلوبة',
      enMessage: 'All fields are required',
      success: false,
    }
  }
  if (!email) {
    return {
      arMessage: 'البريد الإلكتروني مطلوب',
      enMessage: 'Email is required',
      success: false,
    }
  }
  if (!password) {
    return {
      arMessage: 'كلمة المرور مطلوبة',
      enMessage: 'Password is required',
      success: false,
    }
  }
  const response = await fetch(`${BaseURL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log('Login response status:', response.status);

  if (!response.ok) {
    return {
      arMessage: 'فشل تسجيل الدخول',
      enMessage: 'Login failed',
      success: false,
    }
  }
  const { accessToken, refreshToken } = await response.json();

  const cookieStore = await cookies();
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60,
    path: '/',
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });

  revalidatePath('/dashboard');
  return {
    arMessage: 'تم تسجيل الدخول بنجاح',
    enMessage: 'Login successful',
    success: true,
  }

}
