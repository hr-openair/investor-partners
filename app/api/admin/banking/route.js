import { NextResponse } from 'next/server';

// Mock-Daten (später durch Datenbank ersetzen)
const mockDeposits = [
  {
    id: 1,
    user_id: 2,
    user_email: 'anna@example.com',
    amount: 10000,
    method: 'Banküberweisung',
    status: 'pending',
    created_at: '2026-06-22T09:15:00Z',
  },
  {
    id: 2,
    user_id: 3,
    user_email: 'tim@example.com',
    amount: 2500,
    method: 'Kreditkarte',
    status: 'completed',
    created_at: '2026-06-21T14:30:00Z',
  },
  {
    id: 3,
    user_id: 1,
    user_email: 'max@example.com',
    amount: 5000,
    method: 'Banküberweisung',
    status: 'pending',
    created_at: '2026-06-20T11:45:00Z',
  },
];

export async function GET() {
  return NextResponse.json({ deposits: mockDeposits });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newDeposit = {
      id: mockDeposits.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      status: body.status || 'pending',
    };
    mockDeposits.push(newDeposit);
    return NextResponse.json({ success: true, deposit: newDeposit });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Einzahlung' },
      { status: 500 }
    );
  }
}