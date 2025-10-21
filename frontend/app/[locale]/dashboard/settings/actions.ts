'use server';

import { apiClient } from "@/lib/api";
import { revalidatePath } from "next/cache";

const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
type initialStateType = {
  arMessage: string,
  enMessage: string,
  success: boolean,
}

export const changeNameAction = async (_: initialStateType, formData: FormData) => {
  const name = formData.get('name') as string;
  const timezone = formData.get('timezone') as string;

  console.log('Form Data Received:', { name, timezone });
  if (!name || !timezone) {
    return {
      arMessage: 'الاسم والمنطقة الزمنية مطلوبان!',
      enMessage: 'Name and timezone are required!',
      success: false
    };
  }
  if (name.length < 3 || name.length > 15) {
    return {
      arMessage: 'يجب أن يكون الاسم بين 3 و 15 حرفًا.',
      enMessage: 'Name must be between 3 and 15 characters.',
      success: false
    }
  }
  try {
    const response = await apiClient('/users/me', {
      method: 'PUT',
      credentials: 'include',
      body: JSON.stringify({ name, timezone }),
    });
    console.log('Change name response:', response);
    revalidatePath("/dashboard/settings");
    return {
      arMessage: 'تم تغيير الاسم بنجاح',
      enMessage: 'Name changed successfully',
      success: true,

    }

  } catch (error) {
    console.error('Error changing name:', error);

    return {
      arMessage: 'فشل تغيير الاسم',
      enMessage: 'Failed to change name',
      success: false,
    }
  }
}
