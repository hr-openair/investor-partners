import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        message: 'DATABASE_URL nicht gefunden',
        hasDbUrl: false,
        nodeEnv: process.env.NODE_ENV
      });
    }

    // PostgreSQL Verbindung testen
    const pool = new Pool({ connectionString: dbUrl });
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT
          NOW() as current_time,
          version() as pg_version,
          (SELECT COUNT(*) FROM information_schema.tables
           WHERE table_schema = 'public') as table_count
      `);

      return NextResponse.json({
        success: true,
        message: '✅ Datenbankverbindung erfolgreich!',
        data: {
          currentTime: result.rows[0].current_time,
          postgresVersion: result.rows[0].pg_version,
          tableCount: result.rows[0].table_count,
        },
        hasDbUrl: true,
        nodeEnv: process.env.NODE_ENV
      });
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error('DB Connection Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
      },
      { status: 500 }
    );
  }
}