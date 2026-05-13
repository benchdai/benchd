"use client";

import { Info } from "lucide-react";
import type { SystemScores } from "@/lib/types";

interface BMICardProps {
  scores: SystemScores;
  systemName: string;
}

export function BMICard({ scores, systemName }: BMICardProps) {
  const bmi = scores.bmi ?? scores.overallVerified;

  // Percentile approximation based on current 8-system field
  const allBMIs = [62.3, 62.1, 57.6, 38.2, 32.5, 28.4, 0, 0];
  const rank = allBMIs.filter((b) => b > bmi).length + 1;
  const percentile = Math.round(((allBMIs.length - rank) / allBMIs.length) * 100);

  return (
    <div className="rounded-xl border-2 border-amber/30 bg-gradient-to-br from-amber/[0.04] to-transparent p-5 relative overflow-hidden">
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber/[0.06] rounded-full blur-xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-amber">
              Bench&apos;d Memory Index
            </span>
          </div>
          <div className="relative group">
            <Info className="h-3.5 w-3.5 text-muted-foreground/40 cursor-help" />
            <div className="absolute bottom-full right-0 mb-1 px-3 py-2 text-[10px] text-tooltip-fg bg-tooltip-bg rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-[240px] leading-relaxed">
              The BMI combines accuracy (70%) and efficiency (30%) into a single
              production-weighted score. Formula is public and versioned.
            </div>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <span className="font-mono text-5xl font-bold text-amber tabular-nums">
            {bmi.toFixed(1)}
          </span>
          <div className="pb-1.5">
            <span className="text-sm text-muted-foreground font-mono">/ 100</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
          <span>
            #{rank} of {allBMIs.length} systems
          </span>
          <span>
            Top {100 - percentile}%
          </span>
        </div>

        {/* Mini breakdown */}
        <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-[10px]">
          <div>
            <span className="text-muted-foreground">Accuracy (70%)</span>
            <span className="font-mono font-semibold text-foreground ml-1">
              {scores.overallVerified.toFixed(1)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Efficiency (30%)</span>
            <span className="font-mono font-semibold text-foreground ml-1">
              {scores.tokensPerCorrect
                ? (100 - Math.min((scores.tokensPerCorrect ?? 0) / 100, 100)).toFixed(1)
                : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
