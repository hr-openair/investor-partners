import { NextResponse } from 'next/server';

// Mock-Daten (später durch Datenbank ersetzen)
const mockInvestments = [
  {
    id: 1,
    user_id: 1,
    user_email: 'max@example.com',
    name: 'Global Growth Fund',
    shares: 45,
    purchase_price: 120.50,
    current_price: 135.20,
    purchase_date: '2026-01-15',
  },
  {
    id: 2,
    user_id: 2,
    user_email: 'anna@example.com',
    name: 'Tech Innovation ETF',
    shares: 30,
    purchase_price: 85.00,
    current_price: 92.75,
    purchase_date: '2026-02-01',
  },
  {
    id: 3,
    user_id: 1,
    user_email: 'max@example.com',
    name: 'Green Energy Fund',
    shares: 20,
    purchase_price: 210.00,
    current_price: 195.30,
    purchase_date: '2026-03-10',
  },
];

export async function GET() {
  return NextResponse.json({ investments: mockInvestments });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newInvestment = {
      id: mockInvestments.length + 1,
      ...body,
      purchase_date: body.purchase_date || new Date().toISOString(),
    };
    mockInvestments.push(newInvestment);
    return NextResponse.json({ success: true, investment: newInvestment });
  } catch (error) {
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Investments' },
      { status: 500 }
    );
  }
}