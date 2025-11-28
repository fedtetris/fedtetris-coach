import { NextResponse } from 'next/server';
import { getCachedAdvice, cacheAdvice } from '@/lib/kv-cache';
import { getAiAdvice } from '@/lib/ai-coach';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { board, currentPiece } = body;

        if (!board || !currentPiece) {
            return NextResponse.json({ error: 'Missing board or piece data' }, { status: 400 });
        }

        // Create a deterministic hash of the state
        // We simplify the board to a string representation for the hash
        const stateString = JSON.stringify({ board, currentPiece });
        const stateHash = crypto.createHash('sha256').update(stateString).digest('hex');

        // 1. Check L1 Cache (SQLite)
        const cachedAdvice = await getCachedAdvice(stateHash);
        if (cachedAdvice) {
            return NextResponse.json({
                ...cachedAdvice,
                source: 'cache_l1', // Debug info
                stateHash
            });
        }

        // 2. L2: Ask AI (OpenRouter/Qwen)
        // We construct a simplified prompt payload
        const advice = await getAiAdvice({ board, currentPiece });

        // 3. Save to Cache
        await cacheAdvice(stateHash, advice);

        return NextResponse.json({
            ...advice,
            source: 'ai_generated',
            stateHash
        });

    } catch (error) {
        console.error('Coach API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
