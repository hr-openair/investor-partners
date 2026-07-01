import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();

    // NUR Benutzer mit Rolle 'user' (Kunden/Investoren)
    const result = await client.query(`
      SELECT
        id, email, full_name, phone,
        kyc_status, role, is_active, is_verified,
        blocked_at, created_at, last_login
      FROM users
      WHERE role = 'user'
        AND deleted_at IS NULL
      ORDER BY created_at DESC
    `);

    client.release();
    return NextResponse.json({ customers: result.rows });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Kunden' },
      { status: 500 }
    );
  }
}