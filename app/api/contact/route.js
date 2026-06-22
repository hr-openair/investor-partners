import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, subject, message, locale = 'de' } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Hier: In Datenbank speichern & E-Mail senden
    console.log('📩 Neue Kontaktanfrage:', { name, email, subject, message });

    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: locale === 'de'
        ? 'Vielen Dank! Wir melden uns in Kürze.'
        : 'Thank you! We will get back to you shortly.',
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error sending message' },
      { status: 500 }
    );
  }
}