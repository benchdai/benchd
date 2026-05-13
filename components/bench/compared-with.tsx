import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { systems } from "@/lib/data/systems";
import type { System } from "@/lib/types";

interface ComparedWithProps {
  currentSystem: System;
}

export function ComparedWith({ currentSystem }: ComparedWithProps) {
  // Find the most comparable systems: same source type first, then closest score
  const scored = systems.filter(
    (s) => s.scores !== null && s.id !== currentSystem.id && s.trustTier !== "unclaimed-self-reported"
  );

  if (scored.length === 0) return null;

  const currentScore = currentSystem.scores?.overallVerified ?? 0;

  // Sort by score proximity
  const ranked = scored
    .map((s) => ({
      ...s,
      scoreDiff: Math.abs((s.scores?.overallVerified ?? 0) - currentScore),
    }))
    .sort((a, b) => a.scoreDiff - b.scoreDiff)
    .slice(0, 3);

  return (
    <div className="mt-6 border border-border rounded-xl p-5 bg-card">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Most often compared with
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ranked.map((sys) => (
          <Link
            key={sys.id}
            href={`/system/${sys.slug}`}
            className="border border-border rounded-lg p-3 hover:border-amber/30 transition-colors group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-foreground group-hover:text-amber transition-colors truncate">
                {sys.name}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-amber transition-colors shrink-0" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-amber tabular-nums">
                {sys.scores?.overallVerified.toFixed(1)}
              </span>
              <span className="text-[9px] text-muted-foreground">overall</span>
            </div>
            <div className="flex gap-3 mt-1 text-[9px] text-muted-foreground">
              <span>R: {sys.scores?.recallVerified.toFixed(0)}</span>
              <span>T: {sys.scores?.temporalVerified.toFixed(0)}</span>
              <span>Rs: {sys.scores?.reasoningVerified.toFixed(0)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
