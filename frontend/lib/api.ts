'use server';
const BaseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
import { cookies } from 'next/headers';

interface ApiOptions extends RequestInit {
}

async function apiFetch(url: string, options: ApiOptions = {}): Promise<any> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('accessToken')?.value;

  // Helper to make the request with current token
  const makeRequest = async (token: string | undefined) => {
    const headers = new Headers(options.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return fetch(`${BaseURL}${url}`, {
      ...options,
      headers,
    });
  };

  // Initial request
  let response = await makeRequest(accessToken);

  // If 401, attempt refresh
  if (response.status === 401) {
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      throw new Error('No refresh token available. Please log in again.');
    }

    // Call refresh endpoint
    const refreshResponse = await fetch('http://your-nestjs-backend/api/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshResponse.ok) {
      // Refresh failed: Clear cookies and throw (e.g., for logout)
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      throw new Error('Session expired. Please log in again.');
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshResponse.json();

    // Update cookies (set options for security)
    cookieStore.set('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    if (newRefreshToken) { // If backend provides a new refresh token
      cookieStore.set('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    // Retry original request with new token
    response = await makeRequest(newAccessToken);
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export { apiFetch };
