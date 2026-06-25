import { NextResponse } from 'next/server';

// Wichtig: In Next.js App Router muss die Route eine GET-Funktion exportieren
export async function GET() {
  try {
    // Einfacher Test ohne Datenbank (zuerst)
    return NextResponse.json({
      success: true,
      message: 'API funktioniert!',
      timestamp: new Date().toISOString(),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}