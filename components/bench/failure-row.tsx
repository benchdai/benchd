"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/bench/code-block";
import type { FailureTrace } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FailureRowProps {
  failure: FailureTrace;
  systemSlug: string;
}

export function FailureRow({ failure, systemSlug }: FailureRowProps) {
  const [expanded, setExpanded] = useState(false);

  const methodBadgeColor = {
    exact: "border-amber/30 text-amber bg-amber/10",
    regex: "border-[#3B82F6]/30 text-[#3B82F6] bg-[#3B82F6]/10",
    llm: "border-[#7C3AED]/30 text-[#7C3AED] bg-[#7C3AED]/10",
  };

  const permalink = `/system/${systemSlug}/failure/${failure.traceId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(
      `${typeof window !== "undefined" ? window.location.origin : ""}${permalink}`
    );
    toast.success("Permalink copied to clipboard");
  };

  const ingestText = failure.ingestHistory
    .map((turn) => `${turn.role}: ${turn.content}`)
    .join("\n");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors",
          expanded && "bg-secondary/30"
        )}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className="font-mono text-xs text-muted-foreground w-8 shrink-0">
          {failure.questionNumber}
        </span>
        <span className="text-sm text-foreground flex-1 truncate">
          {failure.questionSummary}
        </span>
        <Badge
          variant="outline"
          className={cn("text-[10px] shrink-0", methodBadgeColor[failure.scoringMethod])}
        >
          {failure.scoringMethod}
        </Badge>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0">
          {failure.traceId.slice(0, 8)}
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 bg-secondary/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Ingest History (Conversation Turns)
              </h4>
              <CodeBlock
                code={ingestText}
                maxHeight="200px"
                title={`${failure.ingestHistory.length} total turns`}
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 text-xs text-muted-foreground"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Show full in new tab
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Recall Query
                </h4>
                <p className="text-sm bg-card border border-border rounded px-3 py-2 font-mono">
                  {failure.query}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  System Response
                </h4>
                <p className="text-sm bg-card border border-border rounded px-3 py-2">
                  {failure.response}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Expected Answer
                </h4>
                <p className="text-sm bg-card border border-amber/20 rounded px-3 py-2 text-amber">
                  {failure.expectedAnswer}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Scoring Method
                  </span>
                  <p className="text-sm font-mono">{failure.scoringMethod}</p>
                </div>
                {failure.scoringMethod === "llm" && failure.judgeReasoning && (
                  <div className="flex-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Judge Reasoning
                    </span>
                    <p className="text-sm text-muted-foreground italic">
                      {failure.judgeReasoning}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs text-muted-foreground font-mono">
              Permalink to this failure:{" "}
              <span className="text-foreground">{permalink}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
