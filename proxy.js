import { NextResponse } from 'next/server';

const locales = ['de', 'en'];
const defaultLocale = 'de';
const protectedRoutes = ['/dashboard', '/investor-portal'];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  // 1. Sprache erkennen
  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameParts[0] || '';
  const hasLocale = locales.includes(firstSegment);
  const locale = hasLocale ? firstSegment : defaultLocale;

  const response = NextResponse.next();

  // 2. Sprache im Cookie speichern
  response.cookies.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  // 3. Ohne Sprache → umleiten
  if (!hasLocale && pathname !== '/') {
    const newPath = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  // 4. Geschützte Routen prüfen
  const isProtected = protectedRoutes.some(route =>
    pathname.includes(`/${locale}${route}`) ||
    pathname.includes(route)
  );

  if (isProtected) {
    const token = cookieStore.get('token');
    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Security Header
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};