"use client";

import { Clock, Coins, Zap, Info } from "lucide-react";
import type { SystemScores } from "@/lib/types";

interface EfficiencyCardsProps {
  scores: SystemScores;
}

function formatLatency(ms: number): string {
  if (ms === 0) return "--";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatTokens(n: number): string {
  if (n === 0) return "--";
  if (n < 1000) return String(Math.round(n));
  return `${(n / 1000).toFixed(1)}k`;
}

function EfficiencyCard({
  icon: Icon,
  label,
  value,
  sublabel,
  quality,
  tooltip,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sublabel: string;
  quality: "good" | "mid" | "poor" | "none";
  tooltip: string;
}) {
  const qualityColors = {
    good: "text-verified-green",
    mid: "text-amber",
    poor: "text-[#DC2626]",
    none: "text-muted-foreground",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex flex-col relative group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        <div className="relative">
          <Info className="h-3 w-3 text-muted-foreground/40 cursor-help" />
          <div className="absolute bottom-full right-0 mb-1 px-2.5 py-1.5 text-[10px] text-tooltip-fg bg-tooltip-bg rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 max-w-[200px] leading-relaxed">
            {tooltip}
          </div>
        </div>
      </div>
      <span className={`font-mono text-2xl font-bold tabular-nums ${qualityColors[quality]}`}>
        {value}
      </span>
      <span className="text-[9px] text-muted-foreground mt-1">{sublabel}</span>
    </div>
  );
}

export function EfficiencyCards({ scores }: EfficiencyCardsProps) {
  const latency = scores.avgLatencyMs ?? 0;
  const tokensPerCorrect = scores.tokensPerCorrect ?? 0;
  const avgRecallTokens = scores.avgRecallTokens ?? 0;

  const latencyQuality = latency === 0 ? "none" : latency < 2000 ? "good" : latency < 5000 ? "mid" : "poor";
  const tokenQuality = tokensPerCorrect === 0 ? "none" : tokensPerCorrect < 100 ? "good" : tokensPerCorrect < 1000 ? "mid" : "poor";
  const recallTokenQuality = avgRecallTokens === 0 ? "none" : avgRecallTokens < 100 ? "good" : avgRecallTokens < 1000 ? "mid" : "poor";

  if (latency === 0 && tokensPerCorrect === 0 && avgRecallTokens === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-amber" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Efficiency Metrics
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <EfficiencyCard
          icon={Clock}
          label="Avg Latency"
          value={formatLatency(latency)}
          sublabel="Time per recall query"
          quality={latencyQuality}
          tooltip="Average time to retrieve memories and generate an answer. Lower is better."
        />
        <EfficiencyCard
          icon={Coins}
          label="Tokens / Correct"
          value={formatTokens(tokensPerCorrect)}
          sublabel="Token cost per correct answer"
          quality={tokenQuality}
          tooltip="Average tokens consumed per correctly answered question. Lower means more efficient."
        />
        <EfficiencyCard
          icon={Zap}
          label="Recall Tokens"
          value={formatTokens(avgRecallTokens)}
          sublabel="Avg tokens per retrieval"
          quality={recallTokenQuality}
          tooltip="Average tokens returned by the memory system per query. Lower means tighter retrieval."
        />
      </div>
    </div>
  );
}
