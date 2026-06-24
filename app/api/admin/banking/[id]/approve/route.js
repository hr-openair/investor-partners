import { NextResponse } from 'next/server';

// Mock-Daten (in Produktion: Datenbank-Update)
let mockDeposits = [
  { id: 1, user_id: 2, user_email: 'anna@example.com', amount: 10000, status: 'pending' },
  { id: 3, user_id: 1, user_email: 'max@example.com', amount: 5000, status: 'pending' },
];

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const depositId = parseInt(id);

    const deposit = mockDeposits.find(d => d.id === depositId);
    if (!deposit) {
      return NextResponse.json(
        { error: 'Einzahlung nicht gefunden' },
        { status: 404 }
      );
    }

    deposit.status = 'completed';
    return NextResponse.json({ success: true, deposit });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Bestätigen der Einzahlung' },
      { status: 500 }
    );
  }
}