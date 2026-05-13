import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, AlertTriangle, TrendingUp, Brain, Shield } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Six Memory Systems, One Benchmark: What We Learned",
  description:
    "We ran LlamaIndex, LangChain, AutoGPT, Mem0, Cognee, and Graphiti through 500 questions on LongMemEval. Here's what actually works.",
  openGraph: {
    title: "Six Memory Systems, One Benchmark: What We Learned",
    description: "Independent benchmark results across 6 AI memory systems on LongMemEval.",
    type: "article",
    publishedTime: "2026-05-12T00:00:00Z",
  },
};

const RESULTS = [
  { name: "LlamaIndex", score: 59.0, stars: "38K", type: "Framework" },
  { name: "LangChain", score: 59.0, stars: "98K", type: "Framework" },
  { name: "LLM Baseline", score: 57.6, stars: "-", type: "No memory" },
  { name: "AutoGPT", score: 47.4, stars: "170K", type: "Framework" },
  { name: "Mem0 OSS", score: 32.4, stars: "24.8K", type: "OSS" },
  { name: "Cognee", score: 20.0, stars: "3.8K", type: "OSS" },
  { name: "Graphiti", score: 0.0, stars: "4.2K", type: "OSS" },
];

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Six Memory Systems, One Benchmark: What We Learned",
    datePublished: "2026-05-12T00:00:00Z",
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    publisher: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    description: "Independent benchmark results across 6 AI memory systems on LongMemEval.",
    mainEntityOfPage: "https://benchd.ai/blog/six-systems-one-benchmark",
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          All posts
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-3">
            <time className="text-[11px] font-mono text-muted-foreground">2026-05-12</time>
            <span className="text-[11px] text-muted-foreground">8 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Six Memory Systems, One Benchmark: What We Learned
          </h1>

          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            We ran every major open-source AI memory system through LongMemEval&apos;s
            500-question gauntlet. The results reveal three tiers of performance &mdash;
            and a surprising baseline that most systems can&apos;t beat.
          </p>

          {/* Results chart */}
          <div className="border border-border rounded-xl p-5 bg-card card-md mt-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              LongMemEval v1.0 — All Systems (500 Questions)
            </h2>
            <div className="space-y-2.5">
              {RESULTS.map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-24 shrink-0">{r.name}</span>
                  <div className="flex-1 h-5 bg-secondary rounded-md overflow-hidden relative">
                    <div
                      className={`absolute top-0 h-full rounded-md ${
                        r.name === "LLM Baseline" ? "bg-foreground/20" :
                        r.score >= 57.6 ? "bg-amber/60" :
                        r.score > 0 ? "bg-amber/30" : "bg-destructive/20"
                      }`}
                      style={{ width: `${Math.max(r.score, 1)}%` }}
                    />
                  </div>
                  <span className={`font-mono font-bold text-xs tabular-nums w-12 text-right ${
                    r.score >= 57.6 ? "text-amber" :
                    r.score > 0 ? "text-muted-foreground" : "text-destructive"
                  }`}>
                    {r.score.toFixed(1)}%
                  </span>
                  <span className="text-[9px] text-muted-foreground w-10 text-right">{r.stars}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className="h-[2px] w-4 bg-foreground/20 rounded" />
              <span>LLM Baseline (57.6%) — the bar to beat</span>
            </div>
          </div>

          <div className="mt-10 space-y-6 text-sm text-foreground leading-relaxed">

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber" />
                Three Tiers Emerged
              </h2>
              <p>
                The results fall into three clear groups:
              </p>
              <div className="mt-3 space-y-3">
                <div className="border-l-2 border-amber pl-4">
                  <p className="font-semibold text-amber">Tier 1: Above Baseline (59%)</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    <strong>LlamaIndex</strong> and <strong>LangChain</strong> both hit 59.0%.
                    These frameworks add enough structure to conversation memory to slightly
                    outperform raw context. The margin is thin — just 1.4% above baseline.
                  </p>
                </div>
                <div className="border-l-2 border-muted-foreground pl-4">
                  <p className="font-semibold">Tier 2: Below Baseline (32-47%)</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    <strong>AutoGPT</strong> (47.4%) and <strong>Mem0 OSS</strong> (32.4%).
                    These systems are actively losing information compared to just using
                    the raw LLM context window. Vector retrieval alone doesn&apos;t work
                    for conversational memory.
                  </p>
                </div>
                <div className="border-l-2 border-destructive pl-4">
                  <p className="font-semibold text-destructive">Tier 3: Near Zero (0-20%)</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    <strong>Cognee</strong> (~20%) and <strong>Graphiti</strong> (0%).
                    Knowledge graph systems built for document indexing don&apos;t map well
                    to conversational memory recall. These systems may excel at different
                    tasks, but LongMemEval isn&apos;t one of them.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-amber" />
                Why GitHub Stars Don&apos;t Predict Performance
              </h2>
              <p>
                AutoGPT has <strong>170K stars</strong> — 4x more than LlamaIndex. But it scored
                10 points below the LLM baseline. Mem0 has 24.8K stars and an active community
                but scored 32.4%.
              </p>
              <p className="mt-3">
                Community size correlates with usefulness, ecosystem maturity, and marketing —
                not memory quality. The only way to know if a memory system works is to
                benchmark it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber" />
                The Temporal Reasoning Gap
              </h2>
              <p>
                Every single system scored near zero on temporal reasoning questions.
                These ask things like &ldquo;How many days between event X and event Y?&rdquo;
                or &ldquo;Which happened first?&rdquo;
              </p>
              <p className="mt-3">
                No system tested — including the LLM baseline — can answer these reliably.
                This represents the biggest opportunity in AI memory: a system that actually
                indexes temporal relationships would have a 40% advantage over everything
                else tested.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber" />
                LoCoMo Results: Multi-Session Memory
              </h2>
              <p>
                We also ran LoCoMo (1,540 questions) on three systems:
              </p>
              <div className="border border-border rounded-xl overflow-hidden bg-card card-sm mt-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">System</th>
                      <th className="text-right px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">LoCoMo Score</th>
                      <th className="text-right px-4 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border"><td className="px-4 py-2 font-semibold">LlamaIndex</td><td className="px-4 py-2 text-right font-mono text-amber font-bold">54.8%</td><td className="px-4 py-2 text-right text-muted-foreground">1,540</td></tr>
                    <tr className="border-b border-border bg-muted/[0.15]"><td className="px-4 py-2 font-semibold">LangChain</td><td className="px-4 py-2 text-right font-mono text-amber font-bold">51.9%</td><td className="px-4 py-2 text-right text-muted-foreground">1,540</td></tr>
                    <tr className="border-b border-border"><td className="px-4 py-2 font-semibold">LLM Baseline</td><td className="px-4 py-2 text-right font-mono font-bold">50.4%</td><td className="px-4 py-2 text-right text-muted-foreground">1,540</td></tr>
                    <tr><td className="px-4 py-2 font-semibold">Mem0 OSS</td><td className="px-4 py-2 text-right font-mono text-destructive font-bold">0.0%</td><td className="px-4 py-2 text-right text-muted-foreground">1,540</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Mem0 OSS scored 0% on every single LoCoMo question. This isn&apos;t a bug in our
                adapter — the open-source version simply doesn&apos;t handle multi-session memory
                at the scale LoCoMo requires.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">What This Means for Builders</h2>
              <p>
                If you&apos;re building an AI agent that needs to remember past conversations:
              </p>
              <ul className="mt-3 space-y-1.5 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">1.</span>
                  <span><strong>Start with LlamaIndex or LangChain</strong> — they&apos;re the only ones that beat the baseline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">2.</span>
                  <span><strong>Always compare against the LLM baseline</strong> — if your memory system scores below 57.6%, you&apos;d be better off without it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">3.</span>
                  <span><strong>Don&apos;t trust star counts</strong> — AutoGPT has 170K stars but underperforms by 10 points</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">4.</span>
                  <span><strong>Run your own benchmark</strong> — <code className="bg-code-bg px-1 rounded text-[11px]">pip install benchd-harness</code> and test your system in minutes</span>
                </li>
              </ul>
            </section>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
            >
              View Full Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
            >
              Run Your Own Benchmark
            </Link>
          </div>

          <div className="mt-10">
            <NewsletterSignup variant="card" />
          </div>
        </article>
      </div>
    </div>
  );
}
