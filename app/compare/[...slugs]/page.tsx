import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemBySlug } from "@/lib/data/index";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import type { System, SystemType } from "@/lib/types";
import { Plus, ArrowLeft } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Track-to-benchmark mapping (duplicated from system profile)        */
/* ------------------------------------------------------------------ */

const ALL_BENCHMARKS = [
  "LongMemEval",
  "LoCoMo",
  "Reliability",
  "Truth Arbitration",
  "Memory Poisoning",
  "Budget Curves",
  "Knowledge Retrieval",
  "Knowledge Scale",
] as const;

type BenchmarkName = (typeof ALL_BENCHMARKS)[number];

const TRACK_BENCHMARKS: Record<string, BenchmarkName[]> = {
  conversational: ["LongMemEval", "LoCoMo", "Reliability", "Truth Arbitration", "Memory Poisoning", "Budget Curves"],
  baseline:       ["LongMemEval", "LoCoMo", "Reliability", "Truth Arbitration", "Memory Poisoning", "Budget Curves"],
  "knowledge-brain": ["Knowledge Retrieval", "Knowledge Scale", "Truth Arbitration", "Budget Curves", "Reliability"],
  graph:          ["Knowledge Retrieval", "Knowledge Scale", "Truth Arbitration", "Budget Curves", "Reliability"],
  "agent-memory": ["Knowledge Retrieval", "Truth Arbitration", "Memory Poisoning", "Budget Curves", "Reliability"],
  hybrid:         [...ALL_BENCHMARKS],
};

/* ------------------------------------------------------------------ */
/*  Hardcoded benchmark results from actual runs                      */
/* ------------------------------------------------------------------ */

const BENCHMARK_RESULTS: Record<string, Record<string, number | null>> = {
  "llamaindex-memory": { "LongMemEval": 59.0, "LoCoMo": 65.3, "Reliability": 56.0, "Truth Arbitration": 100.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 95.0 },
  "langchain-memory":  { "LongMemEval": 59.0, "LoCoMo": 51.9, "Reliability": 52.0, "Truth Arbitration": 80.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 95.0 },
  "llm-baseline":      { "LongMemEval": 57.6, "LoCoMo": 61.2, "Reliability": 52.0, "Truth Arbitration": 80.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 95.0, "Knowledge Scale": 100.0 },
  "autogpt-memory":    { "LongMemEval": 47.4, "Reliability": 44.0, "Truth Arbitration": 80.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 100.0 },
  "crewai-memory":     { "LongMemEval": 46.0, "Reliability": 52.0, "Truth Arbitration": 80.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 100.0 },
  "mem0-oss":          { "LongMemEval": 32.4, "LoCoMo": 0.0, "Reliability": 52.0, "Truth Arbitration": 40.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0, "Knowledge Retrieval": 100.0 },
  "gbrain":            { "Knowledge Retrieval": 100.0, "Knowledge Scale": 100.0, "Reliability": 4.0, "Truth Arbitration": 80.0, "Memory Poisoning": 0.0, "Budget Curves": 100.0 },
  "letta":             { "Knowledge Retrieval": 80.0, "Truth Arbitration": 80.0, "Memory Poisoning": 20.0, "Budget Curves": 0.0 },
  "graphiti":          { "LongMemEval": 0.0, "Truth Arbitration": 0.0, "Memory Poisoning": 0.0, "Budget Curves": 0.0, "Knowledge Retrieval": 0.0 },
  "langmem-benchd":    { "Reliability": 60.0 },
  "memoripy":          { "LongMemEval": 0.0, "Reliability": 0.0 },
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function trackLabel(t: SystemType): string {
  const labels: Record<SystemType, string> = {
    conversational: "Conversational Memory",
    baseline: "LLM Baseline",
    "knowledge-brain": "Knowledge Brain",
    graph: "Knowledge Graph",
    "agent-memory": "Agent Memory",
    hybrid: "Hybrid",
  };
  return labels[t] ?? t;
}

function trackColor(t: SystemType): string {
  const colors: Record<SystemType, string> = {
    conversational: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    baseline: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
    "knowledge-brain": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    graph: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    "agent-memory": "bg-amber-500/15 text-amber-400 border-amber-500/30",
    hybrid: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  };
  return colors[t] ?? "bg-zinc-500/15 text-zinc-400 border-zinc-500/30";
}

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 70) return "bg-emerald-500/10";
  if (score >= 40) return "bg-amber-500/10";
  return "bg-red-500/10";
}

function scoreCellClass(score: number | null | undefined): string {
  if (score === null || score === undefined) return "bg-zinc-500/5 text-zinc-500";
  if (score >= 70) return "bg-emerald-500/10 text-emerald-400";
  if (score >= 40) return "bg-amber-500/10 text-amber-400";
  return "bg-red-500/10 text-red-400";
}

