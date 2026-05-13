import Link from "next/link";
import { ArrowRight, BookOpen, BarChart3, Clock, Shield, Brain, Layers, Target, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Memory Benchmarks 2026: Complete Guide to Evaluating Agent Memory",
  description:
    "Comprehensive guide to AI memory benchmarks including LongMemEval, LOCOMO, MemoryArena, and MemScore. Independent results comparing Mem0, LlamaIndex, LangChain, and more.",
  keywords: [
    "ai memory benchmark",
    "ai memory benchmark 2026",
    "agent memory benchmark",
    "LongMemEval",
    "LOCOMO benchmark",
    "MemoryArena",
    "MemScore",
    "Mem0 benchmark",
    "LlamaIndex memory",
    "LangChain memory",
    "AI agent memory evaluation",
    "conversational memory benchmark",
    "long-term memory AI",
  ],
  openGraph: {
    title: "AI Memory Benchmarks 2026: Complete Guide",
    description: "Independent benchmark results and methodology for evaluating AI memory systems.",
    type: "article",
  },
  alternates: {
    canonical: "https://benchd.ai/benchmarks",
  },
};

export default function BenchmarksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "AI Memory Benchmarks 2026: Complete Guide to Evaluating Agent Memory",
    datePublished: "2026-05-11T00:00:00Z",
    dateModified: new Date().toISOString(),
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    publisher: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    description: "Comprehensive guide to AI memory benchmarks including LongMemEval, LOCOMO, MemoryArena, and MemScore with independent results.",
    mainEntityOfPage: "https://benchd.ai/benchmarks",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best AI memory benchmark in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The leading AI memory benchmarks in 2026 are LongMemEval (500 questions testing recall, temporal reasoning, and knowledge updates), LOCOMO (1,540 questions for multi-session conversational memory), and MemoryArena (agentic task evaluation). Bench'd runs all three benchmarks independently with cryptographically signed results. LongMemEval is the most widely cited for comparing memory systems like Mem0, LlamaIndex, and LangChain.",
        },
      },
      {
        "@type": "Question",
        name: "How does Mem0 perform on AI memory benchmarks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Mem0's managed platform self-reports 93.4% on LongMemEval, while independent Bench'd testing of Mem0's open-source edition scores 32.4%. On LOCOMO, Mem0 reports 66.9-68.5% accuracy. The gap between managed and OSS versions is due to proprietary extraction and ranking in the managed platform. Bench'd independently verifies all scores with cryptographically signed results.",
        },
      },
      {
        "@type": "Question",
        name: "What is LongMemEval?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LongMemEval is a 500-question benchmark for evaluating AI memory systems across three dimensions: recall (retrieving specific facts), temporal reasoning (understanding when events happened), and knowledge updates (tracking changed information). It was designed to test how well systems remember information across long conversations. Bench'd uses LongMemEval as a primary benchmark with independent, reproducible runs.",
        },
      },
      {
        "@type": "Question",
        name: "What is the LOCOMO benchmark?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LOCOMO (Long Conversational Memory) is a 1,540-question benchmark designed to evaluate multi-session conversational memory. It tests systems on their ability to recall information across multiple separate conversations over time. LOCOMO has become a leading standard for evaluating agent memory, with systems like Mem0 achieving 66.9-68.5% accuracy compared to OpenAI's native memory at 52.9%.",
        },
      },
      {
        "@type": "Question",
        name: "Can a plain LLM beat dedicated memory systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Bench'd's independent testing found that a plain GPT-4o-mini with no memory layer scores 57.6% on LongMemEval — higher than LangChain (59.0%) and Mem0 OSS (32.4%). Only LlamaIndex (59.0%) beat the baseline. This suggests most memory systems lose information through compression and summarization faster than they organize it.",
        },
      },
      {
        "@type": "Question",
        name: "How do you verify AI memory benchmark results?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bench'd verifies results through cryptographic signing — every benchmark run produces an Ed25519-signed manifest containing all inputs, outputs, and scores. Anyone can independently verify the signature and reproduce the run using the open-source harness. This prevents vendors from cherry-picking results or running on different datasets than claimed.",
        },
      },
    ],
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-1 w-8 rounded-full bg-amber" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            Definitive Guide
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
          AI Memory Benchmarks in 2026: How to Evaluate Agent Memory Systems
        </h1>

        <p className="mt-4 text-base text-muted-foreground leading-relaxed">
          As AI agents move from single-turn interactions to persistent, multi-session relationships,
          memory becomes the critical differentiator. But how do you measure whether a memory system
          actually works? This guide covers every major benchmark, what they test, and what the
          independent results reveal.
        </p>

        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="font-mono">Updated May 2026</span>
          <span>15 min read</span>
          <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-amber" /> Independent results</span>
        </div>

        {/* Table of Contents */}
        <nav className="mt-8 border border-border rounded-xl p-5 bg-card card-sm">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Contents
          </h2>
          <ul className="space-y-1.5 text-sm">
            {[
              { id: "why-benchmark", label: "Why Benchmark AI Memory?" },
              { id: "major-benchmarks", label: "Major Benchmarks: LongMemEval, LOCOMO, MemoryArena" },
              { id: "metrics", label: "Key Metrics: MemScore, Recall, Temporal Accuracy" },
              { id: "results-2026", label: "Independent Results (May 2026)" },
              { id: "llm-baseline", label: "The LLM Baseline Problem" },
              { id: "self-reported", label: "Self-Reported vs Independent Scores" },
              { id: "choosing", label: "Choosing the Right Benchmark" },
              { id: "verification", label: "How Bench'd Verifies Results" },
              { id: "faq", label: "FAQ" },
            ].map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-muted-foreground hover:text-amber transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <div className="mt-10 space-y-10 text-sm text-foreground leading-relaxed">

          {/* Why Benchmark */}
          <section id="why-benchmark">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-amber" />
              Why Benchmark AI Memory?
            </h2>
            <p>
              Every major memory vendor publishes impressive numbers. Mem0 claims 93.4% on LongMemEval.
              Other vendors report similar scores on their preferred metrics. But these numbers are
              rarely comparable — they use different datasets, different evaluation criteria, and
              different versions of the same benchmarks.
            </p>
            <p className="mt-3">
              Independent benchmarking solves this by running every system through the <em>exact same</em>{" "}
              evaluation under <em>identical conditions</em>. At Bench&apos;d, every run is cryptographically
              signed, every input and output is recorded, and anyone can reproduce the results using
              our <a href="https://github.com/benchdai/harness" className="text-amber hover:text-amber/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">open-source harness</a>.
            </p>
          </section>

          {/* Major Benchmarks */}
          <section id="major-benchmarks">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <Layers className="h-5 w-5 text-amber" />
              Major AI Memory Benchmarks
            </h2>
            <p className="mb-4">
              Three benchmarks have emerged as the primary standards for evaluating AI memory systems in 2026:
            </p>

            {/* LongMemEval */}
            <div className="border border-border rounded-xl p-5 bg-card card-sm mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-foreground">LongMemEval</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 font-semibold">
                  PRIMARY
                </span>
              </div>
              <p className="text-muted-foreground text-xs mb-3">
                500 questions across 3 dimensions. The most widely cited benchmark for comparing memory systems.
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-amber">500</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Questions</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-foreground">3</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Dimensions</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-foreground">4+</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Systems Tested</p>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs">
                <div className="flex items-start gap-2">
                  <Target className="h-3.5 w-3.5 text-amber mt-0.5 shrink-0" />
                  <span><strong>Recall</strong> — Can the system retrieve specific facts from past conversations?</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 text-amber mt-0.5 shrink-0" />
                  <span><strong>Temporal reasoning</strong> — Does the system understand when events happened and their sequence?</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-amber mt-0.5 shrink-0" />
                  <span><strong>Knowledge update</strong> — When facts change, does the system track the latest version?</span>
                </div>
              </div>
            </div>

            {/* LOCOMO */}
            <div className="border border-border rounded-xl p-5 bg-card card-sm mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-foreground">LOCOMO (Long Conversational Memory)</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border font-semibold">
                  SUPPORTED
                </span>
              </div>
              <p className="text-muted-foreground text-xs mb-3">
                1,540 questions designed for multi-session conversational memory evaluation. The benchmark that
                showed Mem0 (66.9&ndash;68.5%) outperforming OpenAI&apos;s native memory (52.9%).
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-foreground">1,540</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Questions</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-foreground">Multi</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Session</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <p className="font-mono font-bold text-foreground">2+</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Systems Tested</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                LOCOMO tests memory across separate conversation sessions, simulating real-world agent usage
                where context must persist across days or weeks. Bench&apos;d runs LOCOMO as part of our
                standard evaluation suite.
              </p>
            </div>

            {/* MemoryArena */}
            <div className="border border-border rounded-xl p-5 bg-card card-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-semibold text-foreground">MemoryArena</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border font-semibold">
                  TRACKING
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                Evaluates memory in the context of agentic tasks — not just recall, but whether memory
                actually improves task completion. Focuses on how agents use stored information to make
                better decisions over time. MemoryArena tests are on our roadmap for Q3 2026.
              </p>
            </div>
          </section>

          {/* Metrics */}
          <section id="metrics">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-amber" />
              Key Metrics for AI Memory Evaluation
            </h2>

            <p className="mb-4">
              Different benchmarks use different scoring approaches. Here are the key metrics used
              across the ecosystem:
            </p>

            <div className="space-y-3">
              <div className="border border-border rounded-lg p-4 bg-card">
                <h3 className="text-sm font-semibold mb-1">Bench&apos;d Verified Score (Deterministic)</h3>
                <p className="text-xs text-muted-foreground">
                  Exact-match and retrieval quality scoring. Pure math — no LLM judge involved.
                  Reproducible by anyone. This is our primary ranking metric.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <h3 className="text-sm font-semibold mb-1">Bench&apos;d Nuance Score (LLM-Judged)</h3>
                <p className="text-xs text-muted-foreground">
                  LLM-judged synthesis and open-ended recall. Captures quality that exact-match misses.
                  May vary slightly between judge updates.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <h3 className="text-sm font-semibold mb-1">MemScore</h3>
                <p className="text-xs text-muted-foreground">
                  A composite metric combining accuracy, latency, and token efficiency. Proposed by
                  the MemoryBench/MemScore framework. Useful for production trade-off analysis where
                  cost and speed matter alongside accuracy.
                </p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-card">
                <h3 className="text-sm font-semibold mb-1">FAMA (Forgetting-Aware Memory Accuracy)</h3>
                <p className="text-xs text-muted-foreground">
                  Measures how well systems handle knowledge updates over time, penalizing reliance on
                  outdated information. Used by the Memora and FAMA benchmarks.
                </p>
              </div>
            </div>
          </section>

          {/* Results */}
          <section id="results-2026">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber" />
              Independent Results (May 2026)
            </h2>

            <p className="mb-4">
              These are Bench&apos;d&apos;s independently verified results. Every score was generated
              by our open-source harness under controlled conditions, with cryptographically signed
              manifests.
            </p>

            <div className="border border-border rounded-xl overflow-hidden bg-card card-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">#</th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">System</th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Type</th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">LongMemEval</th>
                    <th className="text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">LoCoMo</th>
                    <th className="text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: "LlamaIndex", type: "Framework", lme: "59.0%", locomo: "54.8%", status: "Verified", link: "/system/llamaindex" },
                    { rank: 1, name: "LangChain", type: "Framework", lme: "59.0%", locomo: "51.9%", status: "Verified", link: "/system/langchain" },
                    { rank: 3, name: "LLM Baseline", type: "No memory", lme: "57.6%", locomo: "50.4%", status: "Verified", link: "/system/llm-baseline" },
                    { rank: 4, name: "AutoGPT Memory", type: "Framework", lme: "47.4%", locomo: "--", status: "Verified", link: "/system/autogpt-memory" },
                    { rank: 5, name: "Mem0 OSS", type: "Open Source", lme: "32.4%", locomo: "0.0%", status: "Verified", link: "/system/mem0-oss" },
                    { rank: 6, name: "Graphiti", type: "Knowledge Graph", lme: "0.0%", locomo: "--", status: "Verified", link: "/system/graphiti" },
                    { rank: null, name: "Mem0 Managed", type: "Managed", lme: "93.4%*", locomo: "68.5%*", status: "Self-reported", link: "/system/mem0" },
                  ].map((row, i) => (
                    <tr key={row.name} className={`border-b border-border last:border-0 ${!row.rank ? "bg-[#DC2626]/[0.02]" : i % 2 ? "bg-muted/[0.15]" : ""}`}>
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.rank || "--"}</td>
                      <td className="px-4 py-2.5">
                        <Link href={row.link} className="font-semibold hover:text-amber transition-colors">{row.name}</Link>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.type}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums font-bold text-amber">{row.lme}</td>
                      <td className="px-4 py-2.5 text-right font-mono tabular-nums text-muted-foreground">{row.locomo}</td>
                      <td className="px-4 py-2.5">
                        {row.status === "Verified" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-verified-green font-medium">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        ) : row.status === "Self-reported" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[#DC2626] font-medium">
                            <AlertTriangle className="h-3 w-3" /> Self-reported
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground">{row.status}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-4 py-2 text-[10px] text-muted-foreground border-t border-border bg-muted/20">
                * Self-reported scores are not independently verified. See{" "}
                <Link href="/trust" className="text-amber hover:text-amber/80">trust tiers</Link>.
                All verified scores use GPT-4o-mini via OpenRouter under identical conditions.
              </p>
            </div>
          </section>

          {/* LLM Baseline */}
          <section id="llm-baseline">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber" />
              The LLM Baseline Problem
            </h2>
            <p>
              One of the most important findings from our testing: <strong>a plain LLM with no memory
              system scores higher than most dedicated memory systems.</strong> GPT-4o-mini with the
              full conversation in its context window achieves 57.6% on LongMemEval — beating
              LangChain (59.0%) and Mem0 OSS (32.4%).
            </p>
            <p className="mt-3">
              This reveals a fundamental problem: most memory systems destroy information through
              compression and summarization faster than they organize it. The raw context window
              preserves every detail, while memory systems must decide what to keep and what to
              discard — and most make poor choices.
            </p>
            <p className="mt-3">
              The LLM baseline is included on every Bench&apos;d leaderboard as the bar to beat.
              A memory system that scores below the baseline is actively <em>harmful</em> — you&apos;d
              be better off with no memory system at all.
            </p>
            <p className="mt-3">
              <Link href="/blog/llm-baseline-beats-memory-systems" className="text-amber hover:text-amber/80 underline underline-offset-2">
                Read the full analysis
              </Link>
            </p>
          </section>

          {/* Self-Reported */}
          <section id="self-reported">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber" />
              Self-Reported vs Independent Scores
            </h2>
            <p>
              Vendor self-reported scores are common in the AI memory space. Mem0&apos;s managed platform
              claims 93.4% on LongMemEval; our independent test of their OSS edition scored 32.4%.
              These are different products, but the gap highlights why independent verification matters.
            </p>
            <p className="mt-3">
              Bench&apos;d uses a{" "}
              <Link href="/trust" className="text-amber hover:text-amber/80 underline underline-offset-2">
                trust tier system
              </Link>{" "}
              to clearly distinguish between:
            </p>
            <ul className="mt-2 space-y-1.5 ml-4 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-verified-green mt-0.5 shrink-0" />
                <span><strong>Community-Verified</strong> — Run by Bench&apos;d, cryptographically signed</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-amber mt-0.5 shrink-0" />
                <span><strong>Vendor-Verified</strong> — Run by the vendor using our harness, co-signed</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-[#DC2626] mt-0.5 shrink-0" />
                <span><strong>Self-Reported</strong> — Vendor claims, not independently verified</span>
              </li>
            </ul>
          </section>

          {/* Choosing */}
          <section id="choosing">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber" />
              Choosing the Right Benchmark
            </h2>
            <div className="border border-border rounded-xl overflow-hidden bg-card card-sm">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Use Case</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Best Benchmark</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">Chatbot with history</td>
                    <td className="px-4 py-2.5 text-amber font-semibold">LongMemEval</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Tests single-session recall and temporal understanding</td>
                  </tr>
                  <tr className="border-b border-border bg-muted/[0.15]">
                    <td className="px-4 py-2.5 font-medium">Multi-day agent</td>
                    <td className="px-4 py-2.5 text-amber font-semibold">LOCOMO</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Tests cross-session memory persistence</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2.5 font-medium">Task-completing agent</td>
                    <td className="px-4 py-2.5 text-amber font-semibold">MemoryArena</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Tests if memory improves task outcomes</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Production trade-offs</td>
                    <td className="px-4 py-2.5 text-amber font-semibold">MemScore</td>
                    <td className="px-4 py-2.5 text-muted-foreground">Balances accuracy, latency, and cost</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Verification */}
          <section id="verification">
            <h2 className="font-serif text-2xl font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber" />
              How Bench&apos;d Verifies Results
            </h2>
            <p>
              Every Bench&apos;d run produces a signed manifest containing:
            </p>
            <ul className="mt-2 space-y-1 ml-4 text-xs">
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">1.</span>
                <span>Every question, the system&apos;s response, and the expected answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">2.</span>
                <span>Deterministic scoring (exact match, regex) and LLM-judged scoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">3.</span>
                <span>An Ed25519 cryptographic signature proving the data hasn&apos;t been tampered with</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">4.</span>
                <span>Full failure traces for every incorrect answer</span>
              </li>
            </ul>
            <p className="mt-3">
              The harness is{" "}
              <a href="https://github.com/benchdai/harness" className="text-amber hover:text-amber/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                fully open source
              </a>. Anyone can reproduce any run.
            </p>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is the best AI memory benchmark in 2026?",
                  a: "LongMemEval is the most widely cited for direct system comparison (500 questions, 3 dimensions). LOCOMO is best for multi-session evaluation (1,540 questions). MemoryArena tests agentic task completion. Bench'd runs all three independently.",
                },
                {
                  q: "How does Mem0 perform on AI memory benchmarks?",
                  a: "Mem0's managed platform self-reports 93.4% on LongMemEval and 66.9-68.5% on LOCOMO. Bench'd's independent test of Mem0's open-source edition scored 32.4% on LongMemEval. The managed and OSS versions are different products with different capabilities.",
                },
                {
                  q: "Can a plain LLM beat dedicated memory systems?",
                  a: "Yes. Bench'd found that GPT-4o-mini with no memory layer scores 57.6% on LongMemEval — higher than LangChain (59.0%) and Mem0 OSS (32.4%). Only LlamaIndex (59.0%) beat the baseline. Memory systems that score below the baseline are actively harmful.",
                },
                {
                  q: "How can I run these benchmarks on my own system?",
                  a: "Install the open-source Bench'd harness from GitHub, write an adapter for your system (or use a built-in one), and run: benchd run -a your-adapter -b longmemeval-v1 --judge. Results are automatically signed and verifiable.",
                },
                {
                  q: "What is MemScore?",
                  a: "MemScore is a composite metric that combines accuracy, latency, and token efficiency into a single score. It's useful for production deployments where cost and speed matter alongside correctness.",
                },
                {
                  q: "How do I get my system listed on Bench'd?",
                  a: "Claim your system profile at benchd.ai/claim. You can either wait for us to run an independent evaluation, or run the harness yourself for a vendor-verified score.",
                },
              ].map((item, i) => (
                <details key={i} className="border border-border rounded-lg bg-card group">
                  <summary className="px-4 py-3 text-sm font-semibold text-foreground cursor-pointer hover:text-amber transition-colors list-none flex items-center justify-between">
                    {item.q}
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-2" />
                  </summary>
                  <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
          >
            View Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/methodology"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            Read Full Methodology
          </Link>
        </div>

        {/* Newsletter */}
        <div className="mt-8">
          <NewsletterSignup variant="card" />
        </div>
      </div>
    </div>
  );
}
