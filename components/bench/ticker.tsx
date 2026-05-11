"use client";

import Link from "next/link";
import { systems, runs } from "@/lib/data/index";

function formatScore(n: number) {
  return n.toFixed(1);
}

export function Ticker() {
  // Build ticker items from real data
  const latestRuns = runs
    .filter((r) => r.status === "completed")
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 8);

  const scoredCount = systems.filter(
    (s) =>
      s.scores !== null &&
      (s.trustTier === "vendor-verified" || s.trustTier === "community-verified")
  ).length;

  const totalCount = systems.length;

  const items: { label: string; href: string; highlight?: boolean }[] = [];

  for (const run of latestRuns) {
    items.push({
      label: `${run.systemName} ${formatScore(run.verifiedOverall)} on ${run.benchmarkName}`,
      href: `/receipt/${run.id}`,
      highlight: run.verifiedOverall >= 85,
    });
  }

  items.push({
    label: `${scoredCount} systems independently scored`,
    href: "/leaderboard",
  });

  items.push({
    label: `${totalCount} systems indexed`,
    href: "/leaderboard",
  });

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="flex animate-ticker">
        {doubled.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="flex items-center shrink-0 px-4 py-2 text-xs hover:bg-secondary/50 transition-colors group whitespace-nowrap"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber/60 mr-2 group-hover:bg-amber shrink-0" />
            <span className={`${item.highlight ? "text-foreground font-medium" : "text-muted-foreground"} group-hover:text-foreground transition-colors`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