function computeTrackIndex(systemSlug: string, systemType: SystemType): number | null {
  const applicableBenchmarks: BenchmarkName[] =
    TRACK_BENCHMARKS[systemType] ?? [...ALL_BENCHMARKS];
  const results = BENCHMARK_RESULTS[systemSlug] ?? {};
  const scores = applicableBenchmarks
    .map((b) => results[b])
    .filter((v): v is number => v !== null && v !== undefined);
  if (scores.length === 0) return null;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function ComparisonPage({
  params,
}: {
  params: Promise<{ slugs: string[] }>;
}) {
  const { slugs } = await params;

  if (!slugs || slugs.length < 2 || slugs.length > 3) {
    notFound();
  }

  const systems: System[] = [];
  for (const slug of slugs) {
    const system = getSystemBySlug(slug);
    if (!system) {
      notFound();
    }
    systems.push(system);
  }

  // Determine which benchmarks to show: union of all applicable benchmarks
  const allApplicable = new Set<BenchmarkName>();
  for (const sys of systems) {
    const track = TRACK_BENCHMARKS[sys.systemType] ?? [...ALL_BENCHMARKS];
    track.forEach((b) => allApplicable.add(b));
  }

  // Also include any benchmarks that have actual scores for these systems
  for (const sys of systems) {
    const results = BENCHMARK_RESULTS[sys.slug] ?? {};
    for (const key of Object.keys(results)) {
      if (ALL_BENCHMARKS.includes(key as BenchmarkName)) {
        allApplicable.add(key as BenchmarkName);
      }
    }
  }

  // Order benchmarks by the ALL_BENCHMARKS canonical order
  const benchmarksToShow = ALL_BENCHMARKS.filter((b) => allApplicable.has(b));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back link */}
      <Link
        href="/compare"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all comparisons
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-1 w-8 rounded-full bg-amber" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Head-to-Head
          </span>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground leading-tight">
          {systems.map((s) => s.name).join(" vs ")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Side-by-side comparison based on independent benchmark results.
        </p>
      </div>

      {/* Comparison table */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-5 py-3 min-w-[160px]">
                  Metric
                </th>
                {systems.map((sys) => (
                  <th
                    key={sys.slug}
                    className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-5 py-3 min-w-[140px]"
                  >
                    <Link
                      href={`/system/${sys.slug}`}
                      className="hover:text-amber transition-colors"
                    >
                      {sys.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* System Type row */}
              <tr className="border-b border-border/50">
                <td className="px-5 py-3 font-medium text-foreground">Type</td>
                {systems.map((sys) => (
                  <td key={sys.slug} className="px-5 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${trackColor(sys.systemType)}`}
                    >
                      {trackLabel(sys.systemType)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Trust Tier row */}
              <tr className="border-b border-border/50">
                <td className="px-5 py-3 font-medium text-foreground">Trust Tier</td>
                {systems.map((sys) => (
                  <td key={sys.slug} className="px-5 py-3 text-center">
                    <TrustTierBadge tier={sys.trustTier} />
                  </td>
                ))}
              </tr>

              {/* Track Index row */}
              <tr className="border-b border-border/50 bg-muted/20">
                <td className="px-5 py-3 font-semibold text-foreground">Track Index</td>
                {systems.map((sys) => {
                  const trackIndex = computeTrackIndex(sys.slug, sys.systemType);
                  const isWinner =
                    trackIndex !== null &&
                    systems.every((other) => {
                      if (other.slug === sys.slug) return true;
                      const otherIdx = computeTrackIndex(other.slug, other.systemType);
                      return otherIdx === null || trackIndex >= otherIdx;
                    });

                  return (
                    <td
                      key={sys.slug}
                      className={`px-5 py-3 text-center ${isWinner ? "ring-2 ring-amber/40 ring-inset rounded" : ""}`}
                    >
                      {trackIndex !== null ? (
                        <span className={`font-mono font-bold text-lg tabular-nums ${scoreColor(trackIndex)}`}>
                          {trackIndex.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Benchmark header */}
              <tr>
                <td
                  colSpan={systems.length + 1}
                  className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 bg-secondary/30 border-y border-border"
                >
                  Benchmark Scores
                </td>
              </tr>

              {/* Benchmark rows */}
              {benchmarksToShow.map((benchmark) => {
                // Determine winner for this row
                const scores = systems.map((sys) => {
                  const results = BENCHMARK_RESULTS[sys.slug] ?? {};
                  return results[benchmark] ?? null;
                });
                const validScores = scores.filter((s): s is number => s !== null);
                const maxScore = validScores.length > 0 ? Math.max(...validScores) : null;

                return (
                  <tr key={benchmark} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{benchmark}</td>
                    {systems.map((sys, i) => {
                      const applicableForTrack = TRACK_BENCHMARKS[sys.systemType] ?? [...ALL_BENCHMARKS];
                      const isApplicable = applicableForTrack.includes(benchmark);
                      const score = scores[i];
                      const isWinner = score !== null && maxScore !== null && score === maxScore && validScores.length > 1;

                      if (!isApplicable && score === null) {
                        return (
                          <td key={sys.slug} className="px-5 py-3 text-center">
                            <span className="text-[10px] text-muted-foreground/40 italic">
                              Not applicable
                            </span>
                          </td>
                        );
                      }

                      if (score === null || score === undefined) {
                        return (
                          <td key={sys.slug} className="px-5 py-3 text-center bg-zinc-500/5">
                            <span className="text-zinc-500 text-xs">Not tested</span>
                          </td>
                        );
                      }

                      return (
                        <td
                          key={sys.slug}
                          className={`px-5 py-3 text-center ${isWinner ? "ring-2 ring-amber/40 ring-inset rounded" : ""}`}
                        >
                          <span
                            className={`inline-flex items-center justify-center px-2 py-0.5 rounded font-mono text-sm font-semibold tabular-nums ${scoreCellClass(score)}`}
                          >
                            {score.toFixed(1)}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Color legend */}
        <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-500/30" />
            70+ (Strong)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-amber-500/30" />
            40-70 (Moderate)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500/30" />
            Below 40 (Weak)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-zinc-500/20" />
            Not tested
          </span>
        </div>
      </div>

      {/* Add system button */}
      {systems.length < 3 && (
        <div className="mt-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-amber/50 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add system to compare
          </Link>
        </div>
      )}

      {/* Links to individual profiles */}
      <div className="mt-8 flex flex-wrap gap-3">
        {systems.map((sys) => (
          <Link
            key={sys.slug}
            href={`/system/${sys.slug}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            View {sys.name} profile
          </Link>
        ))}
      </div>
    </div>
  );
}
