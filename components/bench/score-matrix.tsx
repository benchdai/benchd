"use client";

import timeSeriesData from "@/lib/data/time_series.json";

interface TimeSeriesRun {
  system: string;
  benchmark: string;
  run_id: string;
  date: string;
  overall: number;
  dimensions: Record<string, number>;
  total_questions: number;
  correct: number;
  status: string;
}

const DIMENSION_LABELS: Record<string, string> = {
  recall: "Recall",
  temporal: "Temporal",
  reasoning: "Reasoning",
  hallucination: "Hallucination",
  stale_memory: "Stale Memory",
  entity_confusion: "Entity Confusion",
  deletion: "Deletion",
};

function cellColor(value: number | null): string {
  if (value === null) return "text-muted-foreground";
  if (value === 0) return "text-muted-foreground/50";
  if (value >= 70) return "text-emerald-500";
  if (value >= 40) return "text-amber-500";
  return "text-red-500";
}

export function ScoreMatrix({ systemSlug }: { systemSlug: string }) {
  const runs = (timeSeriesData as unknown as TimeSeriesRun[]).filter(
    (r) => r.system === systemSlug && r.status === "completed"
  );

  if (runs.length === 0) return null;

  // Deduplicate: keep the latest run per benchmark
  const latestByBenchmark = new Map<string, TimeSeriesRun>();
  for (const run of runs) {
    const existing = latestByBenchmark.get(run.benchmark);
    if (!existing || run.date > existing.date) {
      latestByBenchmark.set(run.benchmark, run);
    }
  }

  const benchmarks = Array.from(latestByBenchmark.keys()).sort();
  const benchmarkRuns = benchmarks.map((b) => latestByBenchmark.get(b)!);

  // Collect all dimensions that appear in any run
  const allDimensions = new Set<string>();
  for (const run of benchmarkRuns) {
    if (run.dimensions) {
      Object.keys(run.dimensions).forEach((d) => allDimensions.add(d));
    }
  }

  // Order dimensions: known ones first, then any extras
  const knownOrder = Object.keys(DIMENSION_LABELS);
  const sortedDimensions = [
    ...knownOrder.filter((d) => allDimensions.has(d)),
    ...Array.from(allDimensions).filter((d) => !knownOrder.includes(d)).sort(),
  ];

  // Add "Overall" as the last row
  const rowKeys = [...sortedDimensions, "__overall__"];

  const hasDimensionData = sortedDimensions.length > 0;
  if (!hasDimensionData) return null;

  function getValue(run: TimeSeriesRun, dimKey: string): number | null {
    if (dimKey === "__overall__") {
      return run.overall ?? null;
    }
    if (run.dimensions && dimKey in run.dimensions) {
      return run.dimensions[dimKey];
    }
    return null;
  }

  function formatValue(value: number | null): string {
    if (value === null) return "--";
    return value.toFixed(1);
  }

  function rowLabel(key: string): string {
    if (key === "__overall__") return "Overall";
    return DIMENSION_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
  }

  return (
    <div className="mt-8 mb-8 border border-border rounded-xl p-5 bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Per-Capability Score Matrix
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground py-2 pr-6 min-w-[140px]">
                Dimension
              </th>
              {benchmarks.map((b) => (
                <th
                  key={b}
                  className="text-right text-xs font-medium text-muted-foreground py-2 px-3 min-w-[100px]"
                >
                  {b}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((dimKey, i) => {
              const isOverall = dimKey === "__overall__";
              return (
                <tr
                  key={dimKey}
                  className={
                    isOverall
                      ? "border-t border-border font-semibold"
                      : i % 2 === 0
                      ? "bg-secondary/20"
                      : ""
                  }
                >
                  <td className="py-1.5 pr-6 text-xs text-foreground">
                    {rowLabel(dimKey)}
                  </td>
                  {benchmarkRuns.map((run) => {
                    const val = getValue(run, dimKey);
                    return (
                      <td
                        key={run.benchmark}
                        className={`py-1.5 px-3 text-right font-mono text-xs tabular-nums ${cellColor(val)}`}
                      >
                        {formatValue(val)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
