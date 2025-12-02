import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  // Detect locale
  const locale =
    routing.locales.find(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    ) ?? routing.defaultLocale;

  const isAuthPage =
    pathname === `/${locale}/login` || pathname === `/${locale}/signup`;

  if (isAuthPage) {
    if (accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
    return intlMiddleware(req);
  }

  const isProtectedPage = pathname.startsWith(`/${locale}/dashboard`);
  if (isProtectedPage) {
    if (!accessToken) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
    return intlMiddleware(req);
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
