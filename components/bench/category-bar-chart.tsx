"use client";

import Link from "next/link";
import type { System, SystemType } from "@/lib/types";

const CATEGORY_COLORS: Record<string, string> = {
  all: "#D9982B",
  conversational: "#D9982B",
  "knowledge-brain": "#3B82F6",
  "agent-memory": "#8B5CF6",
  graph: "#06B6D4",
  hybrid: "#10B981",
  baseline: "#8F8F8F",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Systems",
  conversational: "Conversational Memory",
  "knowledge-brain": "Knowledge Brain",
  "agent-memory": "Agent Memory",
  graph: "Graph System",
  hybrid: "Hybrid",
  baseline: "Baseline",
};

interface CategoryBarChartProps {
  systems: System[];
  categoryTab: string;
}

export function CategoryBarChart({ systems, categoryTab }: CategoryBarChartProps) {
  // Get scored systems, sorted by overall score desc
  const scored = systems
    .filter((s) => s.scores !== null && s.trustTier !== "listed")
    .sort((a, b) => (b.scores?.overallVerified ?? 0) - (a.scores?.overallVerified ?? 0))
    .slice(0, 8);

  if (scored.length === 0) return null;

  const maxScore = 100;
  const barColor = CATEGORY_COLORS[categoryTab] || CATEGORY_COLORS.all;
  const baseline = 57.6;

  return (
    <div className="border border-border rounded-xl p-5 bg-card mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {categoryTab === "all" ? "Top Scored Systems" : `Top ${CATEGORY_LABELS[categoryTab] || categoryTab} Systems`}
        </h3>
        <span className="text-[9px] text-muted-foreground">
          LongMemEval · 0-100 · Baseline: 57.6%
        </span>
      </div>

      <div className="space-y-1.5">
        {scored.map((system) => {
          const score = system.scores?.overallVerified ?? 0;
          const isSelfReported = system.trustTier === "unclaimed-self-reported";
          const isBaseline = system.systemType === "baseline";
          const systemColor = isSelfReported
            ? "#DC2626"
            : isBaseline
            ? "#8F8F8F"
            : CATEGORY_COLORS[system.systemType] || barColor;

          return (
            <Link
              key={system.id}
              href={`/system/${system.slug}`}
              className="flex items-center gap-3 group"
            >
              {/* System name */}
              <span className="text-xs font-medium text-muted-foreground w-28 shrink-0 truncate text-right group-hover:text-foreground transition-colors">
                {system.name}
              </span>

              {/* Bar container */}
              <div className="flex-1 h-7 relative">
                {/* Background */}
                <div className="absolute inset-0 bg-secondary/50 rounded" />

                {/* Baseline reference line */}
                <div
                  className="absolute top-0 bottom-0 w-[1.5px] bg-muted-foreground/30 z-10"
                  style={{ left: `${baseline}%` }}
                />

                {/* Score bar */}
                <div
                  className="absolute top-0 bottom-0 rounded transition-all duration-300"
                  style={{
                    width: `${Math.max(score, 0.5)}%`,
                    backgroundColor: systemColor,
                    opacity: isSelfReported ? 0.4 : 0.7,
                  }}
                />

                {/* Category dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full z-10"
                  style={{
                    left: `${Math.max(score, 0.5)}%`,
                    marginLeft: "-3px",
                    backgroundColor: systemColor,
                  }}
                />
              </div>

              {/* Score */}
              <span
                className="font-mono text-xs font-bold tabular-nums w-12 text-right"
                style={{ color: score >= baseline ? systemColor : "#8F8F8F" }}
              >
                {score.toFixed(1)}
              </span>

              {/* Type badge */}
              {categoryTab === "all" && (
                <span
                  className="text-[8px] font-medium px-1.5 py-0.5 rounded-full w-16 text-center shrink-0"
                  style={{
                    backgroundColor: `${CATEGORY_COLORS[system.systemType] || barColor}15`,
                    color: CATEGORY_COLORS[system.systemType] || barColor,
                  }}
                >
                  {system.systemType === "conversational"
                    ? "Conv"
                    : system.systemType === "knowledge-brain"
                    ? "KB"
                    : system.systemType === "agent-memory"
                    ? "Agent"
                    : system.systemType === "graph"
                    ? "Graph"
                    : system.systemType === "hybrid"
                    ? "Hybrid"
                    : system.systemType === "baseline"
                    ? "Base"
                    : system.systemType}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-[1.5px] h-3 bg-muted-foreground/30" />
          <span className="text-[9px] text-muted-foreground">Baseline (57.6%)</span>
        </div>
        {categoryTab === "all" && (
          <div className="flex items-center gap-3">
            {Object.entries(CATEGORY_COLORS)
              .filter(([k]) => k !== "all" && k !== "baseline")
              .map(([key, color]) => (
                <div key={key} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-[8px] text-muted-foreground">
                    {key === "conversational"
                      ? "Conv"
                      : key === "knowledge-brain"
                      ? "KB"
                      : key === "agent-memory"
                      ? "Agent"
                      : key === "graph"
                      ? "Graph"
                      : "Hybrid"}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
