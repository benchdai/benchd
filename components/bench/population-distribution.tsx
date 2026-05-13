"use client";

import { systems } from "@/lib/data/systems";
import type { SystemScores } from "@/lib/types";

interface PopulationDistributionProps {
  currentScores: SystemScores;
  systemName: string;
}

function DimensionDots({
  label,
  currentValue,
  allValues,
}: {
  label: string;
  currentValue: number;
  allValues: number[];
}) {
  const sorted = [...allValues].sort((a, b) => a - b);
  const max = 100;

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground w-16 shrink-0 text-right font-medium">
        {label}
      </span>
      <div className="flex-1 h-6 relative">
        {/* Track */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-[2px] bg-border rounded-full" />
        </div>
        {/* Baseline marker */}
        <div
          className="absolute top-0 bottom-0 w-[1px] bg-muted-foreground/30"
          style={{ left: `${57.6}%` }}
        />
        {/* Other systems as dots */}
        {sorted.map((val, i) => (
          <div
            key={i}
            className={`absolute top-1/2 -translate-y-1/2 rounded-full ${
              val === currentValue
                ? "w-2.5 h-2.5 bg-amber z-10 ring-2 ring-amber/20"
                : "w-1.5 h-1.5 bg-muted-foreground/30"
            }`}
            style={{ left: `${(val / max) * 100}%` }}
          />
        ))}
      </div>
      <span className="text-[10px] font-mono tabular-nums text-amber w-10 text-right">
        {currentValue.toFixed(1)}
      </span>
    </div>
  );
}

export function PopulationDistribution({ currentScores, systemName }: PopulationDistributionProps) {
  // Get all scored systems' data
  const scoredSystems = systems.filter((s) => s.scores !== null);

  const allRecall = scoredSystems.map((s) => s.scores!.recallVerified);
  const allTemporal = scoredSystems.map((s) => s.scores!.temporalVerified);
  const allReasoning = scoredSystems.map((s) => s.scores!.reasoningVerified);
  const allOverall = scoredSystems.map((s) => s.scores!.overallVerified);

  return (
    <div className="mt-6 border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Where {systemName} sits in the field
        </h3>
        <span className="text-[9px] text-muted-foreground">
          vs {scoredSystems.length} scored systems
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground mb-4">
        Each dot is a system. Amber dot is this system. Vertical line = LLM Baseline (57.6%).
      </p>

      <div className="space-y-3">
        <DimensionDots label="Overall" currentValue={currentScores.overallVerified} allValues={allOverall} />
        <DimensionDots label="Recall" currentValue={currentScores.recallVerified} allValues={allRecall} />
        <DimensionDots label="Temporal" currentValue={currentScores.temporalVerified} allValues={allTemporal} />
        <DimensionDots label="Reasoning" currentValue={currentScores.reasoningVerified} allValues={allReasoning} />
      </div>
    </div>
  );
}
