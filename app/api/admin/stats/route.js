import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function GET() {
  try {
    const client = await pool.connect();

    // 1. Benutzer-Statistiken
    const userStats = await client.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active,
        COUNT(CASE WHEN is_active = false THEN 1 END) as blocked,
        COUNT(CASE WHEN kyc_status = 'pending' THEN 1 END) as pending_kyc,
        COUNT(CASE WHEN kyc_status = 'verified' THEN 1 END) as verified_kyc
      FROM users
      WHERE role = 'user' AND deleted_at IS NULL
    `);

    // 2. Mitarbeiter-Statistiken
    const staffStats = await client.query(`
      SELECT COUNT(*) as count
      FROM staff_admins
      WHERE is_active = true
    `);

    // 3. Transaktions-Statistiken
    const txStats = await client.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COALESCE(SUM(amount), 0) as volume
      FROM transactions
      WHERE status != 'failed' AND status != 'cancelled'
    `);

    // 4. Letzte 5 Transaktionen
    const recentTx = await client.query(`
      SELECT
        t.id,
        t.transaction_type,
        t.amount,
        t.status,
        t.created_at,
        u.email as user_email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);

    client.release();

    const stats = {
      totalUsers: parseInt(userStats.rows[0]?.total || 0),
      activeUsers: parseInt(userStats.rows[0]?.active || 0),
      blockedUsers: parseInt(userStats.rows[0]?.blocked || 0),
      pendingKyc: parseInt(userStats.rows[0]?.pending_kyc || 0),
      verifiedKyc: parseInt(userStats.rows[0]?.verified_kyc || 0),
      staffCount: parseInt(staffStats.rows[0]?.count || 0),
      totalTransactions: parseInt(txStats.rows[0]?.total || 0),
      pendingTransactions: parseInt(txStats.rows[0]?.pending || 0),
      totalVolume: parseFloat(txStats.rows[0]?.volume || 0),
      activeInvestments: 0, // Kann später ergänzt werden
    };

    return NextResponse.json({
      stats,
      recentTransactions: recentTx.rows,
    });

  } catch (error) {
    console.error('❌ Stats-Fehler:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    );
  }
}