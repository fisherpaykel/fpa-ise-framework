import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { i18n, isCountryCode, isLocale } from '../i18n-config';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle static files and service worker explicitly
  const staticFileRegex = /\.(ico|json|js|png|svg|webp)$/;

  if (staticFileRegex.test(pathname)) {
    return NextResponse.next(); // Allow static files based on their extensions
  }

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  const [countryCode, lang] = segments;

  // Check if the path already has a valid countryCode and lang
  if (isCountryCode(countryCode) && isLocale(lang)) {
    return NextResponse.next(); // No redirect needed
  }

  // Redirect to the default route if countryCode or lang is missing
  const defaultCountryCode = i18n.defaultCountryCode;
  const defaultLocale = i18n.defaultLocale;

  const newUrl = new URL(
    `/${defaultCountryCode}/${defaultLocale}/home`,
    request.url
  );
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: '/((?!_next|api).*)', // Matches all except Next.js internals and API routes
};
