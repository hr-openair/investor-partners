import { NextResponse } from 'next/server';

export async function GET() {
  // Mock-Statistiken (später aus Datenbank aggregieren)
  const stats = {
    totalUsers: 156,
    totalTransactions: 2341,
    totalVolume: 1250000,
    pendingDeposits: 7,
    activeInvestments: 89,
  };

  const recentTransactions = [
    { id: 1, user_email: 'max@example.com', type: 'buy', amount: 5000, status: 'completed', created_at: '2026-06-22T10:30:00Z' },
    { id: 2, user_email: 'anna@example.com', type: 'deposit', amount: 10000, status: 'pending', created_at: '2026-06-22T09:15:00Z' },
    { id: 3, user_email: 'tim@example.com', type: 'sell', amount: 2500, status: 'completed', created_at: '2026-06-21T16:45:00Z' },
  ];

  return NextResponse.json({ stats, recentTransactions });
}