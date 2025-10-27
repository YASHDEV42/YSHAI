import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './app/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { refreshAction } from '@/lib/refreshAction'

// Setup next-intl middleware (locale routing)
const intlMiddleware = createIntlMiddleware(routing)

// backend API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000'

// Prevent concurrent refresh calls
let refreshPromise: Promise<{ accessToken: string; newRefreshToken: string }> | null = null

// Main proxy handler
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // if the request is NOT for /api/proxy, use intl middleware
  if (!pathname.startsWith('/api/proxy')) {
    return intlMiddleware(req)
  }

  // Otherwise, handle API proxy with refresh logic
  const url = new URL(req.url)
  const path = url.pathname.replace(/^\/api\/proxy/, '')
  const targetUrl = `${API_BASE_URL}${path}${url.search}`

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  const refreshToken = cookieStore.get('refreshToken')?.value

  console.log(`Proxying ${req.method} → ${targetUrl}`)
  console.log('AccessToken:', accessToken ? '✅ present' : '❌ absent')
  console.log('RefreshToken:', refreshToken ? '✅ present' : '❌ absent')

  const headers = new Headers(req.headers)
  headers.delete('host')
  headers.delete('connection')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : await req.text()

  let res = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
  })

  // 3️⃣ Handle expired access token
  if (res.status === 401 && refreshToken) {
    console.log('Access token expired → trying refresh...')

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAction(refreshToken)
      }
      const { accessToken: newAccessToken, newRefreshToken } = await refreshPromise

      // Update cookies with new tokens
      const nextCookies = await cookies()
      nextCookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 15 * 60, // 15 minutes
      })
      console.log('✅ Access token refreshed.')

      if (newRefreshToken) {
        nextCookies.set('refreshToken', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60, // 7 days
        })
      }

      // Retry the original request
      const retryHeaders = new Headers(req.headers)
      retryHeaders.delete('host')
      retryHeaders.delete('connection')
      retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

      res = await fetch(targetUrl, {
        method: req.method,
        headers: retryHeaders,
        body,
      })
    } catch (err) {
      console.error('❌ Token refresh failed:', err)
      return NextResponse.json(
        { error: 'Session expired. Please log in again.' },
        { status: 401 }
      )
    } finally {
      refreshPromise = null
    }
  }

  const data = await safeJson(res)
  return NextResponse.json(data, { status: res.status })
}

async function safeJson(res: Response) {
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    return res.json()
  }
  return res.text()
}

export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\..*).*)', // everything except internal Next paths/files
  ],
}
