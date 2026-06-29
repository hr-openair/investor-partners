import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

export async function POST() {
  const client = await pool.connect();

  try {
    // 1. Benutzer-Tabelle
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        phone VARCHAR(50),
        date_of_birth DATE,
        kyc_status VARCHAR(50) DEFAULT 'pending',
        role VARCHAR(50) DEFAULT 'user',
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        blocked_at TIMESTAMP WITH TIME ZONE,
        blocked_reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      )
    `);

    // 2. Investments
    await client.query(`
      CREATE TABLE IF NOT EXISTS investments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        symbol VARCHAR(50) UNIQUE,
        investment_type VARCHAR(50) NOT NULL,
        current_price DECIMAL(15, 4) NOT NULL DEFAULT 0,
        currency VARCHAR(3) DEFAULT 'EUR',
        is_active BOOLEAN DEFAULT true,
        description TEXT,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. User Investments
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_investments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        investment_id INTEGER NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
        shares DECIMAL(15, 6) NOT NULL DEFAULT 0,
        purchase_price DECIMAL(15, 4) NOT NULL,
        purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, investment_id)
      )
    `);

    // 4. Transactions
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        investment_id INTEGER REFERENCES investments(id) ON DELETE SET NULL,
        transaction_type VARCHAR(20) NOT NULL,
        shares DECIMAL(15, 6),
        price DECIMAL(15, 4),
        amount DECIMAL(15, 4) NOT NULL,
        fee DECIMAL(15, 4) DEFAULT 0,
        tax DECIMAL(15, 4) DEFAULT 0,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        description TEXT,
        reference_id VARCHAR(255),
        approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        approved_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 5. Payment Methods
    await client.query(`
      CREATE TABLE IF NOT EXISTS payment_methods (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bank_name VARCHAR(255) NOT NULL,
        account_number VARCHAR(255) NOT NULL,
        iban VARCHAR(50),
        bic VARCHAR(50),
        is_primary BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, account_number)
      )
    `);

    // 6. Deposits & Withdrawals
    await client.query(`
      CREATE TABLE IF NOT EXISTS deposits_withdrawals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        payment_method_id INTEGER REFERENCES payment_methods(id) ON DELETE SET NULL,
        transaction_id INTEGER REFERENCES transactions(id) ON DELETE SET NULL,
        amount DECIMAL(15, 4) NOT NULL,
        type VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        proof_document_url TEXT,
        approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
        approved_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 7. Staff Admins
    await client.query(`
      CREATE TABLE IF NOT EXISTS staff_admins (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        permissions JSONB DEFAULT '{"users": true, "transactions": true, "investments": true, "banking": true, "staff": false}',
        can_create BOOLEAN DEFAULT true,
        can_read BOOLEAN DEFAULT true,
        can_update BOOLEAN DEFAULT true,
        can_delete BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      )
    `);

    // 8. Audit Log
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        action VARCHAR(100) NOT NULL,
        table_name VARCHAR(100) NOT NULL,
        record_id INTEGER,
        old_data JSONB,
        new_data JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    return NextResponse.json({
      success: true,
      message: '✅ Migration erfolgreich! 8 Tabellen wurden erstellt.',
      tables: ['users', 'investments', 'user_investments', 'transactions', 'payment_methods', 'deposits_withdrawals', 'staff_admins', 'audit_log'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Migrationsfehler:', error);
    return NextResponse.json({
      success: false,
      message: '❌ Migration fehlgeschlagen',
      error: {
        message: error.message,
        code: error.code,
        detail: error.detail,
      },
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  } finally {
    client.release();
  }
}