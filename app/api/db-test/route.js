import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    return NextResponse.json({
      success: true,
      message: 'Datenbankverbindung erfolgreich!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('DB Connection Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}