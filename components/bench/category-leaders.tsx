"use client";

import Link from "next/link";
import { ArrowRight, Brain, BookOpen, Bot, Network, Layers, TrendingUp, TrendingDown } from "lucide-react";
import { systems } from "@/lib/data/systems";
import type { SystemType } from "@/lib/types";

interface CategoryConfig {
  type: SystemType;
  label: string;
  icon: typeof Brain;
  color: string;
  bgColor: string;
  leaderboardTab: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    type: "conversational",
    label: "Top Conversational",
    icon: Brain,
    color: "text-amber",
    bgColor: "bg-amber/[0.04] border-amber/20",
    leaderboardTab: "conversational",
  },
  {
    type: "knowledge-brain",
    label: "Top Knowledge Brain",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/[0.04] border-blue-500/20",
    leaderboardTab: "knowledge-brain",
  },
  {
    type: "agent-memory",
    label: "Top Agent Memory",
    icon: Bot,
    color: "text-purple-500",
    bgColor: "bg-purple-500/[0.04] border-purple-500/20",
    leaderboardTab: "agent-memory",
  },
];

const BASELINE_SCORE = 57.6;

function getTopSystems(type: SystemType, limit: number = 3) {
  // Include baseline in conversational
  const eligible = systems.filter((s) => {
    if (s.scores === null) return false;
    if (s.trustTier === "unclaimed-self-reported") return false;
    if (type === "conversational") {
      return s.systemType === "conversational" || s.systemType === "baseline";
    }
    return s.systemType === type;
  });

  return eligible
    .sort((a, b) => (b.scores?.overallVerified ?? 0) - (a.scores?.overallVerified ?? 0))
    .slice(0, limit);
}

export function CategoryLeaders() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const top = getTopSystems(cat.type);

        if (top.length === 0) return null;

        return (
          <div
            key={cat.type}
            className={`border rounded-xl p-4 ${cat.bgColor}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${cat.color}`} />
                <h3 className="text-xs font-semibold text-foreground">
                  {cat.label}
                </h3>
              </div>
              <Link
                href={`/leaderboard`}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
              >
                View more <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {top.map((system, idx) => {
                const score = system.scores?.overallVerified ?? 0;
                const aboveBaseline = score >= BASELINE_SCORE;

                return (
                  <Link
                    key={system.id}
                    href={`/system/${system.slug}`}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[10px] font-mono w-4 ${
                        idx === 0 ? cat.color : "text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-xs font-medium text-foreground group-hover:text-amber transition-colors truncate">
                        {system.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`font-mono text-xs font-bold tabular-nums ${
                        idx === 0 ? cat.color : "text-muted-foreground"
                      }`}>
                        {score.toFixed(1)}%
                      </span>
                      {aboveBaseline ? (
                        <TrendingUp className="h-3 w-3 text-verified-green" />
                      ) : score > 0 ? (
                        <TrendingDown className="h-3 w-3 text-[#DC2626]/60" />
                      ) : null}
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Baseline reference */}
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground">Baseline (no memory)</span>
              <span className="text-[9px] font-mono text-muted-foreground tabular-nums">57.6%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
