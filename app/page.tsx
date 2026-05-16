"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { systems, runs } from "@/lib/data/index";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import { SourceBadge } from "@/components/bench/source-badge";
import { Sparkline } from "@/components/bench/sparkline";
import { ArrowRight, Info, ShieldCheck, Check, Minus, Shield, FileSearch, Fingerprint, BookOpen, BarChart3 } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import { CategoryLeaders } from "@/components/bench/category-leaders";
import type { System } from "@/lib/types";

type QuickFilter = "all" | "open-source" | "managed" | "frameworks" | "self-reported" | "mcp-compatible";

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date("2026-05-09T12:00:00Z");
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1d ago";
  return `${diffDays}d ago`;
}

// Coverage matrix data — derived from runs
const BENCHMARKS = ["LongMemEval", "LoCoMo", "PersonaMem"] as const;

function buildCoverageMatrix() {
  const verifiedSystems = systems.filter(
    (s) => (s.trustTier === "vendor-verified" || s.trustTier === "community-verified") && s.scores !== null
  ).sort((a, b) => b.scores!.overallVerified - a.scores!.overallVerified);

  return verifiedSystems.slice(0, 8).map((sys) => {
    const systemRuns = runs.filter((r) => r.systemId === sys.id && r.status === "completed");
    const coverage = BENCHMARKS.map((bName) =>
      systemRuns.some((r) => r.benchmarkName === bName)
    );
    return { name: sys.name, slug: sys.slug, coverage };
  });
}

