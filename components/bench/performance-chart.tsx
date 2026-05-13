"use client";

import { useMemo } from "react";
import timeSeries from "@/lib/data/time_series.json";

interface TimeSeriesEntry {
  system: string;
  benchmark: string;
  date: string;
  overall: number;
  status: string;
}

interface PerformanceChartProps {
  /** Show only these systems. If null, shows top 5 by latest score. */
  systems?: string[];
  /** Filter to specific benchmark. If null, shows LongMemEval. */
  benchmark?: string;
  /** Chart height in pixels */
  height?: number;
  /** Show the baseline reference line */
  showBaseline?: boolean;
  /** Compact mode for homepage */
  compact?: boolean;
}

const SYSTEM_COLORS: Record<string, string> = {
  "llamaindex-memory": "#D9982B",
  "langchain-memory": "#3B82F6",
  "llm-baseline": "#8F8F8F",
  "autogpt-memory": "#10B981",
  "crewai-memory": "#8B5CF6",
  "mem0-local": "#EF4444",
  "letta": "#F59E0B",
  "graphiti": "#06B6D4",
  "cognee": "#EC4899",
};

function getColor(system: string): string {
  return SYSTEM_COLORS[system] || "#8F8F8F";
}

function getDisplayName(system: string): string {
  const names: Record<string, string> = {
    "llamaindex-memory": "LlamaIndex",
    "langchain-memory": "LangChain",
    "llm-baseline": "LLM Baseline",
    "autogpt-memory": "AutoGPT",
    "crewai-memory": "CrewAI",
    "mem0-local": "Mem0 OSS",
    "letta": "Letta",
    "graphiti": "Graphiti",
    "cognee": "Cognee",
  };
  return names[system] || system;
}

export function PerformanceChart({
  systems,
  benchmark = "LongMemEval",
  height = 200,
  showBaseline = true,
  compact = false,
}: PerformanceChartProps) {
  const data = useMemo(() => {
    const entries = (timeSeries as TimeSeriesEntry[])
      .filter((e) => e.benchmark === benchmark && e.status === "completed" && e.overall > 0);

    // Get unique systems, use latest best score per system
    const systemBest: Record<string, { score: number; entries: TimeSeriesEntry[] }> = {};
    for (const e of entries) {
      if (!systemBest[e.system]) {
        systemBest[e.system] = { score: 0, entries: [] };
      }
      systemBest[e.system].entries.push(e);
      if (e.overall > systemBest[e.system].score) {
        systemBest[e.system].score = e.overall;
      }
    }

    // Filter to requested systems or top 5
    let targetSystems = systems;
    if (!targetSystems) {
      targetSystems = Object.entries(systemBest)
        .sort((a, b) => b[1].score - a[1].score)
        .slice(0, 5)
        .map(([name]) => name);
    }

    // Get unique dates
    const allDates = [...new Set(entries.map((e) => e.date))].sort();

    return { systemBest, targetSystems, allDates };
  }, [systems, benchmark]);

  const { systemBest, targetSystems, allDates } = data;

  if (allDates.length === 0 || targetSystems.length === 0) {
    return null;
  }

  // SVG dimensions
  const padding = { top: 20, right: 16, bottom: 24, left: 36 };
  const width = 600;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Scales
  const maxScore = 100;
  const xScale = (dateIdx: number) => padding.left + (dateIdx / Math.max(allDates.length - 1, 1)) * chartWidth;
  const yScale = (score: number) => padding.top + chartHeight - (score / maxScore) * chartHeight;

  // Build paths for each system
  const paths = targetSystems.map((system) => {
    const entries = (systemBest[system]?.entries || [])
      .sort((a, b) => a.date.localeCompare(b.date));

    if (entries.length === 0) return null;

    const points = entries.map((e) => {
      const dateIdx = allDates.indexOf(e.date);
      return { x: xScale(dateIdx), y: yScale(e.overall), score: e.overall, date: e.date };
    });

    // Keep only the best score up to each date (monotonic best)
    let best = 0;
    const bestPoints = points.map((p) => {
      best = Math.max(best, p.score);
      return { ...p, y: yScale(best), score: best };
    });

    const d = bestPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

    return { system, d, points: bestPoints, color: getColor(system) };
  }).filter(Boolean) as { system: string; d: string; points: { x: number; y: number; score: number; date: string }[]; color: string }[];

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Performance Over Time — {benchmark}
          </h3>
          <span className="text-[9px] text-muted-foreground">
            {allDates[0]} to {allDates[allDates.length - 1]}
          </span>
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((val) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={yScale(val)}
              x2={width - padding.right}
              y2={yScale(val)}
              stroke="currentColor"
              strokeOpacity={0.06}
              strokeDasharray={val === 0 ? "none" : "2,4"}
            />
            <text
              x={padding.left - 4}
              y={yScale(val) + 3}
              textAnchor="end"
              className="fill-muted-foreground"
              fontSize={9}
              fontFamily="monospace"
            >
              {val}
            </text>
          </g>
        ))}

        {/* Baseline */}
        {showBaseline && (
          <g>
            <line
              x1={padding.left}
              y1={yScale(57.6)}
              x2={width - padding.right}
              y2={yScale(57.6)}
              stroke="#8F8F8F"
              strokeWidth={1}
              strokeDasharray="4,3"
              strokeOpacity={0.5}
            />
            <text
              x={width - padding.right + 2}
              y={yScale(57.6) + 3}
              className="fill-muted-foreground"
              fontSize={8}
            >
              baseline
            </text>
          </g>
        )}

        {/* Lines */}
        {paths.map(({ system, d, color }) => (
          <path
            key={system}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Dots at latest point */}
        {paths.map(({ system, points, color }) => {
          const last = points[points.length - 1];
          return (
            <g key={`dot-${system}`}>
              <circle
                cx={last.x}
                cy={last.y}
                r={3.5}
                fill={color}
                stroke="var(--color-card)"
                strokeWidth={2}
              />
            </g>
          );
        })}

        {/* Date labels */}
        {allDates.length <= 5
          ? allDates.map((date, i) => (
              <text
                key={date}
                x={xScale(i)}
                y={height - 4}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={8}
                fontFamily="monospace"
              >
                {date.slice(5)}
              </text>
            ))
          : [allDates[0], allDates[allDates.length - 1]].map((date, i) => (
              <text
                key={date}
                x={xScale(i === 0 ? 0 : allDates.length - 1)}
                y={height - 4}
                textAnchor={i === 0 ? "start" : "end"}
                className="fill-muted-foreground"
                fontSize={8}
                fontFamily="monospace"
              >
                {date.slice(5)}
              </text>
            ))}
      </svg>

      {/* Legend */}
      <div className={`flex flex-wrap gap-x-4 gap-y-1 ${compact ? "mt-2" : "mt-3"}`}>
        {paths.map(({ system, color, points }) => (
          <div key={system} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-muted-foreground">
              {getDisplayName(system)}
            </span>
            <span className="text-[10px] font-mono font-semibold tabular-nums" style={{ color }}>
              {points[points.length - 1].score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
