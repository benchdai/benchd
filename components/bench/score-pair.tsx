"use client";

import { cn } from "@/lib/utils";

interface ScorePairProps {
  label: string;
  verified: number;
  nuance: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScorePair({
  label,
  verified,
  nuance,
  size = "md",
  className,
}: ScorePairProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "text-muted-foreground font-medium uppercase tracking-wider",
          size === "lg" ? "text-xs mb-2" : size === "md" ? "text-[10px] mb-1" : "text-[9px] mb-0.5"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "font-mono font-bold text-amber tabular-nums",
          size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-lg"
        )}
      >
        {verified.toFixed(1)}
      </span>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span
          className={cn(
            "font-mono text-muted-foreground tabular-nums",
            size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs"
          )}
        >
          {nuance.toFixed(1)}
        </span>
        <span
          className={cn(
            "text-muted-foreground",
            size === "lg" ? "text-[10px]" : "text-[9px]"
          )}
        >
          nuance
        </span>
      </div>
    </div>
  );
}

interface ScoreCardProps {
  label: string;
  sublabel: string;
  verified: number;
  nuance: number;
  className?: string;
}

export function ScoreCard({
  label,
  sublabel,
  verified,
  nuance,
  className,
}: ScoreCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 flex flex-col",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {label}
        </span>
      </div>
      <span className="font-mono text-4xl font-bold text-amber tabular-nums">
        {verified.toFixed(1)}
      </span>
      <span className="text-[10px] text-muted-foreground mt-1">
        Verified (Deterministic)
      </span>
      <div className="mt-3 pt-3 border-t border-border">
        <span className="font-mono text-xl text-muted-foreground tabular-nums">
          {nuance.toFixed(1)}
        </span>
        <span className="text-[10px] text-muted-foreground ml-2">
          Nuance (LLM Judge)
        </span>
      </div>
      <span className="text-[9px] text-muted-foreground mt-2">{sublabel}</span>
    </div>
  );
}
