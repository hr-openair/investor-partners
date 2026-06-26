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

  // 3. Keine Sprache in der URL → auf /de umleiten (außer bei statischen Assets)
  if (!hasLocale && pathname !== '/') {
    // Prüfen, ob es sich um eine API-Route oder statische Datei handelt
    const isApi = pathname.startsWith('/api');
    const isStatic = pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|webp|ico)$/);
    const isNextStatic = pathname.startsWith('/_next');

    // API und statische Dateien nicht umleiten
    if (!isApi && !isStatic && !isNextStatic) {
      return NextResponse.redirect(new URL(`/de${pathname}`, request.url));
    }
  }

  // 4. Admin-Bereich: Prüfen, ob Benutzer authentifiziert ist (optional)
  // Hier könnte eine Session-Prüfung für /admin/* eingebaut werden
  // if (pathname.includes('/admin') && !request.cookies.get('token')) {
  //   return NextResponse.redirect(new URL(`/${firstSegment || 'de'}/login`, request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};