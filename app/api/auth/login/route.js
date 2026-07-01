import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request) {
  try {
    const { email, password, locale = 'de' } = await request.json();

    const client = await pool.connect();

    try {
      // 1. Benutzer finden
      const users = await client.query(
        `SELECT id, email, password_hash, full_name, role, kyc_status, is_active
         FROM users WHERE email = $1`,
        [email]
      );

      if (users.rows.length === 0) {
        return NextResponse.json(
          { message: locale === 'de' ? 'Ungültige Anmeldedaten' : 'Invalid credentials' },
          { status: 401 }
        );
      }

      const user = users.rows[0];

      // 2. Prüfen, ob Benutzer aktiv ist
      if (!user.is_active) {
        return NextResponse.json(
          { message: locale === 'de' ? 'Konto ist gesperrt' : 'Account is blocked' },
          { status: 403 }
        );
      }

      // 3. Passwort prüfen
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return NextResponse.json(
          { message: locale === 'de' ? 'Ungültige Anmeldedaten' : 'Invalid credentials' },
          { status: 401 }
        );
      }

      // 4. Token erstellen
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.full_name,
        },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      // 5. Login-Zeit aktualisieren
      await client.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // 6. Cookie setzen
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          kyc_status: user.kyc_status,
        },
      });

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
        sameSite: 'lax',
      });

      return response;

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Login-Fehler:', error);
    return NextResponse.json(
      { message: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}