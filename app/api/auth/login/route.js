import { NextResponse } from 'next/server';

// MOCK-Datenbank (für Produktion durch echte DB ersetzen)
const users = [
  {
    id: 1,
    email: 'investor@example.com',
    password: 'secure123',
    name: 'Max Mustermann',
  },
];

export async function POST(request) {
  try {
    const { email, password, locale = 'de' } = await request.json();

    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: locale === 'de' ? 'Ungültige Anmeldedaten' : 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Token erstellen (vereinfacht)
    const token = Buffer.from(
      JSON.stringify({ userId: user.id, email: user.email })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}