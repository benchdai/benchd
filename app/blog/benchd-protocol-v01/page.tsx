import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText, Scale, Lock, Layers, Calculator, GitBranch } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bench'd Evaluation Protocol v0.1: How We Make Memory Benchmarks Fair",
  description:
    "Why we wrote a formal protocol, the adapter contract, model locking, trust tiers, the BMI formula, and versioning rules. Never rewrite history.",
  openGraph: {
    title: "Bench'd Evaluation Protocol v0.1: How We Make Memory Benchmarks Fair",
    description: "A formal protocol for fair, reproducible AI memory benchmarks.",
    type: "article",
    publishedTime: "2026-05-14T00:00:00Z",
  },
};

export default function BlogPost() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bench'd Evaluation Protocol v0.1: How We Make Memory Benchmarks Fair",
    datePublished: "2026-05-14T00:00:00Z",
    author: { "@type": "Organization", name: "Bench'd", url: "https://benchd.ai" },
    mainEntityOfPage: "https://benchd.ai/blog/benchd-protocol-v01",
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
            <time className="text-[11px] font-mono text-muted-foreground">2026-05-14</time>
            <span className="text-[11px] text-muted-foreground">9 min read</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            Bench&apos;d Evaluation Protocol v0.1: How We Make Memory Benchmarks Fair
          </h1>

          <p className="text-base text-muted-foreground mt-4 leading-relaxed">
            Memory benchmarks are only useful if they&apos;re reproducible, comparable, and resistant
            to gaming. We wrote a formal evaluation protocol so every system is tested the same way.
            Here&apos;s what&apos;s in it and why each rule exists.
          </p>

          <div className="mt-10 space-y-8 text-sm text-foreground leading-relaxed">
            {/* Why a protocol */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber" /> Why We Wrote a Formal Protocol
              </h2>
              <p>
                After publishing our first round of results, we saw two problems emerge immediately.
                First, vendors started asking &ldquo;can we tune our system before you test it?&rdquo; &mdash;
                effectively requesting the right to game the benchmark. Second, other evaluation projects
                were publishing numbers that couldn&apos;t be compared to ours because they used different
                models, different prompts, and different scoring rubrics.
              </p>
              <p className="mt-3">
                A benchmark without a protocol is just vibes. If two teams test the same system and get
                different numbers, neither result is useful. The protocol exists to make Bench&apos;d results
                <strong> deterministic</strong>, <strong>comparable</strong>, and <strong>auditable</strong>.
              </p>
            </section>

            {/* Adapter contract */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber" /> The Adapter Contract: reset / ingest / recall
              </h2>
              <p>
                Every memory system must implement exactly three operations through a thin adapter layer:
              </p>
              <div className="mt-4 space-y-3">
                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold font-mono mb-1">reset()</h3>
                  <p className="text-xs text-muted-foreground">
                    Wipe all stored memory. Called before each test run to ensure a clean slate.
                    The system must return to a state indistinguishable from a fresh install.
                  </p>
                </div>
                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold font-mono mb-1">ingest(conversations)</h3>
                  <p className="text-xs text-muted-foreground">
                    Feed the system a list of conversation transcripts. This is the &ldquo;memory formation&rdquo;
                    phase. The system can index, summarize, embed, or graph the data however it likes &mdash;
                    as long as it does so through its normal pipeline, not a test-specific shortcut.
                  </p>
                </div>
                <div className="border border-border rounded-lg p-4 bg-card">
                  <h3 className="text-sm font-semibold font-mono mb-1">recall(question) &rarr; answer</h3>
                  <p className="text-xs text-muted-foreground">
                    Given a question, retrieve relevant memories and produce an answer. The system
                    must use its own retrieval pipeline. The only thing Bench&apos;d controls is
                    the answerer LLM (see Model Locking below).
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                This three-function contract keeps the benchmark surface small. We don&apos;t care how
                your system stores data internally &mdash; we only care what goes in and what comes out.
              </p>
            </section>

            {/* Model locking */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber" /> Model Locking: Same Answerer, Same Judge
              </h2>
              <p>
                The single biggest confounder in LLM benchmarks is the model itself. A system
                using GPT-4o will beat one using GPT-3.5-turbo regardless of its memory architecture.
                To eliminate this variable, we lock two models across all runs:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <strong className="text-foreground">Answerer model</strong> &mdash; the LLM that generates
                  the final answer from retrieved memories. Currently <code className="text-xs bg-code-bg px-1 rounded">gpt-4o-mini-2024-07-18</code>.
                </li>
                <li>
                  <strong className="text-foreground">Judge model</strong> &mdash; the LLM that scores
                  open-ended (nuance) answers. Currently <code className="text-xs bg-code-bg px-1 rounded">gpt-4o-2024-08-06</code>.
                </li>
              </ul>
              <p className="mt-3">
                When we upgrade models, we re-run every system on the new model before publishing
                any results. No system ever gets an unfair advantage from a better answerer.
              </p>
            </section>

            {/* Trust tiers */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber" /> Trust Tiers: Who Ran the Test?
              </h2>
              <p>
                Not all results carry the same weight. Our trust tier system makes the provenance
                of every score visible:
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs border border-border rounded-lg">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-3 py-2 text-left font-semibold">Tier</th>
                      <th className="px-3 py-2 text-left font-semibold">Who runs it</th>
                      <th className="px-3 py-2 text-left font-semibold">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border">
                      <td className="px-3 py-2 font-medium text-foreground">Partner-Audited</td>
                      <td className="px-3 py-2">Bench&apos;d team + vendor</td>
                      <td className="px-3 py-2">Full audit trail, co-signed results</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-3 py-2 font-medium text-foreground">Vendor-Verified</td>
                      <td className="px-3 py-2">Vendor, with Bench&apos;d adapter</td>
                      <td className="px-3 py-2">Bench&apos;d reviews adapter + spot-checks</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-3 py-2 font-medium text-foreground">Community-Verified</td>
                      <td className="px-3 py-2">Community contributor</td>
                      <td className="px-3 py-2">Adapter reviewed, results reproducible</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="px-3 py-2 font-medium text-foreground">Unclaimed Self-Reported</td>
                      <td className="px-3 py-2">Unknown / vendor claim</td>
                      <td className="px-3 py-2">Not verified &mdash; shown with warning</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium text-foreground">Listed</td>
                      <td className="px-3 py-2">Nobody yet</td>
                      <td className="px-3 py-2">Awaiting adapter submission</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                Self-reported scores are hidden by default on the leaderboard. We show them only
                when a user explicitly opts in, and they render in red to signal lower confidence.
              </p>
            </section>

            {/* BMI formula */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-amber" /> The BMI Formula
              </h2>
              <p>
                The Bench&apos;d Memory Index (BMI) is the single overall score displayed on the leaderboard.
                It&apos;s a weighted composite of our dimension scores:
              </p>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto mt-3">
                <code>{`BMI = 0.35 * recall_verified
    + 0.25 * temporal_verified
    + 0.25 * reasoning_verified
    + 0.15 * reliability_verified`}</code>
              </pre>
              <p className="mt-3">
                Recall gets the highest weight because it&apos;s the most fundamental capability &mdash;
                if a memory system can&apos;t retrieve facts, nothing else matters. Reliability gets
                a lower weight for now because the benchmark is newer, but we expect to increase
                it as the trap set matures.
              </p>
              <p className="mt-3">
                The nuance score (LLM-judged open-ended quality) is tracked separately and not
                included in the BMI. It&apos;s shown in detailed view for users who want richer signal.
              </p>
            </section>

            {/* Versioning */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-amber" /> Versioning Rules: Never Rewrite History
              </h2>
              <p>
                Once a score is published under a protocol version, it is immutable. We never go
                back and change historical results. If we improve the benchmark methodology, we
                bump the protocol version and re-run everything:
              </p>
              <ul className="mt-3 space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <strong className="text-foreground">Patch</strong> (v0.1 &rarr; v0.1.1) &mdash; bug fixes
                  in scoring code, no question changes. Old scores remain valid.
                </li>
                <li>
                  <strong className="text-foreground">Minor</strong> (v0.1 &rarr; v0.2) &mdash; new questions
                  added, weights adjusted. All systems re-run before publishing.
                </li>
                <li>
                  <strong className="text-foreground">Major</strong> (v0 &rarr; v1) &mdash; fundamental
                  methodology change. Previous version scores archived, not deleted.
                </li>
              </ul>
              <p className="mt-3">
                Every result on the leaderboard is tagged with its protocol version. You can always
                see which version produced which score.
              </p>
            </section>

            {/* CTA */}
            <section>
              <h2 className="font-serif text-xl font-semibold mb-3">Read the Full Protocol</h2>
              <p>
                The complete Bench&apos;d Evaluation Protocol v0.1 is published on GitHub. It includes
                the exact prompt templates, scoring rubrics, question bank versioning rules, and
                adapter interface specification.
              </p>
              <p className="mt-3">
                <a
                  href="https://github.com/benchd-ai/protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber hover:underline font-medium"
                >
                  github.com/benchd-ai/protocol
                </a>
              </p>
              <p className="mt-3">
                If you&apos;re building a memory system and want to be listed on Bench&apos;d, start
                by implementing the three-function adapter. We&apos;ll handle the rest.
              </p>
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
