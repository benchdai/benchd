import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Layers, Target } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "We Stopped Comparing Filing Cabinets to Chatbots",
  description:
    "gbrain scores 100% when tested on what it's built for. Here's why we created separate tracks for Knowledge Brains vs Conversational Memory.",
  openGraph: {
    title: "We Stopped Comparing Filing Cabinets to Chatbots",
    description: "gbrain scores 100% when tested on what it's built for. Here's why we created separate tracks.",
    type: "article",
    publishedTime: "2026-05-16T00:00:00Z",
  },
};

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "We Stopped Comparing Filing Cabinets to Chatbots",
    datePublished: "2026-05-16T00:00:00Z",
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    mainEntityOfPage: "https://benchd.ai/blog/knowledge-brain-track",
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
            <time className="text-[11px] font-mono text-muted-foreground">2026-05-16</time>
            <span className="text-[11px] text-muted-foreground">6 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            We Stopped Comparing Filing Cabinets to Chatbots
          </h1>

          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            gbrain scored 0% on LongMemEval — our conversational memory benchmark. That&apos;s like testing a
            filing cabinet on a pop quiz. It doesn&apos;t mean the filing cabinet is broken. It means we were
            measuring the wrong thing. So we built separate tracks.
          </p>

          {/* The Problem */}
          <div className="mt-10 space-y-6 text-sm text-foreground leading-relaxed">
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-amber" /> The Problem: One Benchmark Can&apos;t Rule Them All
              </h2>
              <p>
                LongMemEval tests conversational memory — multi-session chat history, temporal reasoning,
                user preference tracking across dialogue. It&apos;s the right test for systems like LlamaIndex,
                LangChain, Mem0, and Letta that integrate into chat agents.
              </p>
              <p className="mt-3">
                But gbrain isn&apos;t a chat memory system. It&apos;s a knowledge brain — a structured store for
                documents, facts, and domain knowledge. Asking it &ldquo;what did the user say in session 3?&rdquo;
                is a category error. It was never designed to track conversation history.
              </p>
              <p className="mt-3">
                Publishing gbrain at 0% on a conversational benchmark isn&apos;t honest evaluation.
                It&apos;s a misleading comparison that punishes a system for not being something it never claimed to be.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber" /> The Fix: Separate Tracks
              </h2>
              <p>
                Bench&apos;d now runs two tracks:
              </p>
              <div className="mt-4 space-y-3">
                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1">Conversational Memory Track</h3>
                  <p className="text-xs text-muted-foreground">
                    Multi-session dialogue, temporal reasoning, preference updates, entity tracking across
                    conversations. Benchmarks: LongMemEval, Reliability, Poisoning Resistance.
                    For: LlamaIndex, LangChain, Mem0, Letta, AutoGPT, CrewAI.
                  </p>
                </div>

                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold mb-1">Knowledge Retrieval Track</h3>
                  <p className="text-xs text-muted-foreground">
                    Document storage, semantic search, knowledge updates, multi-page reasoning.
                    Purpose-built for knowledge brains that store and retrieve structured information.
                    For: gbrain, Cognee, Graphiti, Quivr.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber" /> Knowledge Retrieval Benchmark: What It Tests
              </h2>
              <p>
                We built 20 test cases across four dimensions:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
                <li><strong className="text-foreground">Document Storage</strong> — Can the system ingest and faithfully store multi-page documents?</li>
                <li><strong className="text-foreground">Semantic Search</strong> — Can it find relevant content from natural language queries, not just keyword matches?</li>
                <li><strong className="text-foreground">Knowledge Updates</strong> — When a document is updated, does the system reflect the new version?</li>
                <li><strong className="text-foreground">Multi-Page Reasoning</strong> — Can it synthesize answers from information spread across multiple documents?</li>
              </ul>
            </section>

            {/* Results */}
            <div className="border border-border rounded-xl p-5 bg-card card-md">
              <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Knowledge Retrieval Benchmark v1.0 — 20 Test Cases
              </h2>
              <div className="space-y-2">
                {[
                  { name: "gbrain", score: 100, highlight: true },
                  { name: "LLM Baseline", score: 95 },
                  { name: "LlamaIndex", score: 95 },
                  { name: "Letta", score: 80 },
                  { name: "Cognee", score: 0 },
                  { name: "Graphiti", score: 0 },
                  { name: "Quivr", score: 0 },
                ].map((r) => (
                  <div key={r.name} className="flex items-center gap-3">
                    <span className="text-xs font-semibold w-24 shrink-0">
                      {r.name}
                      {r.highlight && <span className="text-[8px] text-verified-green ml-1">100%</span>}
                    </span>
                    <div className="flex-1 h-5 bg-secondary rounded-md overflow-hidden">
                      <div
                        className={`h-full rounded-md ${r.score >= 80 ? "bg-amber/50" : "bg-muted-foreground/20"}`}
                        style={{ width: `${Math.max(r.score, 2)}%` }}
                      />
                    </div>
                    <span className={`font-mono font-bold text-xs tabular-nums w-10 text-right ${r.score >= 80 ? "text-amber" : "text-muted-foreground"}`}>
                      {r.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">Why Tracks Make Us More Honest, Not Less Rigorous</h2>
              <p>
                Separating tracks doesn&apos;t lower the bar — it puts the bar in the right place.
                gbrain at 100% on Knowledge Retrieval and 0% on Conversational Memory tells a clear story:
                this system excels at document-based knowledge work but doesn&apos;t do chat memory.
                That&apos;s useful information for someone choosing a system.
              </p>
              <p className="mt-3">
                A single leaderboard mixing both would either unfairly penalize knowledge brains or
                unfairly reward chat systems that can&apos;t handle documents. Neither serves the people
                trying to pick the right tool.
              </p>
              <p className="mt-3">
                Cognee, Graphiti, and Quivr score 0% today — but their adapters are early. We expect
                these scores to change as implementations mature. The benchmark is ready. The systems
                need to catch up.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">Explore the Methodology</h2>
              <p>
                Full details on how we designed the Knowledge Retrieval benchmark, scoring criteria,
                and track assignment rules are on our methodology page:
              </p>
              <div className="mt-3">
                <Link href="/methodology/categories" className="text-amber hover:underline font-medium">
                  Methodology: Categories and Tracks →
                </Link>
              </div>
            </section>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Link href="/leaderboard" className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors">
              View Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/methodology/categories" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors">
              Track Methodology
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
