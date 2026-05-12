import Link from "next/link";
import { ArrowRight, CheckCircle, AlertTriangle, Minus, Shield } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare AI Memory Systems: Mem0 vs LlamaIndex vs LangChain",
  description:
    "Side-by-side comparison of AI memory systems with independent benchmark scores. Mem0, LlamaIndex, LangChain, and LLM Baseline tested on LongMemEval and LOCOMO.",
  keywords: [
    "Mem0 vs LlamaIndex",
    "LangChain vs Mem0",
    "AI memory comparison",
    "best AI memory system",
    "Mem0 benchmark results",
    "LlamaIndex memory benchmark",
    "LangChain memory benchmark",
    "ai agent memory comparison",
  ],
  alternates: {
    canonical: "https://benchd.ai/compare",
  },
};

const SYSTEMS = [
  {
    name: "LlamaIndex",
    slug: "llamaindex",
    type: "Framework (OSS)",
    approach: "Document-based memory with vector retrieval and reranking",
    longmemeval: { score: 59.0, status: "verified" },
    locomo: { score: 54.8, status: "verified" },
    strengths: ["Highest verified score", "Strong recall", "Active development"],
    weaknesses: ["Weak temporal reasoning", "Framework complexity"],
    bestFor: "Teams already using LlamaIndex for RAG who need conversation memory",
  },
  {
    name: "LLM Baseline",
    slug: "llm-baseline",
    type: "No memory system",
    approach: "Raw GPT-4o-mini context window, no memory layer",
    longmemeval: { score: 57.6, status: "verified" },
    locomo: { score: 50.4, status: "verified" },
    strengths: ["No setup required", "Full context preservation", "Zero latency overhead"],
    weaknesses: ["No temporal indexing", "Context window limits", "Cost scales with history"],
    bestFor: "Short-to-medium conversations where context window fits",
  },
  {
    name: "LangChain Memory",
    slug: "langchain",
    type: "Framework (OSS)",
    approach: "In-memory message history with LLM-powered recall and smart truncation",
    longmemeval: { score: 59.0, status: "verified" },
    locomo: { score: null, status: "pending" },
    strengths: ["Tied #1 score", "Large ecosystem", "Easy integration"],
    weaknesses: ["Weak temporal reasoning", "Context truncation on long history", "No persistent storage"],
    bestFor: "Teams already using LangChain who need conversation memory",
  },
  {
    name: "Mem0 OSS",
    slug: "mem0-oss",
    type: "Open Source",
    approach: "Automatic memory extraction with vector storage",
    longmemeval: { score: 32.4, status: "verified" },
    locomo: { score: null, status: "pending" },
    strengths: ["Simple API", "Automatic extraction", "Active community"],
    weaknesses: ["Below baseline", "Missing managed platform features", "Weak temporal"],
    bestFor: "Quick memory integration where managed Mem0 isn't available",
  },
  {
    name: "Mem0 Managed",
    slug: "mem0",
    type: "Managed Platform",
    approach: "Proprietary extraction, ranking, and retrieval pipeline",
    longmemeval: { score: 93.4, status: "self-reported" },
    locomo: { score: 68.5, status: "self-reported" },
    strengths: ["Highest claimed score", "Managed infrastructure", "MCP compatible"],
    weaknesses: ["Scores not independently verified", "Closed source", "Paid service"],
    bestFor: "Production deployments if independent verification confirms claims",
  },
];

