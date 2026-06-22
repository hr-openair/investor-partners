import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // 1. Root-Pfad (/) auf /de umleiten
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/de', request.url));
  }

  // 2. Sprache erkennen
  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameParts[0] || '';
  const locales = ['de', 'en'];
  const hasLocale = locales.includes(firstSegment);

  // 3. Keine Sprache in der URL → auf /de umleiten
  if (!hasLocale && pathname !== '/') {
    return NextResponse.redirect(new URL(`/de${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};