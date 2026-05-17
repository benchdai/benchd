"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import type { SubDimension, ScoreStatus, InterpretationLabel, PurposeAlignment } from "@/lib/scoring-schema";

// ─────────────────────────────────────────────────────────
// Color + label helpers
// ─────────────────────────────────────────────────────────

function interpretationColor(label: InterpretationLabel): string {
  switch (label) {
    case "excellent": return "text-verified-green";
    case "strong": return "text-amber";
    case "average": return "text-foreground";
    case "weak": return "text-[#DC2626]";
    case "capability_limited": return "text-muted-foreground";
    case "not_applicable": return "text-muted-foreground/50";
  }
}

function interpretationBadge(label: InterpretationLabel): string {
  switch (label) {
    case "excellent": return "bg-verified-green/10 text-verified-green border-verified-green/20";
    case "strong": return "bg-amber/10 text-amber border-amber/20";
    case "average": return "bg-secondary text-foreground border-border";
    case "weak": return "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20";
    case "capability_limited": return "bg-muted text-muted-foreground border-border";
    case "not_applicable": return "bg-muted/50 text-muted-foreground/50 border-border/50";
  }
}

function statusLabel(status: ScoreStatus): string {
  switch (status) {
    case "measured": return "Measured";
    case "not_claimed": return "Not claimed";
    case "not_applicable": return "N/A";
    case "not_supported": return "Not supported";
    case "pending": return "Pending";
    case "adapter_missing": return "Adapter needed";
    case "isolation_failed": return "Isolation failed";
    case "runtime_failed": return "Runtime error";
  }
}

function statusColor(status: ScoreStatus): string {
  if (status === "measured") return "text-verified-green";
  if (status === "not_supported" || status === "not_claimed") return "text-muted-foreground";
  if (status === "pending" || status === "adapter_missing") return "text-amber";
  return "text-[#DC2626]";
}

function alignmentLabel(a: PurposeAlignment): string {
  switch (a) {
    case "core": return "Core metric";
    case "adjacent": return "Related metric";
    case "orthogonal": return "Informational";
    case "not_applicable": return "N/A for this track";
  }
}

function barColor(value: number, status: ScoreStatus): string {
  if (status !== "measured") return "bg-muted-foreground/15";
  if (value >= 70) return "bg-verified-green/60";
  if (value >= 40) return "bg-amber/60";
  return "bg-[#DC2626]/40";
}

// ─────────────────────────────────────────────────────────
// Scorecard component
// ─────────────────────────────────────────────────────────

interface ScorecardProps {
  metricLabel: string;
  rawValue: number | null;
  interpretationLabel: InterpretationLabel;
  interpretationSummary: string;
  purposeAlignment: PurposeAlignment;
  trackMean: number | null;
  subDimensions: SubDimension[];
  methodologyUrl: string;
  status: ScoreStatus;
}

export function Scorecard({
  metricLabel,
  rawValue,
  interpretationLabel: interpLabel,
  interpretationSummary,
  purposeAlignment,
  trackMean,
  subDimensions,
  methodologyUrl,
  status,
}: ScorecardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden ${
      purposeAlignment === "orthogonal" ? "border-border/50 opacity-70" : "border-border"
    }`}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-foreground">{metricLabel}</span>
          <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full border ${interpretationBadge(interpLabel)}`}>
            {interpLabel === "capability_limited" ? "Capability-limited" : interpLabel}
          </span>
          {purposeAlignment === "orthogonal" && (
            <span className="text-[8px] text-muted-foreground/60 italic">informational</span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {rawValue !== null ? (
            <span className={`font-mono text-lg font-bold tabular-nums ${interpretationColor(interpLabel)}`}>
              {rawValue.toFixed(1)}%
            </span>
          ) : (
            <span className={`text-xs ${statusColor(status)}`}>{statusLabel(status)}</span>
          )}

          {/* Track average context */}
          {trackMean !== null && rawValue !== null && (
            <span className="text-[9px] text-muted-foreground hidden sm:inline">
              avg {trackMean.toFixed(0)}%
            </span>
          )}

          {/* Info + expand */}
          <Link
            href={methodologyUrl}
            onClick={(e) => e.stopPropagation()}
            className="text-muted-foreground/40 hover:text-amber transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
          </Link>

          {subDimensions.length > 0 && (
            expanded
              ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-border/50">
          {/* Interpretation summary */}
          <p className="text-[10px] text-muted-foreground mt-2 mb-3 leading-relaxed">
            {interpretationSummary}
          </p>

          {/* Sub-dimensions */}
          {subDimensions.length > 0 && (
            <div className="space-y-2">
              {subDimensions.map((dim) => (
                <div key={dim.id} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-36 shrink-0 truncate">
                    {dim.label}
                  </span>

                  {dim.status === "measured" && dim.rawValue !== null ? (
                    <>
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor(dim.rawValue, dim.status)}`}
                          style={{ width: `${dim.rawValue}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono tabular-nums w-8 text-right text-foreground">
                        {dim.rawValue}%
                      </span>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center gap-1.5">
                      <span className={`text-[9px] ${statusColor(dim.status)}`}>
                        {statusLabel(dim.status)}
                      </span>
                      {dim.explanation && (
                        <span className="text-[9px] text-muted-foreground/60 italic">
                          — {dim.explanation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Methodology link */}
          <Link
            href={methodologyUrl}
            className="inline-flex items-center gap-1 mt-3 text-[9px] text-amber hover:text-amber/80 transition-colors"
          >
            Read methodology <ExternalLink className="h-2.5 w-2.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
