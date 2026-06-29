import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Verbindungspool mit SSL-Konfiguration für Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Wichtig für Render!
  },
  max: 20, // Maximale Verbindungen
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;

    // 1. Prüfen, ob DATABASE_URL existiert
    if (!dbUrl) {
      return NextResponse.json({
        success: false,
        message: '❌ DATABASE_URL nicht in Umgebungsvariablen gefunden',
        hasDbUrl: false,
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    // 2. Verbindung testen
    const client = await pool.connect();

    try {
      // 3. Datenbank-Informationen abfragen
      const result = await client.query(`
        SELECT
          NOW() as current_time,
          version() as pg_version,
          (SELECT COUNT(*) FROM information_schema.tables
           WHERE table_schema = 'public') as table_count,
          current_database() as database_name,
          inet_server_addr() as server_address
      `);

      // 4. Tabellen auflisten (für besseren Überblick)
      const tablesResult = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);

      const tables = tablesResult.rows.map(row => row.table_name);

      return NextResponse.json({
        success: true,
        message: '✅ Datenbankverbindung erfolgreich!',
        hasDbUrl: true,
        data: {
          currentTime: result.rows[0].current_time,
          postgresVersion: result.rows[0].pg_version,
          tableCount: parseInt(result.rows[0].table_count),
          databaseName: result.rows[0].database_name,
          serverAddress: result.rows[0].server_address,
          tables: tables,
        },
        connection: {
          url: dbUrl.replace(/:[^:@]*@/, ':***@'), // URL mit verstecktem Passwort
          host: dbUrl.split('@')[1]?.split('/')[0] || 'unbekannt',
          database: dbUrl.split('/').pop() || 'unbekannt',
        },
        nodeEnv: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('❌ Datenbankverbindungsfehler:', error);

    // Detaillierte Fehlerinformationen
    return NextResponse.json({
      success: false,
      message: '❌ Datenbankverbindung fehlgeschlagen',
      hasDbUrl: !!process.env.DATABASE_URL,
      error: {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
      },
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}