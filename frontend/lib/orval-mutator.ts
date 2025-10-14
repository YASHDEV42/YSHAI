const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

/**
 * Generic mutator used by Orval-generated clients.
 * Handles URL resolution, headers, JSON parsing, and response typing.
 */
export default async function orvalMutator<T>(
  url: string,
  config: RequestInit
): Promise<T> {
  const fullUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL.replace(/\/+$/, '')}${url.startsWith('/') ? url : `/${url}`}`;

  // Default headers
  const headers = new Headers(config.headers || {});

  // Auto-set JSON header if we’re sending a body
  if (config.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // Optional: Add auth token automatically
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(fullUrl, { ...config, headers });

  // Handle empty responses
  if ([204, 205, 304].includes(response.status)) {
    return { status: response.status, headers: response.headers } as T;
  }

  // Parse response
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  // Optional: Throw on non-OK responses (recommended for better error UX)
  if (!response.ok) {
    throw {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: response.headers,
    };
  }

  return { data, status: response.status, headers: response.headers } as T;
}
