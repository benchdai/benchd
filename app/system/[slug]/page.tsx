import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemBySlug, getRunsBySystemId, getFailuresBySystemSlug } from "@/lib/data/index";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import { BMICard } from "@/components/bench/bmi-card";
import { EfficiencyCards } from "@/components/bench/efficiency-cards";
import { PopulationDistribution } from "@/components/bench/population-distribution";
import { ComparedWith } from "@/components/bench/compared-with";
import { EmbedBadge } from "@/components/bench/embed-badge";
import { PerformanceChart } from "@/components/bench/performance-chart";
import { ScoreMatrix } from "@/components/bench/score-matrix";
import { SystemTabs } from "./system-tabs";
import type { SystemType } from "@/lib/types";
import {
  Globe,
  GitFork,
  BookOpen,
  Calendar,
  Network,
  ExternalLink,
  CheckCircle2,
  Clock,
  MinusCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Track-to-benchmark mapping                                        */
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

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default async function SystemProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const system = getSystemBySlug(slug);

  if (!system) {
    notFound();
  }

  const runs = getRunsBySystemId(system.id);
  const failures = getFailuresBySystemSlug(slug);

  const lastTestedFormatted = new Date(system.lastTested).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  /* ---- Track logic ---- */
  const applicableBenchmarks: BenchmarkName[] =
    TRACK_BENCHMARKS[system.systemType] ?? [...ALL_BENCHMARKS];

  const otherBenchmarks = ALL_BENCHMARKS.filter(
    (b) => !applicableBenchmarks.includes(b)
  );

  const results = BENCHMARK_RESULTS[system.slug] ?? {};

  // Compute track index: average of applicable benchmark scores that have been run
  const applicableScores = applicableBenchmarks
    .map((b) => results[b])
    .filter((v): v is number => v !== null && v !== undefined);

  const trackIndex =
    applicableScores.length > 0
      ? Math.round(
          (applicableScores.reduce((a, b) => a + b, 0) / applicableScores.length) * 10
        ) / 10
      : null;

  const pendingCount = applicableBenchmarks.length - applicableScores.length;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* ============================================================ */}
      {/* SECTION 1: Header                                            */}
      {/* ============================================================ */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {system.name}
          </h1>
          <TrustTierBadge tier={system.trustTier} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="text-xs text-muted-foreground">{system.vendor}</span>

          {system.website && (
            <a
              href={system.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          )}
          {system.githubUrl && (
            <a
              href={system.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              <GitFork className="h-3.5 w-3.5" />
              GitHub
              {system.githubStars !== null && (
                <span className="font-mono text-[10px] tabular-nums">
                  ({(system.githubStars / 1000).toFixed(1)}k)
                </span>
              )}
            </a>
          )}
          {system.docsUrl && (
            <a
              href={system.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs hover:text-foreground transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Docs
            </a>
          )}

          <span className="inline-flex items-center gap-1 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Last tested {lastTestedFormatted}
          </span>
        </div>

        {system.mcpEndpoint && (
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Network className="h-3.5 w-3.5 text-amber" />
            <span>MCP Endpoint:</span>
            <code className="font-mono text-[11px] bg-secondary/50 border border-border rounded px-2 py-0.5">
              {system.mcpEndpoint}
            </code>
          </div>
        )}

        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {system.description}
        </p>
      </div>

      {/* No scores: listed or truly unbenchmarked */}
      {system.scores === null && Object.keys(results).length === 0 ? (
        <div className="border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm">
            This system is indexed but hasn&apos;t been benchmarked yet.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Want to help? Run the Bench&apos;d harness yourself{" "}
            <Link href="/docs" className="text-amber underline underline-offset-2 hover:text-foreground transition-colors">
              Get started &rarr;
            </Link>
          </p>
        </div>
      ) : (
        <>
          {/* Self-reported warning banner */}
          {system.trustTier === "unclaimed-self-reported" && (
            <div className="mb-6 border border-[#DC2626]/30 rounded-lg p-4 bg-[#DC2626]/5">
              <p className="text-sm text-[#DC2626] font-medium">
                These scores are self-reported by the vendor and have not been independently verified by Bench&apos;d.
              </p>
            </div>
          )}

          {/* Score context line */}
          <p className="text-xs text-muted-foreground mb-6">
            Scores from 0&ndash;100. Higher is better. LLM Baseline (no memory system) scores 57.6%.{" "}
            <Link href="/methodology" className="text-amber underline underline-offset-2 hover:text-foreground transition-colors">
              How we calculate this &rarr;
            </Link>
          </p>

          {/* ============================================================ */}
          {/* SECTION 2: Track badge + Track Index                         */}
          {/* ============================================================ */}
          <div className="border border-border rounded-xl p-6 mb-8 bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Track badge */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Track
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${trackColor(system.systemType)}`}
                >
                  {trackLabel(system.systemType)}
                </span>
              </div>

              {/* Track index hero number */}
              <div className="flex-1 flex flex-col items-center sm:items-end gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Track Index
                </span>
                {trackIndex !== null ? (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-5xl font-bold tabular-nums ${scoreColor(trackIndex)}`}>
                        {trackIndex.toFixed(1)}
                      </span>
                      <span className="text-lg text-muted-foreground font-medium">
                        /100
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Based on {applicableScores.length} benchmark{applicableScores.length !== 1 ? "s" : ""}.
                      {pendingCount > 0 && (
                        <span className="ml-1 text-amber-400">
                          {pendingCount} pending.
                        </span>
                      )}
                    </p>
                  </>
                ) : (
                  <span className="text-2xl text-muted-foreground font-medium">
                    No results yet
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 3: Benchmark Results Matrix                          */}
          {/* ============================================================ */}
          <div className="border border-border rounded-xl bg-card mb-8 overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Benchmark Results
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-6 py-3 font-medium">Benchmark</th>
                    <th className="text-right px-6 py-3 font-medium">Score</th>
                    <th className="text-center px-6 py-3 font-medium">Status</th>
                    <th className="text-right px-6 py-3 font-medium">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Applicable benchmarks */}
                  {applicableBenchmarks.map((benchmark) => {
                    const score = results[benchmark];
                    const hasScore = score !== null && score !== undefined;

                    return (
                      <tr
                        key={benchmark}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-6 py-3 font-medium text-foreground">
                          {benchmark}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {hasScore ? (
                            <span
                              className={`inline-flex items-center justify-end px-2 py-0.5 rounded font-mono text-sm font-semibold tabular-nums ${scoreColor(score)} ${scoreBg(score)}`}
                            >
                              {score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50 text-xs">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-center">
                          {hasScore ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-muted-foreground/50 text-xs">
                              <Clock className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-right">
                          {hasScore ? (
                            <Link
                              href={`/receipts/${system.slug}/${benchmark.toLowerCase().replace(/\s+/g, "-")}`}
                              className="inline-flex items-center gap-1 text-xs text-amber hover:text-foreground transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View
                            </Link>
                          ) : (
                            <span className="text-muted-foreground/30 text-xs">
                              --
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Separator + other benchmarks */}
                  {otherBenchmarks.length > 0 && (
                    <>
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 bg-secondary/20 border-y border-border"
                        >
                          Other Benchmarks
                        </td>
                      </tr>
                      {otherBenchmarks.map((benchmark) => (
                        <tr
                          key={benchmark}
                          className="border-b border-border/50"
                        >
                          <td className="px-6 py-3 text-muted-foreground/50">
                            {benchmark}
                          </td>
                          <td
                            colSpan={3}
                            className="px-6 py-3 text-right"
                          >
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/40">
                              <MinusCircle className="h-3 w-3" />
                              Not applicable — outside {trackLabel(system.systemType)} track
                            </span>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ============================================================ */}
          {/* SECTION 4: Existing cards, charts, comparisons               */}
          {/* ============================================================ */}

          {/* Population Distribution */}
          {system.scores && (
            <PopulationDistribution currentScores={system.scores} systemName={system.name} />
          )}

          {/* BMI Card */}
          {system.scores && (
            <BMICard scores={system.scores} systemName={system.name} />
          )}

          {/* Efficiency Metrics */}
          {system.scores && <EfficiencyCards scores={system.scores} />}

          {/* Per-Capability Score Matrix */}
          <ScoreMatrix systemSlug={system.slug} />

          {/* Tabs */}
          <div className="mt-8">
            <SystemTabs
              system={system}
              runs={runs}
              failures={failures}
            />
          </div>

          {/* Performance Over Time */}
          <div className="mt-6 border border-border rounded-xl p-5 bg-card">
            <PerformanceChart
              systems={[system.slug]}
              showBaseline
              height={200}
            />
          </div>

          {/* Compared With */}
          <ComparedWith currentSystem={system} />

          {/* Embed Badge */}
          {system.trustTier !== "unclaimed-self-reported" && system.scores && (
            <EmbedBadge
              systemName={system.name}
              slug={system.slug}
              bmi={system.scores.bmi ?? system.scores.overallVerified}
            />
          )}
        </>
      )}
    </div>
  );
}
