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
  allNames,
}: {
  label: string;
  currentValue: number;
  allValues: number[];
  allNames: string[];
}) {
  const sorted = allValues
    .map((v, i) => ({ value: v, name: allNames[i] }))
    .sort((a, b) => a.value - b.value);
  const max = 100;

  // Percentile calculation
  const belowCount = allValues.filter((v) => v < currentValue).length;
  const percentile = Math.round((belowCount / allValues.length) * 100);

  // Top system (rightmost dot)
  const topEntry = sorted[sorted.length - 1];

  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-muted-foreground w-16 shrink-0 text-right font-medium">
        {label}
      </span>
      <div className="flex-1 h-8 relative">
        {/* Track */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          <div className="w-full h-[2px] bg-border rounded-full" />
        </div>
        {/* Baseline marker - thicker and amber */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-amber/60 rounded-full"
          style={{ left: `${57.6}%` }}
        />
        {/* Baseline label */}
        <span
          className="absolute text-[7px] text-amber/70 font-medium whitespace-nowrap"
          style={{ left: `${57.6}%`, top: "-2px", transform: "translateX(-50%)" }}
        >
          No memory: 57.6%
        </span>
        {/* Other systems as dots (larger) */}
        {sorted.map((entry, i) => (
          <div
            key={i}
            className={`absolute top-1/2 -translate-y-1/2 rounded-full ${
              entry.value === currentValue
                ? "w-3.5 h-3.5 bg-amber z-10 ring-2 ring-amber/20"
                : "w-2 h-2 bg-muted-foreground/30"
            }`}
            style={{ left: `${(entry.value / max) * 100}%` }}
          />
        ))}
        {/* Top system label */}
        {topEntry && topEntry.value !== currentValue && (
          <span
            className="absolute text-[7px] text-muted-foreground/60 whitespace-nowrap"
            style={{
              left: `${(topEntry.value / max) * 100}%`,
              bottom: "-1px",
              transform: "translateX(-50%)",
            }}
          >
            {topEntry.name}
          </span>
        )}
      </div>
      <span className="text-[10px] font-mono tabular-nums text-amber w-10 text-right">
        {currentValue.toFixed(1)}
      </span>
      <span className="text-[9px] text-muted-foreground/70 w-20 text-right">
        {percentile}th percentile
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
  const allNames = scoredSystems.map((s) => s.name);

  return (
    <div className="mt-6 border border-border rounded-xl p-5 bg-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Relative Performance vs All Benchmarked Systems
        </h3>
        <span className="text-[9px] text-muted-foreground">
          vs {scoredSystems.length} scored systems
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground mb-4">
        Each dot is a system. Amber dot is {systemName}. Amber line = LLM Baseline (no memory).
      </p>

      <div className="space-y-3">
        <DimensionDots label="Overall" currentValue={currentScores.overallVerified} allValues={allOverall} allNames={allNames} />
        <DimensionDots label="Recall" currentValue={currentScores.recallVerified} allValues={allRecall} allNames={allNames} />
        <DimensionDots label="Temporal" currentValue={currentScores.temporalVerified} allValues={allTemporal} allNames={allNames} />
        <DimensionDots label="Reasoning" currentValue={currentScores.reasoningVerified} allValues={allReasoning} allNames={allNames} />
      </div>
    </div>
  );
}
