"use server";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface ConnectedAccount {
  id: number;
  provider: "instagram" | "facebook" | "x" | "linkedin" | "tiktok";
  providerAccountId: string;
  active: boolean;
  disconnectedAt?: string | null;
  username?: string;
  followers?: number;
  accountType?: string;
  profilePicture?: string;
}

export async function getConnectedAccounts(): Promise<ConnectedAccount[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return [];

  const res = await fetch(`${API_URL}/accounts/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export async function disconnectAccount(accountId: number): Promise<void> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/accounts/${accountId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to disconnect account: ${error}`);
  }
}
