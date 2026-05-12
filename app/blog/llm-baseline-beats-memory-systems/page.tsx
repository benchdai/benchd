import Link from "next/link";
import { ArrowLeft, ArrowRight, Shield, AlertTriangle, TrendingUp, Brain } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Raw LLM Beats Most Memory Systems on LongMemEval",
  description:
    "Our first benchmark results are in. A plain GPT-4o-mini with no memory layer scores 57.6% — higher than LangChain (34.0%) and Mem0 OSS (32.4%). Only LlamaIndex (59.0%) beats the baseline.",
  openGraph: {
    title: "A Raw LLM Beats Most Memory Systems on LongMemEval",
    description: "A plain GPT-4o-mini with no memory layer scores 57.6% on LongMemEval — higher than most dedicated memory systems.",
    type: "article",
    publishedTime: "2026-05-11T00:00:00Z",
  },
};

const RESULTS = [
  { name: "LlamaIndex", score: 59.0, color: "text-amber", note: null },
  { name: "LangChain", score: 59.0, color: "text-amber", note: "Full 500q run" },
  { name: "LLM Baseline", score: 57.6, color: "text-foreground", note: "No memory system" },
  { name: "Mem0 OSS", score: 32.4, color: "text-muted-foreground", note: "Open-source edition" },
];

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "A Raw LLM Beats Most Memory Systems on LongMemEval",
    datePublished: "2026-05-11T00:00:00Z",
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    publisher: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    description: "Our first benchmark results are in. A plain GPT-4o-mini with no memory layer scores 57.6% — higher than LangChain and Mem0 OSS.",
    mainEntityOfPage: "https://benchd.ai/blog/llm-baseline-beats-memory-systems",
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-2xl">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-amber transition-colors mb-8"
        >
          <ArrowLeft className="h-3 w-3" />
          All posts
        </Link>

        {/* Header */}
        <article>
          <div className="flex items-center gap-3 mb-3">
            <time className="text-[11px] font-mono text-muted-foreground">2026-05-11</time>
            <span className="text-[11px] text-muted-foreground">6 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            A Raw LLM Beats Most Memory Systems on LongMemEval
          </h1>

          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            We ran four systems through the full 500-question LongMemEval benchmark
            under identical conditions. The result that surprised us: a plain
            GPT-4o-mini with no memory layer outperformed most dedicated memory systems.
          </p>

          {/* Results card */}
          <div className="border border-border rounded-xl p-5 bg-card card-md mt-8">
            <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              LongMemEval v1.0 — Nuance Scores (LLM-Judged)
            </h2>
            <div className="space-y-3">
              {RESULTS.map((r) => (
                <div key={r.name} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-28 shrink-0">{r.name}</span>
                  <div className="flex-1 h-6 bg-secondary rounded-md overflow-hidden relative">
                    <div
                      className="h-full bg-amber/20 rounded-md"
                      style={{ width: `${r.score}%` }}
                    />
                    <div
                      className="absolute top-0 h-full bg-amber/60 rounded-md"
                      style={{ width: `${r.score}%` }}
                    />
                  </div>
                  <span className={`font-mono font-bold text-sm tabular-nums w-14 text-right ${r.color}`}>
                    {r.score.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              All runs used GPT-4o-mini via OpenRouter. Full methodology at{" "}
              <Link href="/methodology" className="text-amber hover:text-amber/80">/methodology</Link>.
            </p>
          </div>

          {/* Article body */}
          <div className="mt-10 space-y-6 text-sm text-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-amber" />
                What We Tested
              </h2>
              <p>
                LongMemEval is a 500-question benchmark designed to test how well systems
                remember information across long conversations. It covers three dimensions:
              </p>
              <ul className="mt-3 space-y-1.5 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">&#x2022;</span>
                  <span><strong>Recall</strong> — Can you retrieve specific facts from past conversations?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">&#x2022;</span>
                  <span><strong>Temporal reasoning</strong> — Can you understand when things happened and their order?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber mt-0.5">&#x2022;</span>
                  <span><strong>Knowledge update</strong> — When facts change, do you track the latest version?</span>
                </li>
              </ul>
              <p className="mt-3">
                Each system received the exact same conversation histories and questions.
                The &ldquo;LLM Baseline&rdquo; system is a plain GPT-4o-mini that receives the full
                conversation history in its context window with no memory layer, no vector
                store, and no summarization.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber" />
                The Surprising Result
              </h2>
              <p>
                The LLM baseline scored <strong>57.6%</strong> — a score that most memory systems
                failed to beat. Only LlamaIndex&apos;s memory module (59.0%) managed to edge it out.
              </p>
              <p className="mt-3">
                This tells us something important: <em>most memory systems are destroying
                information faster than they&apos;re organizing it.</em> When you summarize, compress,
                or selectively store conversation turns, you lose the raw signal that the
                LLM could have used to answer correctly.
              </p>
              <p className="mt-3">
                The baseline wins on recall-heavy questions because it literally has the
                full conversation. Memory systems lose when their extraction or compression
                drops the specific detail being asked about.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber" />
                Where Memory Systems Should Win
              </h2>
              <p>
                Memory systems have the <em>potential</em> to beat the baseline on temporal
                reasoning and knowledge updates — these require understanding structure
                that raw context doesn&apos;t encode well. But in practice, most current
                implementations don&apos;t.
              </p>
              <p className="mt-3">
                Every system scored poorly on temporal reasoning. The baseline scored
                near-zero because it has no temporal index. But memory systems with
                timestamped storage <em>also</em> scored near-zero — suggesting they store
                timestamps but don&apos;t use them during recall.
              </p>
              <p className="mt-3">
                This is the opportunity. A memory system that actually indexes temporal
                relationships and change events should dramatically outperform the baseline
                on 40% of LongMemEval questions.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-amber" />
                A Note on Mem0&apos;s Self-Reported 93.4%
              </h2>
              <p>
                Mem0&apos;s managed platform claims 93.4% on LongMemEval. Our test of the
                open-source edition scored 32.4%. These are <em>different products</em> — the
                managed platform has proprietary extraction, ranking, and retrieval that
                the OSS library doesn&apos;t include.
              </p>
              <p className="mt-3">
                We haven&apos;t verified the managed platform&apos;s score yet. That&apos;s on the roadmap.
                When we do, it will be an independent, signed run — not a self-report.
                Until then, the 93.4% claim is labeled &ldquo;Self-Reported&rdquo; on our leaderboard.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">What&apos;s Next</h2>
              <p>
                We&apos;re expanding coverage. Next up: LoCoMo benchmark results (1,540 questions,
                different evaluation dimensions), Cognee with direct OpenAI embeddings,
                and a re-run of LangChain with our updated adapter that no longer crashes
                at question 380.
              </p>
              <p className="mt-3">
                The harness is open source. If you maintain a memory system and want to
                verify your own scores,{" "}
                <Link href="/run" className="text-amber hover:text-amber/80 underline underline-offset-2">
                  run the harness yourself
                </Link>{" "}
                or{" "}
                <Link href="/claim" className="text-amber hover:text-amber/80 underline underline-offset-2">
                  claim your profile
                </Link>{" "}
                for an official vendor-verified run.
              </p>
            </section>
          </div>

          {/* Results table */}
          <div className="border border-border rounded-xl overflow-hidden bg-card card-sm mt-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">System</th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Recall</th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Temporal</th>
                  <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Overall</th>
                  <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "LlamaIndex", recall: "68.8", temporal: "23.8", overall: "59.0", bench: "LongMemEval (500q)" },
                  { name: "LLM Baseline", recall: "72.5", temporal: "~0", overall: "57.6", bench: "LongMemEval (500q)" },
                  { name: "LangChain", recall: "59.0", temporal: "~0", overall: "59.0", bench: "LongMemEval (500q)" },
                  { name: "Mem0 OSS", recall: "40.2", temporal: "~0", overall: "32.4", bench: "LongMemEval (500q)" },
                ].map((row, i) => (
                  <tr key={row.name} className={`border-b border-border last:border-0 ${i % 2 ? "bg-muted/[0.15]" : ""}`}>
                    <td className="px-4 py-2.5 font-semibold">{row.name}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums">{row.recall}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{row.temporal}</td>
                    <td className="px-4 py-2.5 text-right font-mono tabular-nums font-bold text-amber">{row.overall}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.bench}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="mt-8 flex items-center gap-3">
            <Link
              href="/leaderboard"
              className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
            >
              View Full Leaderboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
            >
              Read Methodology
            </Link>
          </div>

          {/* Newsletter */}
          <div className="mt-10">
            <NewsletterSignup variant="card" />
          </div>
        </article>
      </div>
    </div>
  );
}
