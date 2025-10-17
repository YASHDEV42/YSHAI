'use server';

import { usersControllerUpdateProfile } from "@/api/users/users";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateUser(initialState: any, formData: FormData): Promise<{ arMessage: string, enMessage: string, success: boolean } | void> {
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;
  const timezone = formData.get('timezone') as string;
  console.log('Form Data Received:', { name, timezone, userId });
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
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    const response = await usersControllerUpdateProfile({ name, timezone }, { headers: { Cookie: allCookies } });
    if (response.status === 200) {
      revalidatePath("/dashboard/settings");
      return {
        arMessage: 'تم تحديث الملف الشخصي بنجاح!',
        enMessage: 'Profile updated successfully!',
        success: true
      }
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      arMessage: 'حدث خطأ أثناء تحديث الملف الشخصي.',
      enMessage: 'An error occurred while updating the profile.',
      success: false
    }
  }
}

