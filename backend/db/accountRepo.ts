import { pool } from "./db.js";

// Save or update account balance
export async function upsertAccount(address: string, balance: string) {
  await pool.query(
    `INSERT INTO accounts(address, balance, updated_at)
     VALUES($1, $2, NOW())
     ON CONFLICT(address) DO UPDATE SET balance = $2, updated_at = NOW()`,
    [address, balance]
  );
}

// Get account balance from DB
export async function getAccountBalance(address: string) {
  const res = await pool.query(
    `SELECT balance FROM accounts WHERE address = $1`,
    [address]
  );
  return res.rows[0]?.balance || null;
}

// Save cache (key: 'gasPrice' or 'blockNumber')
export async function setCache(key: string, value: string) {
  await pool.query(
    `INSERT INTO cache(key, value, updated_at)
     VALUES($1, $2, NOW())
     ON CONFLICT(key) DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, value]
  );
}

// Get cache
export async function getCache(key: string) {
  const res = await pool.query(`SELECT value FROM cache WHERE key = $1`, [key]);
  return res.rows[0]?.value || null;
}
