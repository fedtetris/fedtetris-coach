'use client';

import React from 'react';
import { CoachAdvice } from '../lib/api';
import { Loader2, Zap, Brain, ShieldAlert } from 'lucide-react';

interface CoachPanelProps {
  advice: CoachAdvice | null;
  isLoading: boolean;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ advice, isLoading }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-slate-700 hover:shadow-blue-900/20">
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
            <Brain className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">Strategy Engine</h2>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-medium text-blue-400 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>ANALYZING</span>
          </div>
        )}
      </div>

      {/* Content */}
      {!advice ? (
        <div className="relative flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-slate-900/50 p-3">
            <Zap className="h-6 w-6 text-slate-600" />
          </div>
          <p className="text-sm font-medium text-slate-400">Waiting for gameplay data...</p>
          <p className="text-xs text-slate-600 mt-1">AI is ready to assist</p>
        </div>
      ) : (
        <div className="relative space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Action Card */}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4 border border-white/5 transition-all hover:border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300/70">Recommended Action</span>
            <div className="mt-1 text-2xl font-black tracking-tight text-white capitalize">
              {advice.recommendedAction.replace(/_/g, ' ')}
            </div>
          </div>

          {/* Explanation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Strategic Reasoning</span>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 border-l-2 border-slate-700 pl-3">
              {advice.explanation}
            </p>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="h-3 w-3 text-emerald-400" />
              <span className="text-[10px] font-medium text-emerald-400">Risk: Low</span>
            </div>
            {advice.source && (
              <div className="text-[10px] font-medium text-slate-600 bg-slate-900/50 px-2 py-1 rounded">
                Source: {advice.source}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachPanel;
