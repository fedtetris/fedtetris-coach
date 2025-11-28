import { open, Database } from 'sqlite';
import path from 'path';

// Initialize DB
let db: Database | null = null;

async function getDb() {
  if (!db) {
    const sqlite3 = require('sqlite3');
    const filename = path.join(process.cwd(), 'strategy-cache.sqlite');
    db = await open({
      filename,
      driver: sqlite3.Database
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS advice_cache (
        state_hash TEXT PRIMARY KEY,
        advice_json TEXT,
        created_at INTEGER
      );
    `);
  }
  return db;
}

export async function getCachedAdvice(stateHash: string) {
  const db = await getDb();
  const result = await db.get('SELECT advice_json FROM advice_cache WHERE state_hash = ?', stateHash);
  return result ? JSON.parse(result.advice_json) : null;
}

export async function cacheAdvice(stateHash: string, advice: any) {
  const db = await getDb();
  await db.run(
    'INSERT OR REPLACE INTO advice_cache (state_hash, advice_json, created_at) VALUES (?, ?, ?)',
    stateHash,
    JSON.stringify(advice),
    Date.now()
  );
}
