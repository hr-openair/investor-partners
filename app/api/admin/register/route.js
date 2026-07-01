import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request) {
  try {
    const { email, password, full_name, phone, role, kyc_status } = await request.json();

    // 1. Validierung
    if (!email || !password) {
      return NextResponse.json(
        { message: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Passwort muss mindestens 6 Zeichen lang sein' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // 2. Prüfen, ob E-Mail bereits existiert
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      );

      if (existing.rows.length > 0) {
        return NextResponse.json(
          { message: 'Diese E-Mail-Adresse ist bereits registriert' },
          { status: 409 }
        );
      }

      // 3. Passwort hashen
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // 4. Benutzer erstellen
      const result = await client.query(
        `INSERT INTO users (
          email, password_hash, full_name, phone, role, kyc_status, is_active, is_verified, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        RETURNING id, email, full_name, role, kyc_status, created_at`,
        [email, passwordHash, full_name || null, phone || null, role || 'user', kyc_status || 'pending', true, false]
      );

      const newUser = result.rows[0];

      return NextResponse.json({
        success: true,
        message: 'Benutzer erfolgreich registriert',
        user: newUser,
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Registrierungsfehler:', error);
    return NextResponse.json(
      { message: 'Interner Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}