export default function HomePage() {
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");

  // Stats
  const totalSystems = systems.length;
  const benchdVerified = systems.filter(
    (s) => s.trustTier === "community-verified" || s.trustTier === "vendor-verified"
  ).length;
  const selfReported = systems.filter(
    (s) => s.trustTier === "unclaimed-self-reported"
  ).length;
  const listed = systems.filter((s) => s.trustTier === "listed").length;

  // Latest 3 runs for right rail
  const latestRuns = runs
    .filter((r) => r.status === "completed")
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 3);

  // Coverage matrix
  const coverageMatrix = buildCoverageMatrix();

  // All systems sorted: scored first (by score desc), then self-reported, then listed
  const indexSystems = useMemo(() => {
    let filtered = [...systems];

    if (quickFilter === "open-source") {
      filtered = filtered.filter((s) => s.sourceType === "oss");
    } else if (quickFilter === "managed") {
      filtered = filtered.filter(
        (s) => s.sourceType === "closed" || s.sourceType === "open-core" || s.sourceType === "source-available"
      );
    } else if (quickFilter === "frameworks") {
      filtered = filtered.filter((s) => s.sourceType === "framework");
    } else if (quickFilter === "self-reported") {
      filtered = filtered.filter((s) => s.trustTier === "unclaimed-self-reported");
    } else if (quickFilter === "mcp-compatible") {
      filtered = filtered.filter((s) => s.mcpCompatible);
    }

    // Sort: verified > self-reported > listed, then by score desc within each group
    filtered.sort((a, b) => {
      const tierOrder = (s: System) => {
        if (s.trustTier === "vendor-verified" || s.trustTier === "community-verified") return 0;
        if (s.trustTier === "unclaimed-self-reported") return 1;
        return 2;
      };
      const ta = tierOrder(a);
      const tb = tierOrder(b);
      if (ta !== tb) return ta - tb;
      if (a.scores && b.scores) return b.scores.overallVerified - a.scores.overallVerified;
      if (a.scores) return -1;
      if (b.scores) return 1;
      return a.name.localeCompare(b.name);
    });

    return filtered;
  }, [quickFilter]);

  // Assign ranks only to verified systems
  let rank = 0;
  const rankedSystems = indexSystems.map((s) => {
    const isVerified = s.trustTier === "vendor-verified" || s.trustTier === "community-verified";
    if (isVerified && s.scores) {
      rank++;
      return { ...s, rank };
    }
    return { ...s, rank: null as number | null };
  });

  // Group systems for section headers
  const verifiedRows = rankedSystems.filter(
    (s) => s.trustTier === "vendor-verified" || s.trustTier === "community-verified"
  );
  const selfReportedRows = rankedSystems.filter(
    (s) => s.trustTier === "unclaimed-self-reported"
  );
  const listedRows = rankedSystems.filter((s) => s.trustTier === "listed");

  const quickFilters: { key: QuickFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open-source", label: "Open Source" },
    { key: "managed", label: "Managed" },
    { key: "frameworks", label: "Frameworks" },
    { key: "self-reported", label: "Self-Reported" },
    { key: "mcp-compatible", label: "MCP-Compatible" },
  ];

  // Top run for hero card
  const topRun = latestRuns[0];
  // A sample failure for the preview
  const sampleFailure = {
    query: "What changed in March?",
    expected: "React migration",
    returned: "Old framework",
    result: "Stale memory failure",
  };

  return (
    <div>
      {/* Hero — split layout */}
      <div className="relative overflow-hidden border-b border-border">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber/[0.06] via-transparent to-amber/[0.03] dark:from-amber/[0.08] dark:via-amber/[0.02] dark:to-transparent" />
        <div className="absolute inset-0 hero-grid" />

        {/* Animated gradient orbs */}
        <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] rounded-full bg-amber/[0.08] dark:bg-amber/[0.12] blur-[100px] hero-orb-1 pointer-events-none" />
        <div className="absolute bottom-[-30%] right-[5%] w-[400px] h-[400px] rounded-full bg-amber/[0.05] dark:bg-amber/[0.08] blur-[80px] hero-orb-2 pointer-events-none" />

        {/* Accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber/50 to-transparent">
          <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-amber to-transparent animate-shimmer" />
        </div>

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* Left — headline */}
            <div>
              {/* Brand positioning pill */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="h-1 w-8 rounded-full bg-amber" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber border border-amber/30 rounded-full px-3 py-1 bg-amber/[0.06]">
                  Independent benchmark authority
                </span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.75rem] font-bold tracking-tight text-foreground leading-[1.08]">
                The scoreboard
                <br />
                for AI{" "}
                <span className="relative text-amber">
                  memory
                  <span className="absolute -inset-x-2 -inset-y-1 bg-amber/[0.08] dark:bg-amber/[0.12] rounded-lg blur-sm -z-10" />
                </span>.
              </h1>
              <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                Bench&apos;d runs memory systems through reproducible benchmark protocols &mdash; measuring recall, temporal correctness, failure traces, and how efficiently past experience improves future performance.
              </p>
              <p className="mt-2.5 text-xs text-muted-foreground/70">
                Every run is cryptographically signed and publicly verifiable.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors shadow-sm"
                >
                  View Leaderboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/methodology"
                  className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
                >
                  Read Methodology
                </Link>
              </div>
              {/* Trust pillars */}
              <div className="mt-9 flex flex-wrap items-center gap-5">
                {[
                  { icon: Shield, label: "Independent" },
                  { icon: Fingerprint, label: "Reproducible" },
                  { icon: ShieldCheck, label: "Verifiable" },
                  { icon: BookOpen, label: "Open" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-amber/70" />
                    <span className="text-xs text-muted-foreground font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Live Run card + mini panels */}
            <div className="space-y-3">
              {/* Live Run card */}
              {topRun && (
                <Link href={`/receipt/${topRun.id}`} className="block">
                  <div className="border border-amber/20 rounded-xl bg-card p-5 card-md hover:border-amber/40 transition-colors relative overflow-hidden">
                    {/* Subtle amber left accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber via-amber/70 to-amber/40 rounded-l-xl" />
                    {/* Subtle amber glow */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber/[0.06] rounded-full blur-2xl pointer-events-none" />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Latest Verified Run
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-medium text-verified-green">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verified-green opacity-60" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-verified-green" />
                          </span>
                          VERIFIED
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
                        <div>
                          <span className="text-muted-foreground">Run ID</span>
                          <p className="font-mono text-foreground mt-0.5">{topRun.id}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">System</span>
                          <p className="font-semibold text-foreground mt-0.5">{topRun.systemName}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Benchmark</span>
                          <p className="text-foreground mt-0.5">{topRun.benchmarkName} v1.0</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Signed</span>
                          <p className="text-foreground mt-0.5">{formatRelativeDate(topRun.completedAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-end gap-6 pt-3 border-t border-border">
                        <div className="relative">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Verified Score</span>
                          <p className="text-4xl font-mono font-bold text-amber tabular-nums mt-0.5 relative">
                            {topRun.verifiedOverall.toFixed(1)}
                            <span className="text-sm font-normal text-muted-foreground ml-1">/100</span>
                            <span className="absolute -inset-2 bg-amber/[0.06] rounded-lg blur-md -z-10 hero-glow-pulse" />
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Judged Score</span>
                          <p className="text-xl font-mono font-semibold text-muted-foreground tabular-nums mt-0.5">
                            {topRun.nuanceOverall.toFixed(1)}
                            <span className="text-sm font-normal ml-1">/100</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Mini panels row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Failure Trace Preview */}
                <div className="border border-border rounded-xl bg-card p-4 card-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/40 rounded-l-xl" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Failure Trace Preview
                  </span>
                  <div className="mt-2 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Query</span>
                      <span className="text-foreground font-medium">{sampleFailure.query}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected</span>
                      <span className="text-foreground">{sampleFailure.expected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Returned</span>
                      <span className="text-foreground">{sampleFailure.returned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Result</span>
                      <span className="text-[#DC2626] font-medium text-[10px]">{sampleFailure.result}</span>
                    </div>
                  </div>
                  <Link href="/methodology#failures" className="flex items-center gap-1 mt-3 text-[10px] text-amber hover:text-amber/80">
                    View full traces <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* How We Score mini */}
                <div className="border border-border rounded-xl bg-card p-4 card-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/40 rounded-l-xl" />
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    How We Score
                  </span>
                  <div className="mt-2 space-y-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                        <span className="text-[11px] font-semibold text-foreground">Verified Score</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        Deterministic exact-match and retrieval quality. Pure math.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                        <span className="text-[11px] font-semibold text-foreground">Judged Score</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                        LLM-judged synthesis and open-ended recall.
                      </p>
                    </div>
                  </div>
                  <Link href="/methodology#two-score-model" className="flex items-center gap-1 mt-3 text-[10px] text-amber hover:text-amber/80">
                    Read scoring model <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* Category Leaders — who's winning in each category */}
      <div className="mt-6 mb-4">
        <CategoryLeaders />
      </div>

      {/* Stats Strip — compact sub-hero */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border border-border/60 rounded-lg overflow-hidden bg-card/80">
        <IndexCell value={totalSystems} label="Systems Indexed" icon="grid" />
        <IndexCell value={benchdVerified} label="Independently Scored" color="amber" icon="shield" />
        <IndexCell value={selfReported} label="Claims Flagged" color="red" icon="alert" />
        <IndexCell value={listed} label="Awaiting Adapters" icon="clock" />
        <IndexCell value="2h ago" label="Latest Receipt" className="hidden sm:flex" icon="check" />
      </div>

      {/* Main content: table + right rail */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 pb-10 mt-10">
        {/* Left: Benchmark Index */}
        <div>
          <div className="mb-5">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="h-4.5 w-4.5 text-amber" />
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Benchmark Index
              </h2>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Systems indexed across open-source projects, managed memory layers, and agent frameworks.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {quickFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setQuickFilter(f.key)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  quickFilter === f.key
                    ? "bg-amber/10 text-amber border border-amber/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="border border-border rounded-xl overflow-hidden bg-card card-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 w-10">
                      #
                    </th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5">
                      System
                    </th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden sm:table-cell">
                      Source
                    </th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden sm:table-cell">
                      Tier
                    </th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5">
                      Verified
                    </th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden md:table-cell">
                      Nuance
                    </th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden lg:table-cell">
                      Tested
                    </th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-3 py-2.5 hidden md:table-cell w-20">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* Verified section */}
                  {verifiedRows.length > 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-1.5 bg-amber/[0.03] border-b border-border">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-amber/70">
                          Bench&apos;d Verified
                        </span>
                      </td>
                    </tr>
                  )}
                  {verifiedRows.map((system, idx) => (
                    <SystemRow key={system.id} system={system} striped={idx % 2 === 1} />
                  ))}

                  {/* Self-reported section */}
                  {selfReportedRows.length > 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-1.5 bg-[#DC2626]/[0.03] border-b border-border border-t">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#DC2626]/70">
                          Self-Reported Claims
                        </span>
                      </td>
                    </tr>
                  )}
                  {selfReportedRows.map((system, idx) => (
                    <SystemRow key={system.id} system={system} striped={idx % 2 === 1} />
                  ))}

                  {/* Listed section */}
                  {listedRows.length > 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-1.5 bg-muted/20 border-b border-border border-t">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
                          Listed / Awaiting Run
                        </span>
                      </td>
                    </tr>
                  )}
                  {listedRows.map((system, idx) => (
                    <SystemRow key={system.id} system={system} striped={idx % 2 === 1} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 mt-3 text-xs text-muted-foreground hover:text-amber transition-colors"
          >
            Full leaderboard with detailed view
            <ArrowRight className="h-3 w-3" />
          </Link>

          {/* Coverage Matrix */}
          <div className="mt-6 border border-border rounded-xl p-4 bg-card card-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Benchmark Coverage
            </h3>
            <p className="text-[9px] text-muted-foreground mb-3">
              Official Bench&apos;d runs by benchmark. Listed and self-reported systems excluded.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[9px] font-medium uppercase tracking-wider text-muted-foreground pb-2 pr-4">
                      System
                    </th>
                    {BENCHMARKS.map((b) => (
                      <th key={b} className="text-center text-[9px] font-medium uppercase tracking-wider text-muted-foreground pb-2 px-3 whitespace-nowrap">
                        {b}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coverageMatrix.map((row) => (
                    <tr key={row.slug} className="border-b border-border/50 last:border-0">
                      <td className="py-1.5 pr-4">
                        <Link href={`/system/${row.slug}`} className="text-foreground hover:text-amber transition-colors font-medium">
                          {row.name}
                        </Link>
                      </td>
                      {row.coverage.map((has, i) => (
                        <td key={i} className="text-center py-1.5 px-3">
                          {has ? (
                            <Check className="inline h-3.5 w-3.5 text-amber" />
                          ) : (
                            <Minus className="inline h-3.5 w-3.5 text-muted-foreground/30" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div className="space-y-4">
          {/* Scoring Model */}
          <div className="border border-border rounded-xl p-4 bg-card card-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/30 rounded-l-xl" />
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Scoring Model
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-amber">Verified Score</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber/10 text-amber border border-amber/20">
                    deterministic
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Exact match, regex, ID retrieval. Pure math. Does not change.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground">Nuance Score</span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    LLM-judged
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Synthesis and open-ended recall. Contextual. May shift with judge updates.
                </p>
              </div>
            </div>
            <Link
              href="/methodology#two-score-model"
              className="inline-flex items-center gap-1 mt-3 text-[10px] text-amber hover:text-amber/80 transition-colors"
            >
              Read scoring model
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Latest Signed Receipts */}
          <div className="border border-border rounded-xl p-4 bg-card card-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/30 rounded-l-xl" />
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Latest Signed Receipts
            </h3>
            <div className="space-y-2.5">
              {latestRuns.map((run) => (
                <Link
                  key={run.id}
                  href={`/receipt/${run.id}`}
                  className="flex items-center justify-between text-xs group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ShieldCheck className="h-3 w-3 text-amber shrink-0" />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground group-hover:text-amber transition-colors block truncate">
                        {run.systemName}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {run.benchmarkName}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-mono font-semibold text-amber tabular-nums text-xs">
                      {run.verifiedOverall.toFixed(1)}
                    </span>
                    <span className="block text-[9px] text-muted-foreground">
                      {formatRelativeDate(run.completedAt)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 mt-3 text-[10px] text-muted-foreground hover:text-amber transition-colors"
            >
              View receipts
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Run Queue */}
          <div className="border border-border rounded-xl p-4 bg-card card-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/30 rounded-l-xl" />
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Run Queue
            </h3>
            <div className="space-y-1.5 text-xs">
              <div className="text-muted-foreground">
                <span className="font-mono tabular-nums text-foreground">{listed}</span> awaiting adapters
              </div>
              <div className="text-muted-foreground">
                <span className="font-mono tabular-nums text-foreground">4</span> missing wrappers
              </div>
              <div className="text-[#DC2626]">
                <span className="font-mono tabular-nums">{selfReported}</span> flagged claims
              </div>
            </div>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1 mt-3 text-[10px] text-muted-foreground hover:text-amber transition-colors"
            >
              View methodology
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Claim Profile */}
          <div className="border border-amber/30 rounded-xl p-4 bg-amber/5 card-sm">
            <h3 className="text-xs font-semibold text-foreground mb-1">
              Claim your system
            </h3>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Connect your official endpoint and verify your results against the public harness.
            </p>
            <Link
              href="/claim"
              className="inline-flex items-center gap-1 mt-2 text-[10px] text-amber hover:text-amber/80 transition-colors"
            >
              Claim profile
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Newsletter */}
          <NewsletterSignup variant="card" />
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="py-6 border-t border-border text-center">
        <p className="text-[10px] text-muted-foreground">
          All scores are independently run when marked Community-Verified,
          Vendor-Verified, or Partner-Audited. Listed and Self-Reported systems
          are clearly labeled.
        </p>
      </div>
      </div>
    </div>
  );
}

/* System row component */
function SystemRow({ system, striped }: { system: System & { rank: number | null }; striped?: boolean }) {
  const isListed = system.trustTier === "listed";
  const isSelfReported = system.trustTier === "unclaimed-self-reported";

  return (
    <tr
      className={`border-b border-border last:border-0 transition-colors ${
        isSelfReported
          ? "bg-[#DC2626]/[0.02] hover:bg-[#DC2626]/[0.05]"
          : isListed
          ? "opacity-45 hover:opacity-65"
          : striped
          ? "bg-muted/[0.25] hover:bg-muted/40"
          : "hover:bg-muted/20"
      }`}
    >
      <td className="px-3 py-2.5 font-mono text-xs tabular-nums text-muted-foreground">
        {system.rank != null ? system.rank : (
          <span className="text-muted-foreground/40">--</span>
        )}
      </td>
      <td className="px-3 py-2.5">
        <Link
          href={`/system/${system.slug}`}
          className="text-[13px] font-semibold text-foreground hover:text-amber transition-colors"
        >
          {system.name}
        </Link>
      </td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
          system.systemType === "conversational" ? "bg-amber/10 text-amber" :
          system.systemType === "knowledge-brain" ? "bg-blue-500/10 text-blue-500" :
          system.systemType === "agent-memory" ? "bg-purple-500/10 text-purple-500" :
          system.systemType === "graph" ? "bg-cyan-500/10 text-cyan-500" :
          system.systemType === "hybrid" ? "bg-emerald-500/10 text-emerald-500" :
          system.systemType === "baseline" ? "bg-stone-500/10 text-stone-500" :
          "bg-muted text-muted-foreground"
        }`}>
          {system.systemType === "conversational" ? "Conversational" :
           system.systemType === "knowledge-brain" ? "Knowledge Brain" :
           system.systemType === "agent-memory" ? "Agent Memory" :
           system.systemType === "graph" ? "Graph" :
           system.systemType === "hybrid" ? "Hybrid" :
           system.systemType === "baseline" ? "Baseline" :
           system.systemType}
        </span>
      </td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <SourceBadge source={system.sourceType} />
      </td>
      <td className="px-3 py-2.5 hidden sm:table-cell">
        <TrustTierBadge tier={system.trustTier} size="sm" />
      </td>
      <td className="px-3 py-2.5 text-right">
        {system.scores ? (
          <span className={`font-mono tabular-nums font-bold ${
            isSelfReported ? "text-[#DC2626]" : "text-amber"
          }`}>
            {system.scores.overallVerified.toFixed(1)}
            {isSelfReported && (
              <span className="relative group/tip ml-1 inline-block align-middle">
                <Info className="inline h-3 w-3 text-[#DC2626]/40" />
                <span className="absolute bottom-full right-0 mb-1 px-2 py-1 text-[10px] text-tooltip-fg bg-tooltip-bg rounded shadow-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                  Self-reported. Not independently run by Bench&apos;d.
                </span>
              </span>
            )}
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground/60 italic font-medium">
            Pending
          </span>
        )}
      </td>
      <td className="px-3 py-2.5 text-right hidden md:table-cell">
        {system.scores ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {system.scores.overallNuance.toFixed(1)}
          </span>
        ) : (
          <span className="text-muted-foreground/40 text-xs">--</span>
        )}
      </td>
      <td className="px-3 py-2.5 text-right hidden lg:table-cell">
        <span className={`text-[10px] ${
          isSelfReported ? "text-[#DC2626]/60 italic" : "text-muted-foreground"
        }`}>
          {isSelfReported ? "flagged" : formatRelativeDate(system.lastTested)}
        </span>
      </td>
      <td className="px-3 py-2.5 text-right hidden md:table-cell">
        {isSelfReported ? (
          <span className="text-[9px] text-[#DC2626]/50 italic">unverified</span>
        ) : system.sparklineData.length > 0 ? (
          <Sparkline data={system.sparklineData} width={64} height={20} />
        ) : (
          <span className="text-muted-foreground/40 text-xs">--</span>
        )}
      </td>
    </tr>
  );
}

function formatRelativeDateFromRow(dateStr: string): string {
  return formatRelativeDate(dateStr);
}

/* Index strip cell */
function IndexCell({
  value,
  label,
  color,
  className,
  icon,
}: {
  value: number | string;
  label: string;
  color?: "amber" | "red";
  className?: string;
  icon?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-2.5 px-2 border-r border-border/30 last:border-r-0 ${
        className ?? ""
      }`}
    >
      <span
        className={`text-xl font-mono font-bold tabular-nums leading-none tracking-tight ${
          color === "amber"
            ? "text-amber"
            : color === "red"
            ? "text-[#DC2626]"
            : "text-foreground"
        }`}
      >
        {value}
      </span>
      <span className="text-[8px] text-muted-foreground mt-1 text-center leading-tight font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
