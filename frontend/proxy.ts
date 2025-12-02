import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./app/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    !pathname.startsWith("/api/auth") &&
    !pathname.startsWith("/api/protected")
  ) {
    return intlMiddleware(req);
  }
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
