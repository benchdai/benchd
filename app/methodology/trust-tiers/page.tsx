import Link from "next/link";
import { ArrowLeft, ShieldCheck, Shield, ShieldAlert, ShieldQuestion } from "lucide-react";

export const metadata = {
  title: "Trust Tiers — Bench'd",
  description:
    "How Bench'd assigns trust levels to benchmark results. From community-verified to Bench'd-certified.",
};

interface TierDef {
  name: string;
  slug: string;
  icon: typeof ShieldCheck;
  color: string;
  badgeColor: string;
  description: string;
  requirements: string[];
  what_it_means: string;
}

const TIERS: TierDef[] = [
  {
    name: "Bench'd Certified",
    slug: "benchd-certified",
    icon: ShieldCheck,
    color: "text-green-500",
    badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    description:
      "Highest trust level. Benchmark was run by the Bench'd team using official infrastructure, with full isolation verification and cryptographic signing.",
    requirements: [
      "Run executed by Bench'd team or authorized partner",
      "Full isolation canary passed (no data contamination between runs)",
      "Signed with Bench'd official keypair",
      "Complete manifest with all traces published",
      "Adapter reviewed and approved by Bench'd team",
    ],
    what_it_means:
      "You can treat this score as ground truth. The run environment was controlled, the scoring was deterministic, and the receipt is cryptographically verifiable.",
  },
  {
    name: "Vendor Verified",
    slug: "vendor-verified",
    icon: Shield,
    color: "text-blue-500",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description:
      "Benchmark was run by the system vendor using the official harness, with a signed manifest submitted for verification.",
    requirements: [
      "Run executed using official benchd-harness package from PyPI",
      "Manifest signed with vendor's own keypair",
      "Signature verified by Bench'd",
      "Adapter code submitted for review (may be proprietary)",
      "At least one benchmark completed with full traces",
    ],
    what_it_means:
      "The vendor used our tools and protocol, but controlled the environment. Results are likely accurate but could theoretically be cherry-picked or run on optimized configurations.",
  },
  {
    name: "Community Verified",
    slug: "community-verified",
    icon: ShieldAlert,
    color: "text-amber-500",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description:
      "Benchmark was run by a community member using the official harness. Results are real but the environment was not controlled by Bench'd.",
    requirements: [
      "Run executed using official benchd-harness package",
      "Manifest signed (any keypair)",
      "At least one benchmark completed",
      "Adapter passes basic validation (benchd adapter validate)",
    ],
    what_it_means:
      "These are real benchmark results from a real adapter, but the runner's environment and configuration were not audited. Good for initial ranking; may need re-verification for leaderboard claims.",
  },
  {
    name: "Listed",
    slug: "listed",
    icon: ShieldQuestion,
    color: "text-zinc-400",
    badgeColor: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    description:
      "System is cataloged but has not been benchmarked yet. May have an adapter in development.",
    requirements: [
      "System identified as an AI memory system",
      "Basic metadata collected (name, website, category, track)",
    ],
    what_it_means:
      "No benchmark data available. The system appears on the site for discovery purposes only. Scores will show as 'pending' or 'adapter_missing'.",
  },
];

export default function TrustTiersPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Back nav */}
      <Link
        href="/methodology"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Methodology
      </Link>

      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber mb-2 block">
          Trust Model v1.0
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Trust Tiers
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          Not all benchmark results carry the same weight. Bench'd assigns a trust
          tier to every score based on who ran the benchmark, how it was verified,
          and whether the environment was controlled.
        </p>
      </div>

      {/* Tier cards */}
      <div className="space-y-8 max-w-3xl">
        {TIERS.map((tier) => {
          const Icon = tier.icon;
          return (
            <section
              key={tier.slug}
              className="border border-border/40 rounded-xl p-6 bg-card/50"
            >
              <div className="flex items-start gap-4 mb-4">
                <Icon className={`w-6 h-6 mt-0.5 ${tier.color}`} />
                <div>
                  <h2 className="text-xl font-bold text-foreground">{tier.name}</h2>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${tier.badgeColor}`}
                  >
                    {tier.slug}
                  </span>
                </div>
              </div>

              <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
                {tier.description}
              </p>

              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {tier.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-muted-foreground mt-0.5">-</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-muted/20 rounded-lg p-3 border border-border/20">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  What it means for consumers
                </h3>
                <p className="text-sm text-foreground/80">{tier.what_it_means}</p>
              </div>
            </section>
          );
        })}

        {/* Promotion path */}
        <section className="border-t border-border/30 pt-8">
          <h2 className="text-lg font-bold text-foreground mb-3">Promotion path</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            Systems move up the trust ladder as they complete verification steps:
          </p>
          <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
            <span className="bg-zinc-500/10 text-zinc-500 px-2 py-1 rounded">Listed</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">
              Community
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
              Vendor
            </span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">
              Certified
            </span>
          </div>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-foreground/85">
            Vendors can accelerate promotion by submitting their adapter for review
            and requesting a certified run through{" "}
            <Link href="/claim" className="text-amber hover:underline">
              the claim flow
            </Link>
            .
          </p>
        </section>

        {/* Stable URL */}
        <section className="border-t border-border/30 pt-8">
          <p className="text-xs text-muted-foreground">
            Stable URL:{" "}
            <code className="font-mono bg-muted/30 px-1 py-0.5 rounded">
              benchd.ai/methodology/trust-tiers
            </code>
            <br />
            Version: <strong>1.0</strong> | Referenced in signed manifests and adapter contracts.
          </p>
        </section>
      </div>
    </div>
  );
}
