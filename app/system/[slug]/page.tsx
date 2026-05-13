import { notFound } from "next/navigation";
import Link from "next/link";
import { getSystemBySlug, getRunsBySystemId, getFailuresBySystemSlug } from "@/lib/data/index";
import { ScoreCard } from "@/components/bench/score-pair";
import { TrustTierBadge } from "@/components/bench/trust-tier-badge";
import { BMICard } from "@/components/bench/bmi-card";
import { EfficiencyCards } from "@/components/bench/efficiency-cards";
import { PopulationDistribution } from "@/components/bench/population-distribution";
import { ComparedWith } from "@/components/bench/compared-with";
import { EmbedBadge } from "@/components/bench/embed-badge";
import { PerformanceChart } from "@/components/bench/performance-chart";
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
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
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

      {/* No scores: listed or truly unbenchmarked */}
      {system.scores === null ? (
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
          <p className="text-xs text-muted-foreground mb-4">
            Scores from 0&ndash;100. Higher is better. LLM Baseline (no memory system) scores 57.6%.{" "}
            <Link href="/methodology" className="text-amber underline underline-offset-2 hover:text-foreground transition-colors">
              How we calculate this &rarr;
            </Link>
          </p>

          {/* Score Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <ScoreCard
              label="Recall"
              sublabel="Can it find the right facts from past conversations?"
              verified={system.scores.recallVerified}
              nuance={system.scores.recallNuance}
            />
            <ScoreCard
              label="Temporal"
              sublabel="Does it understand when events happened and their order?"
              verified={system.scores.temporalVerified}
              nuance={system.scores.temporalNuance}
            />
            <ScoreCard
              label="Reasoning"
              sublabel="Can it synthesize information across multiple memories?"
              verified={system.scores.reasoningVerified}
              nuance={system.scores.reasoningNuance}
            />
            <ScoreCard
              label="Overall"
              sublabel="Weighted composite across all dimensions"
              verified={system.scores.overallVerified}
              nuance={system.scores.overallNuance}
            />
          </div>

          {/* Population Distribution */}
          <PopulationDistribution currentScores={system.scores} systemName={system.name} />

          {/* BMI Card */}
          <BMICard scores={system.scores} systemName={system.name} />

          {/* Efficiency Metrics */}
          <EfficiencyCards scores={system.scores} />

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
          {system.trustTier !== "unclaimed-self-reported" && (
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
