import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemBySlug, getRunsBySystemId, getFailuresBySystemSlug } from "@/lib/data/index";
import { ScoreCard } from "@/components/bench/score-pair";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import { SystemTabs } from "./system-tabs";
import {
  Globe,
  GitFork,
  BookOpen,
  Calendar,
  Network,
} from "lucide-react";

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            {system.name}
          </h1>
          <TrustTierBadge tier={system.trustTier} />
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="text-xs text-muted-foreground">{system.vendor}</span>

          {/* Vendor links */}
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

      {/* No runs / no scores empty state */}
      {runs.length === 0 || system.scores === null ? (
        <div className="border border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground text-sm">
            This system hasn&apos;t been benchmarked by Bench&apos;d yet.
          </p>
          {system.trustTier === "listed" && (
            <p className="text-muted-foreground text-xs mt-2">
              Listed systems are indexed but not yet scored. Check back soon.
            </p>
          )}
          {system.trustTier === "unclaimed-self-reported" && system.scores !== null && (
            <div className="mt-4 border border-[#DC2626]/30 rounded-lg p-4 bg-[#DC2626]/5 max-w-md mx-auto">
              <p className="text-xs text-[#DC2626]">
                This system has self-reported scores that have not been independently verified by Bench&apos;d.
              </p>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Score Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <ScoreCard
              label="Recall"
              sublabel="Fact retrieval accuracy"
              verified={system.scores.recallVerified}
              nuance={system.scores.recallNuance}
            />
            <ScoreCard
              label="Temporal"
              sublabel="Time-aware ordering"
              verified={system.scores.temporalVerified}
              nuance={system.scores.temporalNuance}
            />
            <ScoreCard
              label="Reasoning"
              sublabel="Multi-hop inference"
              verified={system.scores.reasoningVerified}
              nuance={system.scores.reasoningNuance}
            />
            <ScoreCard
              label="Overall"
              sublabel="Weighted composite"
              verified={system.scores.overallVerified}
              nuance={system.scores.overallNuance}
            />
          </div>

          {/* Tabs */}
          <SystemTabs
            system={system}
            runs={runs}
            failures={failures}
          />
        </>
      )}
    </div>
  );
}
