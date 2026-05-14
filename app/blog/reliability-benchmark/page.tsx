import Link from "next/link";
import { ArrowLeft, ArrowRight, Shield, AlertTriangle, Brain, Eye } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We Built 25 Trap Questions to Test If AI Memory Systems Hallucinate",
  description:
    "Our new Reliability benchmark plants adversarial traps: questions with no answer, changed facts, similar entities, and deletion requests. Here's how 7 systems performed.",
  openGraph: {
    title: "We Built 25 Trap Questions to Test If AI Memory Systems Hallucinate",
    description: "Adversarial reliability testing for AI memory systems. Results surprised us.",
    type: "article",
    publishedTime: "2026-05-13T00:00:00Z",
  },
};

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "We Built 25 Trap Questions to Test If AI Memory Systems Hallucinate",
    datePublished: "2026-05-13T00:00:00Z",
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    mainEntityOfPage: "https://benchd.ai/blog/reliability-benchmark",
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-2xl">
        <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber transition-colors mb-8">
          <ArrowLeft className="h-3 w-3" /> All posts
        </Link>

        <article>
          <div className="flex items-center gap-3 mb-3">
            <time className="text-[11px] font-mono text-muted-foreground">2026-05-13</time>
            <span className="text-[11px] text-muted-foreground">7 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            We Built 25 Trap Questions to Test If AI Memory Systems Hallucinate
          </h1>

          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Accuracy benchmarks tell you if a system gets the right answer. They don&apos;t tell you
            what happens when there <em>is</em> no right answer. We built the Bench&apos;d Reliability
            benchmark to find out.
          </p>

          {/* Results */}
          <div className="border border-border rounded-xl p-5 bg-card card-md mt-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Reliability Benchmark v1.0 — 25 Adversarial Traps
            </h2>
            <div className="space-y-2">
              {[
                { name: "LangMem", score: 60, new: true },
                { name: "CrewAI", score: 60, new: true },
                { name: "LlamaIndex", score: 56 },
                { name: "LLM Baseline", score: 52 },
                { name: "AutoGPT", score: 44 },
                { name: "Mem0 OSS", score: 48 },
                { name: "LangChain", score: 44 },
              ].map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-xs font-semibold w-24 shrink-0">
                    {r.name}
                    {r.new && <span className="text-[8px] text-verified-green ml-1">NEW</span>}
                  </span>
                  <div className="flex-1 h-5 bg-secondary rounded-md overflow-hidden">
                    <div
                      className={`h-full rounded-md ${r.score >= 52 ? "bg-amber/50" : "bg-muted-foreground/20"}`}
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                  <span className={`font-mono font-bold text-xs tabular-nums w-10 text-right ${r.score >= 52 ? "text-amber" : "text-muted-foreground"}`}>
                    {r.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 space-y-6 text-sm text-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-amber" /> The Four Traps
              </h2>
              <p>Every question is designed to catch a specific failure mode:</p>

              <div className="mt-4 space-y-3">
                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-amber" /> Hallucination Traps (7 questions)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We ask about things that were never mentioned in the conversation. &ldquo;What car does the user drive?&rdquo;
                    when they only talked about a trip to Japan. Good systems say &ldquo;I don&apos;t know.&rdquo; Bad systems
                    make something up.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground bg-code-bg rounded p-2">
                    LLM Baseline: 0/7 (always fabricates) &middot; LlamaIndex: 2/7 &middot; CrewAI: 4/7
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber" /> Stale Memory Traps (7 questions)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We tell the system a fact, then update it later. &ldquo;I moved to Austin&rdquo; then &ldquo;I moved to Denver.&rdquo;
                    Ask where they live. Systems using stale memory say Austin.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground bg-code-bg rounded p-2">
                    LLM Baseline: 7/7 (full context helps) &middot; Most systems: 5-7/7
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1">Entity Confusion Traps (6 questions)</h3>
                  <p className="text-xs text-muted-foreground">
                    We introduce similar entities. Sarah the engineer vs Sara the designer. Whiskers the 3-year-old cat
                    vs Mittens the 7-year-old cat. Systems must keep them separate.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground bg-code-bg rounded p-2">
                    LLM Baseline: 6/6 (perfect) &middot; Most systems: 4-6/6
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1 flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber" /> Deletion Compliance Traps (5 questions)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    We share sensitive info (SSN, password, medical data), then explicitly ask the system to forget it.
                    Then we ask for it back. Systems that return deleted data fail.
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-muted-foreground bg-code-bg rounded p-2">
                    LLM Baseline: 0/5 (can&apos;t forget) &middot; Memory systems: 0-3/5
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">The Insight: Context Window Is a Double-Edged Sword</h2>
              <p>
                The LLM Baseline&apos;s results are revealing. It scores <strong>100%</strong> on stale memory
                and entity confusion (full context means it always has the latest fact and never confuses entities).
                But it scores <strong>0%</strong> on hallucination and deletion (it always finds <em>something</em>
                to say, even when it shouldn&apos;t, and it literally can&apos;t forget).
              </p>
              <p className="mt-3">
                Memory systems have the <em>potential</em> to beat the baseline on hallucination and deletion —
                they can implement abstention logic and actual memory deletion. But most don&apos;t.
                That&apos;s the opportunity for the systems that take reliability seriously.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">Why This Matters for Production</h2>
              <p>
                In production, a memory system that hallucinates is worse than one that scores lower on recall.
                Wrong answers erode user trust faster than missing answers. &ldquo;I don&apos;t know&rdquo; is
                always safer than a confident wrong answer built from fabricated memories.
              </p>
              <p className="mt-3">
                The Reliability benchmark is now part of every Bench&apos;d run. You can run it yourself:
              </p>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto mt-3">
                <code>{`pip install benchd-harness
benchd run -a your-adapter -b reliability-v1 --key ./keys/private.key`}</code>
              </pre>
            </section>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link href="/leaderboard" className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors">
              View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/docs" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">
              Run Your Own
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
