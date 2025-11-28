'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, CheckCircle } from 'lucide-react';

export function MintStrategyPanel({ replayId }: { replayId?: string }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [minting, setMinting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [snapshot, setSnapshot] = useState<any>(null);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        try {
            // Call our backend to synthesize a strategy from the replay
            const res = await fetch('/api/snapshot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ replayId, strategyType: 'mistake_correction' }),
            });
            const data = await res.json();
            setSnapshot(data);
        } catch (e) {
            console.error(e);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleMint = async () => {
        if (!snapshot) return;
        setMinting(true);

        // Simulate minting delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setMinting(false);
        setSuccess(true);
    };

    if (success) {
        return (
            <Card className="bg-green-900/20 border-green-500/50">
                <CardContent className="pt-6 flex flex-col items-center text-green-400">
                    <CheckCircle className="h-12 w-12 mb-2" />
                    <p className="font-bold">Strategy Minted!</p>
                    <p className="text-xs">Your strategy is now an on-chain asset.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-slate-900 border-slate-700 text-white">
            <CardHeader>
                <CardTitle className="text-lg">Mint Strategy Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {!snapshot ? (
                    <div className="text-center space-y-4">
                        <p className="text-sm text-slate-400">
                            Turn your recent gameplay into a tradable strategy asset.
                        </p>
                        <Button
                            onClick={handleAnalyze}
                            disabled={analyzing || !replayId}
                            className="w-full bg-blue-600 hover:bg-blue-500"
                        >
                            {analyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Replay...
                                </>
                            ) : (
                                'Analyze & Create Snapshot'
                            )}
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in">
                        <div className="bg-slate-800 p-3 rounded text-sm">
                            <div className="font-bold text-blue-400">{snapshot.name}</div>
                            <div className="text-slate-300 mt-1">{snapshot.description}</div>
                            <div className="flex gap-2 mt-2 text-xs text-slate-500">
                                <span>Efficiency: {snapshot.stats.efficiency}</span>
                                <span>Risk: {snapshot.stats.risk}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handleMint}
                            disabled={minting}
                            className="w-full bg-purple-600 hover:bg-purple-500"
                        >
                            {minting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Minting...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Mint as NFT (Simulated)
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
