"use server";

import { apiRequest, ApiResult } from "./api-requester";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  timezone: string;
  timeFormat: "12h" | "24h";
}

export interface MessageResponse {
  message: string;
}

export interface TokensResponse {
  accessToken: string;
}

// REGISTER
export async function register(
  dto: RegisterDto,
): Promise<ApiResult<MessageResponse>> {
  return apiRequest<MessageResponse, RegisterDto>({
    method: "POST",
    path: "/auth/register",
    body: dto,
    cache: "no-store",
  });
}

// LOGIN
export async function login(dto: LoginDto): Promise<ApiResult<TokensResponse>> {
  return apiRequest<TokensResponse, LoginDto>({
    method: "POST",
    path: "/auth/login",
    body: dto,
    cache: "no-store",
  });
}

// LOGOUT
export async function logout(): Promise<ApiResult<string>> {
  return apiRequest<string>({
    method: "POST",
    path: "/auth/logout",
    cache: "no-store",
  });
}

// REFRESH
export async function refresh(
  refreshToken: string,
): Promise<ApiResult<TokensResponse>> {
  return apiRequest<TokensResponse, { refreshToken: string }>({
    method: "POST",
    path: "/auth/refresh",
    body: { refreshToken },
    cache: "no-store",
  });
}

// FORGOT PASSWORD
export async function forgotPassword(
  email: string,
): Promise<ApiResult<MessageResponse>> {
  return apiRequest<MessageResponse, { email: string }>({
    method: "POST",
    path: "/auth/forgot-password",
    body: { email },
    cache: "no-store",
  });
}

// RESET PASSWORD
export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<ApiResult<MessageResponse>> {
  return apiRequest<MessageResponse, { token: string; newPassword: string }>({
    method: "POST",
    path: "/auth/reset-password",
    body: { token, newPassword },
    cache: "no-store",
  });
}

// VERIFY EMAIL
export async function verifyEmail(token: string): Promise<ApiResult<string>> {
  return apiRequest<string>({
    method: "GET",
    path: "/auth/verify",
    query: { token },
    cache: "no-store",
  });
}

// RESEND VERIFICATION
export async function resendVerification(
  email: string,
): Promise<ApiResult<MessageResponse>> {
  return apiRequest<MessageResponse, { email: string }>({
    method: "POST",
    path: "/auth/resend-verification",
    body: { email },
    cache: "no-store",
  });
}
