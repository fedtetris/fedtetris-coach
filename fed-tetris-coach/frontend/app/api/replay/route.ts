import { NextResponse } from 'next/server';
import { open } from 'sqlite';
import path from 'path';

export const dynamic = 'force-dynamic';

async function saveReplay(replayData: any) {
    const sqlite3 = require('sqlite3');
    const filename = path.join(process.cwd(), 'strategy-cache.sqlite');
    const db = await open({
        filename,
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS replays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_wallet TEXT,
      score INTEGER,
      replay_json TEXT,
      created_at INTEGER
    );
  `);

    await db.run(
        'INSERT INTO replays (user_wallet, score, replay_json, created_at) VALUES (?, ?, ?, ?)',
        replayData.wallet || 'anon',
        replayData.score,
        JSON.stringify(replayData),
        Date.now()
    );
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        await saveReplay(body);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Replay API Error:', error);
        return NextResponse.json({ error: 'Failed to save replay' }, { status: 500 });
    }
}
