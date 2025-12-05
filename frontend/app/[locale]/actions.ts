"use server";

import { cookies } from "next/headers";

export async function logoutAction(): Promise<void> {
  const Cookies = await cookies();
  Cookies.delete("accessToken");
}
