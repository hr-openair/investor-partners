import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const cookieStore = request.cookies;

  // 1. Root-Pfad (/) auf /de umleiten
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/de', request.url));
  }

  // 2. Sprache erkennen
  const pathnameParts = pathname.split('/').filter(Boolean);
  const firstSegment = pathnameParts[0] || '';
  const locales = ['de', 'en'];
  const hasLocale = locales.includes(firstSegment);
  const locale = hasLocale ? firstSegment : 'de';

  // 3. Keine Sprache in der URL → umleiten
  if (!hasLocale && pathname !== '/') {
    const isApi = pathname.startsWith('/api');
    const isStatic = pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico)$/);
    const isNextStatic = pathname.startsWith('/_next');

    if (!isApi && !isStatic && !isNextStatic) {
      return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
    }
  }

  // 4. 🔐 ADMIN-BEREICH SCHÜTZEN
  if (pathname.includes('/admin')) {
    const token = cookieStore.get('token');

    if (!token) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Token validieren
    try {
      const decoded = jwt.verify(token.value, process.env.JWT_SECRET || 'fallback-secret');

      // Prüfen, ob Benutzer Admin-Rolle hat
      if (decoded.role !== 'admin' && decoded.role !== 'super_admin') {
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
    } catch (error) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};