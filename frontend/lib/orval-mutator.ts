const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function orvalMutator<T>(
  url: string,
  config: RequestInit,
  _retry = false // prevent infinite loops
): Promise<T> {
  const fullUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL.replace(/\/+$/, '')}${url.startsWith('/') ? url : `/${url}`}`;

  // Always include credentials (so cookies are sent)
  const headers = new Headers(config.headers || {});
  const options: RequestInit = {
    ...config,
    headers,
    credentials: 'include', // IMPORTANT for httpOnly cookies
  };

  // Auto-set JSON header if sending a body
  if (config.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(fullUrl, options);

  // Handle empty responses
  if ([204, 205, 304].includes(response.status)) {
    return { status: response.status, headers: response.headers } as T;
  }

  // Parse content type
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  const cookies = config.headers ? (config.headers as Record<string, string>)['Cookie'] || '' : '';
  if (response.status === 401 && !_retry) {
    console.log('Unauthorized response, attempting token refresh...');
    try {
      await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          Cookie: cookies,
        }
      });
      console.log('Token refresh successful, retrying original request...');
      return await orvalMutator<T>(url, config, true);
    } catch (refreshError) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Throw error on other non-OK responses
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
