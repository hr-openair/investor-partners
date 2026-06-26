import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT
        s.*,
        u.email as user_email,
        u.full_name as user_name
      FROM staff_admins s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `);
    client.release();
    return NextResponse.json({ staff: result.rows });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Mitarbeiter' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await pool.connect();

    const result = await client.query(`
      INSERT INTO staff_admins (
        user_id, role, permissions, can_create, can_read, can_update, can_delete, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      body.user_id,
      body.role || 'admin',
      body.permissions || JSON.stringify({ users: true, transactions: true, investments: true, banking: true, staff: false }),
      body.can_create !== undefined ? body.can_create : true,
      body.can_read !== undefined ? body.can_read : true,
      body.can_update !== undefined ? body.can_update : true,
      body.can_delete !== undefined ? body.can_delete : false,
      body.is_active !== undefined ? body.is_active : true
    ]);

    client.release();
    return NextResponse.json({ success: true, staff: result.rows[0] });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Mitarbeiters' },
      { status: 500 }
    );
  }
}