export default function ComparePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Compare AI Memory Systems: Mem0 vs LlamaIndex vs LangChain",
    dateModified: new Date().toISOString(),
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    description: "Side-by-side comparison of AI memory systems with independent benchmark scores.",
    mainEntityOfPage: "https://benchd.ai/compare",
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-1 w-8 rounded-full bg-amber" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Head-to-Head
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          Compare AI Memory Systems
        </h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Side-by-side comparison based on independent benchmark results.
          All verified scores are from Bench&apos;d runs using our open-source harness under identical conditions.
        </p>

        {/* Quick comparison table */}
        <div className="mt-8 border border-border rounded-xl overflow-hidden bg-card card-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">System</th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">Type</th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">LongMemEval</th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">LOCOMO</th>
                  <th className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEMS.map((sys, i) => (
                  <tr key={sys.slug} className={`border-b border-border last:border-0 ${sys.longmemeval.status === "self-reported" ? "bg-[#DC2626]/[0.02]" : i % 2 ? "bg-muted/[0.15]" : ""}`}>
                    <td className="px-4 py-3">
                      <Link href={`/system/${sys.slug}`} className="font-semibold hover:text-amber transition-colors">
                        {sys.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{sys.type}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-mono tabular-nums font-bold ${sys.longmemeval.status === "self-reported" ? "text-[#DC2626]" : "text-amber"}`}>
                        {sys.longmemeval.score}%
                      </span>
                      {sys.longmemeval.status === "self-reported" && <span className="text-[9px] text-[#DC2626]/60 ml-1">*</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {sys.locomo.score !== null ? (
                        <span className={`font-mono tabular-nums ${sys.locomo.status === "self-reported" ? "text-[#DC2626]" : "text-muted-foreground"}`}>
                          {sys.locomo.score}%
                          {sys.locomo.status === "self-reported" && <span className="text-[9px] text-[#DC2626]/60 ml-1">*</span>}
                        </span>
                      ) : (
                        <Minus className="inline h-3.5 w-3.5 text-muted-foreground/30" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sys.longmemeval.status === "verified" ? (
                        <CheckCircle className="inline h-3.5 w-3.5 text-verified-green" />
                      ) : sys.longmemeval.status === "self-reported" ? (
                        <AlertTriangle className="inline h-3.5 w-3.5 text-[#DC2626]" />
                      ) : (
                        <span className="text-[10px] text-muted-foreground">partial</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border bg-muted/20">
              * Self-reported scores are not independently verified by Bench&apos;d.
            </p>
          </div>
        </div>

        {/* System cards */}
        <div className="mt-10 space-y-6">
          <h2 className="font-serif text-xl font-semibold">Detailed Breakdown</h2>

          {SYSTEMS.map((sys) => (
            <div key={sys.slug} className={`border rounded-xl p-5 bg-card card-sm ${sys.longmemeval.status === "self-reported" ? "border-[#DC2626]/20" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <Link href={`/system/${sys.slug}`} className="font-serif text-lg font-semibold text-foreground hover:text-amber transition-colors">
                    {sys.name}
                  </Link>
                  <span className="text-xs text-muted-foreground ml-2">{sys.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">LongMemEval</span>
                    <span className={`font-mono font-bold text-lg tabular-nums ${sys.longmemeval.status === "self-reported" ? "text-[#DC2626]" : "text-amber"}`}>
                      {sys.longmemeval.score}%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{sys.approach}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <h4 className="font-semibold text-verified-green mb-1.5 text-[10px] uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-1">
                    {sys.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-1.5 text-muted-foreground">
                        <CheckCircle className="h-3 w-3 text-verified-green mt-0.5 shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-[#DC2626] mb-1.5 text-[10px] uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-1">
                    {sys.weaknesses.map((w) => (
                      <li key={w} className="flex items-start gap-1.5 text-muted-foreground">
                        <AlertTriangle className="h-3 w-3 text-[#DC2626]/60 mt-0.5 shrink-0" /> {w}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-amber mb-1.5 text-[10px] uppercase tracking-wider">Best For</h4>
                  <p className="text-muted-foreground">{sys.bestFor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
          >
            Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/benchmarks"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            Benchmark Guide
          </Link>
        </div>

        <div className="mt-8">
          <NewsletterSignup variant="card" />
        </div>
      </div>
    </div>
  );
}
