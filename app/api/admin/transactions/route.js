import { NextResponse } from 'next/server';

// Mock-Daten (später durch Datenbank ersetzen)
const mockTransactions = [
  {
    id: 1,
    user_id: 1,
    user_email: 'max@example.com',
    type: 'buy',
    amount: 5000,
    status: 'completed',
    created_at: '2026-06-22T10:30:00Z'
  },
  {
    id: 2,
    user_id: 2,
    user_email: 'anna@example.com',
    type: 'deposit',
    amount: 10000,
    status: 'pending',
    created_at: '2026-06-22T09:15:00Z'
  },
  {
    id: 3,
    user_id: 1,
    user_email: 'max@example.com',
    type: 'sell',
    amount: 2500,
    status: 'completed',
    created_at: '2026-06-21T16:45:00Z'
  },
  {
    id: 4,
    user_id: 3,
    user_email: 'tim@example.com',
    type: 'withdraw',
    amount: 1500,
    status: 'failed',
    created_at: '2026-06-20T14:20:00Z'
  },
];

export async function GET() {
  // In Produktion: Datenbankabfrage
  return NextResponse.json({ transactions: mockTransactions });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newTransaction = {
      id: mockTransactions.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      status: body.status || 'pending',
    };
    mockTransactions.push(newTransaction);
    return NextResponse.json({ success: true, transaction: newTransaction });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen der Transaktion' },
      { status: 500 }
    );
  }
}