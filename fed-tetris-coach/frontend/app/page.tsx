'use client';

import React from 'react';
import Tetris from '@/components/TetrisBoard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Setup QueryClient
const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Strategy Asset Studio
            </h1>
            <p className="text-slate-400">FedRL Coach Studio</p>
          </div>
        </div>

        <Tetris />

      </main>
    </QueryClientProvider>
  );
}