"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FailureRow } from "@/components/bench/failure-row";
import { Sparkline } from "@/components/bench/sparkline";
import type { System, Run, FailureTrace } from "@/lib/types";
import { Download, Filter } from "lucide-react";

interface SystemTabsProps {
  system: System;
  runs: Run[];
  failures: FailureTrace[];
}

export function SystemTabs({ system, runs, failures }: SystemTabsProps) {
  const [scoringFilter, setScoringFilter] = useState<string>("all");

  const filteredFailures =
    scoringFilter === "all"
      ? failures
      : failures.filter((f) => f.scoringMethod === scoringFilter);

  const completedRuns = runs
    .filter((r) => r.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

  return (
    <Tabs defaultValue="scores">
      <TabsList>
        <TabsTrigger value="scores">Scores</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="failures" className="gap-1.5">
          Failures (Gap Analysis)
          {failures.length > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 text-[10px] px-1.5 py-0 h-4 min-w-[1.25rem] justify-center"
            >
              {failures.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      {/* Scores Tab */}
      <TabsContent value="scores" className="mt-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Per-Benchmark Breakdown
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2">
                    Benchmark
                  </th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2 hidden sm:table-cell">
                    Harness
                  </th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2 hidden sm:table-cell">
                    Judge
                  </th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2">
                    Verified
                  </th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2">
                    Nuance
                  </th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2 hidden md:table-cell">
                    Completed
                  </th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2 hidden lg:table-cell">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedRuns.map((run) => (
                  <tr
                    key={run.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      {run.benchmarkName}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                      v{run.harnessVersion}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                      {run.judgeModel}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-bold text-amber tabular-nums">
                        {run.verifiedOverall.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm text-muted-foreground tabular-nums">
                        {run.nuanceOverall.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(run.completedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Link
                        href={`/receipt/${run.id}`}
                        className="text-xs text-amber hover:text-amber/80 transition-colors font-mono"
                      >
                        {run.merkleRoot.slice(0, 8)}...
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      {/* History Tab */}
      <TabsContent value="history" className="mt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Score Trend
          </h3>
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs text-muted-foreground">
                Overall Verified (30-run window)
              </span>
              <Sparkline
                data={system.sparklineData}
                width={240}
                height={48}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4 border-t border-border pt-4">
              Historical chart coming in v1.5 &mdash; full time-series with
              per-dimension breakdown, confidence intervals, and regression
              detection.
            </p>
          </div>
        </div>
      </TabsContent>

      {/* Failures Tab */}
      <TabsContent value="failures" className="mt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Gap Analysis
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
                <select
                  value={scoringFilter}
                  onChange={(e) => setScoringFilter(e.target.value)}
                  className="appearance-none bg-secondary/50 border border-border rounded-md text-xs text-foreground pl-7 pr-6 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber/50"
                >
                  <option value="all">All scoring methods</option>
                  <option value="exact">Exact match</option>
                  <option value="regex">Regex</option>
                  <option value="llm">LLM judge</option>
                </select>
              </div>
              <Button variant="outline" size="sm" className="text-xs h-7">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </div>

          {filteredFailures.length === 0 ? (
            <div className="border border-border rounded-lg p-12 text-center">
              <p className="text-muted-foreground text-sm">
                {failures.length === 0
                  ? "Perfect score on this subset. No failures to show."
                  : "No failures match the selected filter."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFailures.map((failure) => (
                <FailureRow
                  key={failure.id}
                  failure={failure}
                  systemSlug={system.slug}
                />
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      {/* Notes Tab */}
      <TabsContent value="notes" className="mt-6">
        <div className="border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm">
            No vendor notes yet.
          </p>
          {system.trustTier !== "vendor-verified" &&
            system.trustTier !== "partner-audited" && (
              <p className="text-xs text-muted-foreground mt-2">
                Vendor notes are available for claimed systems.{" "}
                <Link
                  href="/claim"
                  className="text-amber hover:text-amber/80 transition-colors"
                >
                  Claim this system
                </Link>{" "}
                to add official notes.
              </p>
            )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
