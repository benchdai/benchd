"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { systems } from "@/lib/data/index";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import { SourceBadge } from "@/components/bench/source-badge";
import { Sparkline } from "@/components/bench/sparkline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { System, TrustTier, SourceType } from "@/lib/types";
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  LayoutList,
  LayoutGrid,
  SlidersHorizontal,
  X,
  Plug,
  Star,
  AlertTriangle,
  ChevronRight,
  Info,
} from "lucide-react";

type SortField =
  | "rank"
  | "name"
  | "trustTier"
  | "overallVerified"
  | "overallNuance"
  | "lastTested"
  | "recallVerified"
  | "temporalVerified"
  | "reasoningVerified"
  | "reliabilityVerified"
  | "githubStars";

const RELIABILITY_SCORES: Record<string, number> = {
  "sys_llamaindex_memory": 56.0,
  "sys_langchain_memory": 52.0,
  "sys_autogpt_memory": 44.0,
  "sys_crewai_memory": 52.0,
  "sys_mem0_oss": 52.0,
  "sys_letta": 0.0,
  "sys_graphiti": 0.0,
  "sys_langmem_benchd": 48.0,
  "sys_gbrain": 4.0,
};

type SortDirection = "asc" | "desc";

type QuickFilter =
  | "all"
  | "open-source"
  | "managed"
  | "frameworks"
  | "self-reported"
  | "mcp-compatible";

const TRUST_TIER_ORDER: Record<TrustTier, number> = {
  "partner-audited": 5,
  "vendor-verified": 4,
  "community-verified": 3,
  "unclaimed-self-reported": 2,
  listed: 1,
};

