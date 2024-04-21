import createMiddleware from "next-intl/middleware";
// import { NextResponse } from 'next/server'
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "vi"],

  // Used when no locale matches
  defaultLocale: "vi",
  localePrefix: "never",
});

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  let isAuth = request.cookies.has("accessToken"); // => true
  const { pathname } = request.nextUrl;
  if (isAuth && (pathname === "/login" || pathname === "/signin")) {
    request.nextUrl.pathname = "/";
  } else if (!isAuth && pathname === "/") {
    request.nextUrl.pathname = `${process.env.NEXT_PUBLIC_URL}/login`;
    request.nextUrl.href = `${process.env.NEXT_PUBLIC_URL}/login`;
    return NextResponse.redirect(new URL("/login", request.url));
  } else {
    return intlMiddleware(request);
  }
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  // Match only internationalized pathnames
  // matcher: ['/((?!api|_next|_vercel\\..*).*)']
  matcher: ["/((?!api|_next|.*\\..*).*)"],
  // matcher: ['/', '/(vi|en)/:path*']
};
