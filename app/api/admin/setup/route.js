import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST() {
  try {
    const client = await pool.connect();

    try {
      // Prüfen, ob Admin bereits existiert
      const existing = await client.query(
        'SELECT id FROM users WHERE email = $1',
        ['admin@investor.com']
      );

      if (existing.rows.length > 0) {
        return NextResponse.json({
          success: true,
          message: 'Admin-Benutzer existiert bereits',
          user: existing.rows[0],
        });
      }

      // Passwort hashen
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);

      // Admin-Benutzer anlegen
      const result = await client.query(
        `INSERT INTO users (
          email, password_hash, full_name, role, kyc_status, is_active, is_verified, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
        RETURNING id, email, full_name, role`,
        ['admin@investor.com', passwordHash, 'Admin User', 'admin', 'verified', true, true]
      );

      // Auch in staff_admins eintragen
      await client.query(
        `INSERT INTO staff_admins (user_id, role, can_create, can_read, can_update, can_delete, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [result.rows[0].id, 'super_admin', true, true, true, true, true]
      );

      return NextResponse.json({
        success: true,
        message: '✅ Admin-Benutzer erfolgreich erstellt!',
        user: result.rows[0],
        credentials: {
          email: 'admin@investor.com',
          password: 'admin123',
        },
      });

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ Setup-Fehler:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}