function daysAgo(isoDate: string): number {
  const d = new Date(isoDate);
  const now = new Date("2026-05-09T12:00:00Z");
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatStars(n: number | null): string {
  if (n === null) return "--";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function getScoreDisplay(system: System) {
  if (system.scores === null) {
    return { hasScore: false as const, tier: system.trustTier };
  }
  return { hasScore: true as const, scores: system.scores, tier: system.trustTier };
}

function ScoreBar({ value, baseline = 57.6, isSelfReported = false }: { value: number; baseline?: number; isSelfReported?: boolean }) {
  const color = isSelfReported ? "bg-[#DC2626]/40" : value >= baseline ? "bg-amber/60" : "bg-muted-foreground/20";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`font-mono tabular-nums text-xs ${isSelfReported ? "text-[#DC2626]" : value >= baseline ? "text-amber" : "text-muted-foreground"}`}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}

export default function LeaderboardPage() {
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<QuickFilter>("all");
  const [showSelfReported, setShowSelfReported] = useState(false);
  const [mcpOnly, setMcpOnly] = useState(false);
  const [minOverall, setMinOverall] = useState(0);
  const [recencyDays, setRecencyDays] = useState(0);
  const [sortField, setSortField] = useState<SortField>("overallVerified");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredSystems = useMemo(() => {
    let result = systems.filter((s) => {
      // Quick filter
      if (quickFilter === "open-source") {
        if (s.sourceType !== "oss") return false;
      } else if (quickFilter === "managed") {
        if (s.sourceType === "oss" || s.sourceType === "research" || s.sourceType === "framework") return false;
      } else if (quickFilter === "frameworks") {
        if (s.sourceType !== "framework") return false;
      } else if (quickFilter === "self-reported") {
        if (s.trustTier !== "unclaimed-self-reported") return false;
      } else if (quickFilter === "mcp-compatible") {
        if (!s.mcpCompatible) return false;
      }

      // Self-reported visibility (when not using self-reported quick filter)
      if (quickFilter !== "self-reported" && quickFilter !== "all") {
        if (s.trustTier === "unclaimed-self-reported" && !showSelfReported) return false;
      }
      if (quickFilter === "all" && s.trustTier === "unclaimed-self-reported" && !showSelfReported) {
        return false;
      }

      // Search
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.vendor.toLowerCase().includes(q)
        )
          return false;
      }

      // MCP filter
      if (mcpOnly && !s.mcpCompatible) return false;

      // Min overall
      if (minOverall > 0 && (s.scores === null || s.scores.overallVerified < minOverall))
        return false;

      // Recency
      if (recencyDays > 0 && daysAgo(s.lastTested) > recencyDays) return false;

      return true;
    });

    // Sort - scored systems first, then listed/unscored
    result.sort((a, b) => {
      const aScored = a.scores !== null;
      const bScored = b.scores !== null;

      // Unscored systems always go to bottom
      if (aScored && !bScored) return -1;
      if (!aScored && bScored) return 1;

      if (!aScored && !bScored) {
        return a.name.localeCompare(b.name);
      }

      let cmp = 0;
      switch (sortField) {
        case "rank":
        case "overallVerified":
          cmp = a.scores!.overallVerified - b.scores!.overallVerified;
          break;
        case "overallNuance":
          cmp = a.scores!.overallNuance - b.scores!.overallNuance;
          break;
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "trustTier":
          cmp = TRUST_TIER_ORDER[a.trustTier] - TRUST_TIER_ORDER[b.trustTier];
          break;
        case "lastTested":
          cmp = new Date(a.lastTested).getTime() - new Date(b.lastTested).getTime();
          break;
        case "recallVerified":
          cmp = a.scores!.recallVerified - b.scores!.recallVerified;
          break;
        case "temporalVerified":
          cmp = a.scores!.temporalVerified - b.scores!.temporalVerified;
          break;
        case "reasoningVerified":
          cmp = a.scores!.reasoningVerified - b.scores!.reasoningVerified;
          break;
        case "reliabilityVerified":
          cmp = (RELIABILITY_SCORES[a.id] ?? -1) - (RELIABILITY_SCORES[b.id] ?? -1);
          break;
        case "githubStars":
          cmp = (a.githubStars ?? 0) - (b.githubStars ?? 0);
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });

    return result;
  }, [search, quickFilter, showSelfReported, mcpOnly, minOverall, recencyDays, sortField, sortDirection]);

  // Ranks are only for scored systems
  let rank = 0;
  const rankedSystems = filteredSystems.map((s) => {
    if (s.scores !== null && s.trustTier !== "unclaimed-self-reported") {
      rank++;
      return { ...s, rank };
    }
    return { ...s, rank: null as number | null };
  });

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "name" ? "asc" : "desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return <ChevronsUpDown className="inline h-3 w-3 ml-0.5 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="inline h-3 w-3 ml-0.5 text-amber" />
    ) : (
      <ChevronDown className="inline h-3 w-3 ml-0.5 text-amber" />
    );
  }

  const quickFilters: { key: QuickFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "open-source", label: "Open Source" },
    { key: "managed", label: "Managed" },
    { key: "frameworks", label: "Frameworks" },
    { key: "self-reported", label: "Self-Reported" },
    { key: "mcp-compatible", label: "MCP-Compatible" },
  ];

  const scoredCount = filteredSystems.filter((s) => s.scores !== null).length;
  const listedCount = filteredSystems.filter((s) => s.scores === null).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {systems.length} systems indexed &middot; {systems.filter((s) => s.scores !== null && s.trustTier !== "unclaimed-self-reported").length} independently scored
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Quick filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {quickFilters.map((f) => (
            <Button
              key={f.key}
              variant={quickFilter === f.key ? "secondary" : "ghost"}
              size="sm"
              onClick={() => {
                setQuickFilter(f.key);
                if (f.key === "self-reported") setShowSelfReported(true);
              }}
              className={
                quickFilter === f.key
                  ? "text-amber border-amber/30 bg-amber/10"
                  : "text-muted-foreground"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search systems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-sm"
            />
          </div>

          <Button
            variant={filtersOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="h-8"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
            Filters
          </Button>

          <div className="hidden md:flex items-center gap-0.5 ml-auto border border-border rounded-md p-0.5">
            <button
              onClick={() => setViewMode("compact")}
              className={`px-2 py-1 text-xs rounded ${
                viewMode === "compact"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutList className="h-3.5 w-3.5 inline mr-1" />
              Compact
            </button>
            <button
              onClick={() => setViewMode("detailed")}
              className={`px-2 py-1 text-xs rounded ${
                viewMode === "detailed"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 inline mr-1" />
              Detailed
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {filtersOpen && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Advanced Filters
              </span>
              <button onClick={() => setFiltersOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="flex items-start gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSelfReported}
                    onChange={() => setShowSelfReported(!showSelfReported)}
                    className="mt-0.5 rounded border-border accent-amber"
                  />
                  <span>
                    <span className="block font-medium text-foreground">Show Unclaimed Self-Reported</span>
                    <span className="block text-[10px] text-muted-foreground leading-tight mt-0.5">
                      Off by default &mdash; these scores are vendor-reported, not run by Bench&apos;d.
                    </span>
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mcpOnly}
                    onChange={() => setMcpOnly(!mcpOnly)}
                    className="rounded border-border accent-amber"
                  />
                  <span className="font-medium text-foreground">MCP-compatible only</span>
                </label>
              </div>
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Min Verified Overall
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={minOverall}
                    onChange={(e) => setMinOverall(Number(e.target.value))}
                    className="flex-1 accent-amber"
                  />
                  <span className="text-xs font-mono tabular-nums w-8 text-right text-amber">
                    {minOverall}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  Last Tested
                </label>
                <select
                  value={recencyDays}
                  onChange={(e) => setRecencyDays(Number(e.target.value))}
                  className="w-full h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs focus-visible:border-ring dark:bg-input/30"
                >
                  <option value={0}>Any time</option>
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                  <option value={90}>Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-3 text-[10px] text-muted-foreground">
          {scoredCount} scored &middot; {listedCount} listed &middot; {filteredSystems.length} total
        </div>

        {/* Empty state */}
        {rankedSystems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No systems match</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Try broadening your search or changing filters.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
              {/* Baseline legend */}
              <div className="mb-2 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3 w-3 shrink-0" />
                Scores out of 100. LLM Baseline (no memory system): 57.6%. Systems below baseline are highlighted.
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 sticky top-0 z-20">
                      <TH onClick={() => handleSort("rank")} sticky={viewMode === "detailed"} left="0" className="w-10">
                        #<SortIcon field="rank" />
                      </TH>
                      <TH onClick={() => handleSort("name")} sticky={viewMode === "detailed"} left="40px">
                        System<SortIcon field="name" />
                      </TH>
                      <TH sticky={viewMode === "detailed"} left="200px" className="w-24">
                        Source
                      </TH>
                      <TH onClick={() => handleSort("trustTier")} sticky={viewMode === "detailed"} left="296px" border>
                        Tier<SortIcon field="trustTier" />
                      </TH>

                      <TH onClick={() => handleSort("recallVerified")} align="left" title="Percentage of factual questions answered correctly from memory">
                        Recall<SortIcon field="recallVerified" />
                      </TH>
                      <TH onClick={() => handleSort("temporalVerified")} align="left" title="Accuracy on time-ordering and date-based questions">
                        Temporal<SortIcon field="temporalVerified" />
                      </TH>
                      <TH onClick={() => handleSort("reasoningVerified")} align="left" title="Multi-hop inference and synthesis accuracy">
                        Reasoning<SortIcon field="reasoningVerified" />
                      </TH>
                      <TH onClick={() => handleSort("reliabilityVerified")} align="left" title="Adversarial trap resistance: hallucination, stale memory, entity confusion, deletion">
                        Reliability<SortIcon field="reliabilityVerified" />
                      </TH>

                      <TH onClick={() => handleSort("overallVerified")} align="right" title="Weighted composite across all dimensions">
                        Overall<SortIcon field="overallVerified" />
                      </TH>

                      {viewMode === "detailed" && (
                        <>
                          <TH onClick={() => handleSort("overallNuance")} align="right" title="LLM-judged scoring for open-ended questions">
                            Nuance<SortIcon field="overallNuance" />
                          </TH>
                          <TH align="center" className="w-10">MCP</TH>
                          <TH className="w-20">Adapter</TH>
                        </>
                      )}

                      <TH onClick={() => handleSort("lastTested")}>
                        Tested<SortIcon field="lastTested" />
                      </TH>
                      <TH className="w-20">Trend</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let selfReportedDividerShown = false;
                      let listedDividerShown = false;
                      const rows: React.ReactNode[] = [];

                      rankedSystems.forEach((system) => {
                        const info = getScoreDisplay(system);
                        const isListed = system.trustTier === "listed";
                        const isSelfReported = system.trustTier === "unclaimed-self-reported";
                        const rowMuted = isListed;

                        // Section divider: self-reported
                        if (isSelfReported && !selfReportedDividerShown) {
                          selfReportedDividerShown = true;
                          rows.push(
                            <tr key="__divider-self-reported" className="border-b border-amber/30">
                              <td colSpan={100} className="px-3 py-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-px bg-amber/30" />
                                  <span className="text-[9px] font-semibold uppercase tracking-widest text-amber/70">Self-Reported Claims</span>
                                  <div className="flex-1 h-px bg-amber/30" />
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        // Section divider: listed / awaiting adapter
                        if (isListed && !listedDividerShown) {
                          listedDividerShown = true;
                          rows.push(
                            <tr key="__divider-listed" className="border-b border-border">
                              <td colSpan={100} className="px-3 py-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-px bg-muted-foreground/20" />
                                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">Awaiting Adapter</span>
                                  <div className="flex-1 h-px bg-muted-foreground/20" />
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        const belowBaseline = info.hasScore && info.scores.overallVerified < 57.6 && info.scores.overallVerified > 0;

                        rows.push(
                          <tr
                            key={system.id}
                            className={`border-b border-border transition-colors group ${
                              isSelfReported
                                ? "bg-[#DC2626]/[0.03] hover:bg-[#DC2626]/[0.06]"
                                : rowMuted
                                ? "opacity-60 hover:opacity-80"
                                : "hover:bg-muted/30"
                            }`}
                          >
                            {/* Rank */}
                            <TD sticky={viewMode === "detailed"} left="0" className={rowMuted ? "opacity-60" : ""}>
                              <span className="font-mono tabular-nums text-muted-foreground text-xs">
                                {system.rank ?? "--"}
                              </span>
                            </TD>

                            {/* System */}
                            <TD sticky={viewMode === "detailed"} left="40px">
                              <Link
                                href={`/system/${system.slug}`}
                                className="font-medium text-foreground hover:text-amber transition-colors"
                              >
                                {system.name}
                              </Link>
                              <span className="block text-[10px] text-muted-foreground leading-tight">
                                {system.vendor}
                              </span>
                            </TD>

                            {/* Source */}
                            <TD sticky={viewMode === "detailed"} left="200px">
                              <SourceBadge source={system.sourceType} />
                            </TD>

                            {/* Trust Tier */}
                            <TD sticky={viewMode === "detailed"} left="296px" border>
                              <TrustTierBadge tier={system.trustTier} size="sm" />
                            </TD>

                            {/* Recall */}
                            <TD>
                              {info.hasScore ? (
                                <ScoreBar value={info.scores.recallVerified} isSelfReported={isSelfReported} />
                              ) : (
                                <span className="text-muted-foreground text-xs">--</span>
                              )}
                            </TD>

                            {/* Temporal */}
                            <TD>
                              {info.hasScore ? (
                                <ScoreBar value={info.scores.temporalVerified} isSelfReported={isSelfReported} />
                              ) : (
                                <span className="text-muted-foreground text-xs">--</span>
                              )}
                            </TD>

                            {/* Reasoning */}
                            <TD>
                              {info.hasScore ? (
                                <ScoreBar value={info.scores.reasoningVerified} isSelfReported={isSelfReported} />
                              ) : (
                                <span className="text-muted-foreground text-xs">--</span>
                              )}
                            </TD>

                            {/* Reliability */}
                            <TD>
                              {system.id in RELIABILITY_SCORES ? (
                                <ScoreBar value={RELIABILITY_SCORES[system.id]} isSelfReported={isSelfReported} />
                              ) : (
                                <span className="text-muted-foreground text-xs">--</span>
                              )}
                            </TD>

                            {/* Overall (Verified) */}
                            <TD align="right">
                              {info.hasScore ? (
                                <span className={`font-mono tabular-nums text-base font-semibold ${
                                  isSelfReported ? "text-[#DC2626]" : "text-amber"
                                }`}>
                                  {info.scores.overallVerified.toFixed(1)}
                                  {belowBaseline && (
                                    <ChevronDown className="inline h-3 w-3 ml-0.5 text-muted-foreground/60" />
                                  )}
                                  {isSelfReported && (
                                    <span className="relative group/tip ml-1 inline-block">
                                      <Info className="inline h-3 w-3 text-[#DC2626]/60" />
                                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-[10px] text-tooltip-fg bg-tooltip-bg rounded shadow-lg whitespace-nowrap opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none z-50">
                                        Self-reported, not verified by Bench&apos;d
                                      </span>
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="text-[10px] text-muted-foreground italic">Listed</span>
                              )}
                            </TD>

                            {/* Detailed: Nuance + MCP + Adapter */}
                            {viewMode === "detailed" && (
                              <>
                                <TD align="right">
                                  {info.hasScore ? (
                                    <span className="font-mono tabular-nums text-muted-foreground text-xs">
                                      {info.scores.overallNuance.toFixed(1)}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">--</span>
                                  )}
                                </TD>
                                <TD align="center">
                                  {system.mcpCompatible ? (
                                    <Plug className="inline h-3.5 w-3.5 text-emerald-400" />
                                  ) : (
                                    <span className="text-muted-foreground text-xs">--</span>
                                  )}
                                </TD>
                                <TD>
                                  <span className={`text-[10px] ${
                                    system.adapterStatus === "native"
                                      ? "text-emerald-400"
                                      : system.adapterStatus === "community"
                                      ? "text-sky-400"
                                      : "text-muted-foreground"
                                  }`}>
                                    {system.adapterStatus === "native"
                                      ? "Native"
                                      : system.adapterStatus === "community"
                                      ? "Community"
                                      : "None"}
                                  </span>
                                </TD>
                              </>
                            )}

                            {/* Last Tested */}
                            <TD>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatDate(system.lastTested)}
                              </span>
                            </TD>

                            {/* Sparkline */}
                            <TD>
                              {system.sparklineData.length > 0 ? (
                                <Sparkline
                                  data={system.sparklineData}
                                  strokeColor={isSelfReported ? "#DC2626" : "#FFB800"}
                                />
                              ) : (
                                <span className="text-muted-foreground text-xs">--</span>
                              )}
                            </TD>
                          </tr>
                        );
                      });

                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE CARD LAYOUT */}
            <div className="md:hidden space-y-2">
              {rankedSystems.map((system) => {
                const info = getScoreDisplay(system);
                const isSelfReported = system.trustTier === "unclaimed-self-reported";
                const isListed = system.trustTier === "listed";

                return (
                  <Link
                    key={system.id}
                    href={`/system/${system.slug}`}
                    className={`block rounded-lg border p-3 transition-colors ${
                      isSelfReported
                        ? "border-[#DC2626]/30 bg-[#DC2626]/5 hover:bg-[#DC2626]/10"
                        : isListed
                        ? "border-border bg-card/50 opacity-70 hover:opacity-90"
                        : "border-border bg-card hover:border-amber/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <TrustTierBadge tier={system.trustTier} size="sm" />
                          <SourceBadge source={system.sourceType} />
                        </div>
                        <h3 className="font-medium text-sm text-foreground truncate">
                          {system.name}
                        </h3>
                        <p className="text-[10px] text-muted-foreground">{system.vendor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {info.hasScore ? (
                          <>
                            <div className={`text-xl font-mono tabular-nums font-bold ${
                              isSelfReported ? "text-[#DC2626]" : "text-amber"
                            }`}>
                              {info.scores.overallVerified.toFixed(1)}
                            </div>
                            <div className="text-xs font-mono tabular-nums text-muted-foreground">
                              {info.scores.overallNuance.toFixed(1)}
                            </div>
                            <div className="text-[9px] text-muted-foreground mt-0.5">
                              {isSelfReported ? "self-reported" : "verified"}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-muted-foreground italic mt-1">
                            Listed
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{formatDate(system.lastTested)}</span>
                      <span className="flex items-center gap-0.5 text-amber font-medium">
                        Details <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Reusable table header cell
function TH({
  children,
  onClick,
  sticky,
  left,
  border,
  align,
  className,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  sticky?: boolean;
  left?: string;
  border?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
  title?: string;
}) {
  return (
    <th
      onClick={onClick}
      title={title}
      className={`h-9 px-3 text-[10px] font-medium uppercase tracking-wider whitespace-nowrap select-none ${
        onClick ? "cursor-pointer hover:text-foreground" : ""
      } ${align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"} ${
        sticky ? `sticky z-30 bg-muted/95 backdrop-blur-sm` : ""
      } ${border ? "border-r border-border" : ""} ${className ?? ""}`}
      style={sticky && left ? { left } : undefined}
    >
      {children}
    </th>
  );
}

// Reusable table data cell
function TD({
  children,
  sticky,
  left,
  border,
  align,
  className,
}: {
  children: React.ReactNode;
  sticky?: boolean;
  left?: string;
  border?: boolean;
  align?: "left" | "right" | "center";
  className?: string;
}) {
  return (
    <td
      className={`px-3 py-2 ${
        align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"
      } ${
        sticky ? "sticky z-10 bg-card group-hover:bg-muted/30" : ""
      } ${border ? "border-r border-border" : ""} ${className ?? ""}`}
      style={sticky && left ? { left } : undefined}
    >
      {children}
    </td>
  );
}
