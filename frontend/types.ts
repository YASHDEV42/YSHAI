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
