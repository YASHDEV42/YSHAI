export type TUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  timezone?: string;
  isEmailVerified: boolean;
  language?: string;
  locale?: string;
  timeformat?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
export type TConnectedAccount = {
  id: number;
  provider: "instagram" | "facebook" | "x" | "linkedin" | "tiktok";
  providerAccountId: string;
  active: boolean;
  disconnectedAt?: string | null;
  username?: string;
  followers?: number;
  accountType?: string;
  profilePicture?: string;
};
