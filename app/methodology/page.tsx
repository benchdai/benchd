import Link from "next/link";
import { ArrowRight, ShieldCheck, Brain, AlertTriangle } from "lucide-react";
import { CodeBlock } from "@/components/bench/code-block";
import { TableOfContents } from "./toc-client";

export const metadata = {
  title: "Methodology — Bench'd",
  description:
    "How Bench'd scores, verifies, and signs every benchmark run. Open methodology, deterministic where possible, LLM-judged where necessary.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Page header */}
      <div className="max-w-2xl mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber mb-2">
          Methodology
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          How Bench'd works
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          Every number on this site was produced by an open harness, scored by a
          locked protocol, and signed with a cryptographic receipt you can verify
          yourself. This page explains each layer in detail.
        </p>
      </div>

      {/* Layout: TOC + Content */}
      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12">
        <TableOfContents />

        <article className="min-w-0 max-w-3xl">
          {/* ── Section 1: Why These Benchmarks ────────────────────────── */}
          <section id="why-benchmarks" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Why These Benchmarks
            </h2>
            <div className="prose-body space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                AI memory systems make bold claims. Vendors publish recall
                numbers measured on their own test sets, using their own
                definitions of success, without independent verification.
                Customers cannot compare systems because every vendor defines
                accuracy differently.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Bench'd exists to fix that. We run every system against the same
                question set, under the same conditions, and publish the raw
                receipts. The harness is open source. The scoring protocol is
                frozen between versions. The results are signed.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                We measure three dimensions that matter in practice:{" "}
                <strong className="font-sans font-semibold text-foreground">recall</strong> (can
                the system retrieve the right information?),{" "}
                <strong className="font-sans font-semibold text-foreground">temporal reasoning</strong>{" "}
                (can it understand when things happened and how they changed?),
                and{" "}
                <strong className="font-sans font-semibold text-foreground">multi-hop reasoning</strong>{" "}
                (can it connect facts across separate conversations to answer
                complex questions?).
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                These are not synthetic benchmarks. Every question is derived
                from real conversational patterns observed in production memory
                workloads. If a system scores well here, it works well in
                practice. If it doesn't, it doesn't.
              </p>
            </div>
          </section>

          {/* ── Section 2: How We Score ─────────────────────────────────── */}
          <section id="how-we-score" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              How We Score
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Each benchmark run consists of a series of question-answer
                pairs. First, we ingest a set of conversations into the system
                under test. Then we query the system and compare its responses
                against known-correct answers.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Scoring happens at the individual question level. Each question
                is tagged with a{" "}
                <code className="font-mono text-[13px] text-amber bg-amber/10 px-1.5 py-0.5 rounded">
                  scoringMethod
                </code>{" "}
                that determines how correctness is evaluated:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                <div className="rounded-lg border border-border p-4 bg-card">
                  <p className="text-xs font-mono font-semibold text-verified-green mb-1">
                    exact
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Response must match the expected answer character-for-character
                    after normalization. Used for IDs, dates, and numeric values.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 bg-card">
                  <p className="text-xs font-mono font-semibold text-verified-green mb-1">
                    regex
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Response is tested against a regular expression pattern.
                    Allows flexible formatting while requiring specific content.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4 bg-card">
                  <p className="text-xs font-mono font-semibold text-amber mb-1">
                    llm
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    A locked LLM judge evaluates semantic correctness. Required
                    for open-ended synthesis and multi-hop questions.
                  </p>
                </div>
              </div>

              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Scores within each dimension are aggregated by taking the
                percentage of questions answered correctly. The overall score is
                a weighted average:{" "}
                <span className="font-mono text-[13px] text-foreground">
                  40% recall + 30% temporal + 30% reasoning
                </span>
                . These weights reflect how users actually depend on memory
                systems in production.
              </p>
            </div>
          </section>

          {/* ── Section 3: The Two-Score Model ──────────────────────────── */}
          <section id="two-score-model" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              The Two-Score Model
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Most benchmarks report a single number. We report two. This is
                deliberate, and it is the most important design decision in
                Bench'd.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Some questions have objectively correct answers that can be
                verified by a machine: an exact string, a regex pattern, a
                specific ID. Other questions require judgment: did the system
                correctly synthesize information from three different
                conversations? Did it capture the nuance of a temporal
                relationship? These require an LLM judge.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Mixing these into a single score creates a false sense of
                precision. A score of 84.7 that blends deterministic and
                LLM-judged results implies a level of stability that doesn't
                exist. The deterministic portion is rock-solid. The LLM-judged
                portion may shift slightly between judge versions.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                So we separate them. Always.
              </p>
            </div>

            {/* Visual comparison boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {/* Verified (Deterministic) */}
              <div className="rounded-lg border-2 border-amber/40 bg-amber/5 p-6">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-4 w-4 text-amber" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber">
                    Verified (Deterministic)
                  </span>
                </div>
                <p className="font-mono text-5xl font-bold text-amber mt-3 mb-5 tabular-nums">
                  87.3
                </p>
                <ul className="space-y-2.5 text-[13px]">
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Scoring &amp; verification:
                    </span>
                    <span className="text-foreground font-serif">
                      Mathematical truth
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Includes:
                    </span>
                    <span className="text-foreground font-serif">
                      Exact-match, regex, ID retrieval
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Consistency:
                    </span>
                    <span className="text-foreground font-serif">
                      Cryptographically deterministic
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      FAQ:
                    </span>
                    <span className="text-foreground font-serif">
                      Pure math. Does not change.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Nuance (LLM Judge) */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nuance (LLM Judge)
                  </span>
                </div>
                <p className="font-mono text-5xl font-bold text-muted-foreground mt-3 mb-5 tabular-nums">
                  81.2
                </p>
                <ul className="space-y-2.5 text-[13px]">
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Scoring &amp; verification:
                    </span>
                    <span className="text-foreground/70 font-serif">
                      LLM judge panel
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Includes:
                    </span>
                    <span className="text-foreground/70 font-serif">
                      Open-ended, synthesis, multi-hop
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      Consistency:
                    </span>
                    <span className="text-foreground/70 font-serif">
                      May shift with judge updates
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-muted-foreground font-sans shrink-0">
                      FAQ:
                    </span>
                    <span className="text-foreground/70 font-serif">
                      Contextual. May change.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <Link
                href="#judge-protocol"
                className="inline-flex items-center gap-1 text-sm text-amber hover:text-amber/80 transition-colors font-medium"
              >
                Why two scores matter &mdash; see Judge Protocol
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          {/* ── Section 3b: Bench'd Memory Index (BMI) ─────────────────── */}
          <section id="bmi" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Bench&apos;d Memory Index (BMI)
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                The BMI is the single headline number on every system profile.
                It combines accuracy and efficiency into one production-weighted
                score, because a memory system that gets every answer right but
                takes 10 seconds and burns 50,000 tokens per query is not
                production-ready.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                The formula is public, versioned, and openly defended.
              </p>
            </div>

            <div className="my-6 rounded-lg border border-border bg-card p-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                BMI Formula (v1.0)
              </h3>
              <div className="font-mono text-sm text-foreground bg-code-bg rounded-lg p-4">
                BMI = (0.70 &times; Accuracy) + (0.30 &times; Efficiency)
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-amber">Accuracy (70%)</span>
                  <p className="text-[13px] text-muted-foreground mt-1 font-serif">
                    The overall verified score across all benchmark dimensions
                    (recall, temporal reasoning, multi-hop reasoning).
                  </p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber">Efficiency (30%)</span>
                  <p className="text-[13px] text-muted-foreground mt-1 font-serif">
                    Normalized token efficiency: 100 minus the tokens-per-correct-answer
                    divided by 100, capped at 0. A system using 50 tokens per correct
                    answer scores 99.5 efficiency. A system using 10,000 scores 0.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground mt-4">
                The 70/30 weighting reflects that accuracy matters more than
                efficiency for most use cases, but efficiency cannot be ignored.
                Future BMI versions may adjust weights or add reliability
                dimensions. Version changes are recorded and historical scores
                are never rewritten.
              </p>
            </div>
          </section>

          {/* ── Section 3c: System Categories ────────────────────────── */}
          <section id="categories" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              System Categories
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Not all memory systems solve the same problem. Bench&apos;d organizes
                systems into five track types based on what they do. Each track has
                its own leaderboard, its own question set, and its own baseline.
              </p>
            </div>

            <div className="space-y-3 my-6">
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Conversational Memory
                </p>
                <p className="text-[13px] text-muted-foreground font-serif">
                  Systems that ingest chat turns and recall facts across sessions.
                  Examples: Mem0, LangChain Memory, LlamaIndex Memory.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Knowledge Brain
                </p>
                <p className="text-[13px] text-muted-foreground font-serif">
                  Systems that store documents, pages, or notes and retrieve them
                  via search. Examples: gbrain, Quivr, AnythingLLM, Obsidian Smart
                  Connections, RagFlow.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Agent Memory
                </p>
                <p className="text-[13px] text-muted-foreground font-serif">
                  Systems that help agents remember tasks, decisions, and actions.
                  Examples: Letta, AutoGPT, CrewAI, claude-mem, Phantom.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Graph/RAG
                </p>
                <p className="text-[13px] text-muted-foreground font-serif">
                  Systems that build knowledge graphs or retrieval-augmented
                  generation pipelines. Examples: Graphiti, Cognee, Microsoft
                  GraphRAG, Chroma, Qdrant.
                </p>
              </div>
              <div className="rounded-lg border border-border p-4 bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Hybrid
                </p>
                <p className="text-[13px] text-muted-foreground font-serif">
                  Systems that span multiple categories. Examples: Zep (conversation
                  + entity graphs).
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-amber/20 bg-amber/[0.03] p-4 space-y-3 mt-6">
              <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                <strong className="font-sans font-semibold text-foreground">
                  Why categories matter:
                </strong>{" "}
                Systems are only benchmarked against others in their category. A
                Knowledge Brain is not ranked against Conversational Memory systems
                because they solve different problems.
              </p>
              <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                <strong className="font-sans font-semibold text-foreground">
                  LLM Baseline:
                </strong>{" "}
                Every track includes the LLM Baseline (GPT-4o-mini with no memory
                system) as the reference point. A memory system that scores below
                the baseline is actively losing information.
              </p>
            </div>
          </section>

          {/* ── Section 4: Judge Protocol ───────────────────────────────── */}
          <section id="judge-protocol" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Judge Protocol
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                The judge protocol is designed around one principle:{" "}
                <strong className="font-sans font-semibold text-foreground">
                  deterministic where possible, locked where not
                </strong>
                .
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                For questions that have a single correct answer (an ID, a date,
                a number), we use deterministic scoring. No LLM is involved.
                The harness compares the response against the expected answer
                using exact-match or regex. This is fast, free, and perfectly
                reproducible.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                For questions that require semantic judgment, we use a locked
                LLM judge. The judge configuration is frozen for the duration of
                a benchmark version:
              </p>

              <CodeBlock
                code={`// JudgeProtocol — frozen per benchmark version
{
  "model": "claude-sonnet-4-20250514",
  "temperature": 0.0,
  "promptVersion": "v2.4.1"
}`}
                language="json"
                title="judge-protocol.json"
              />

              <div className="space-y-3 mt-6">
                <div className="flex gap-3 items-start">
                  <div className="mt-1 h-5 w-5 rounded-full bg-verified-green/20 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-verified-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Frozen temperature
                    </p>
                    <p className="text-[13px] text-muted-foreground font-serif">
                      The judge always runs at temperature 0.0. This minimizes
                      stochastic variation between runs. In practice, we observe
                      less than 0.3% variation on repeated evaluations.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-1 h-5 w-5 rounded-full bg-verified-green/20 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-verified-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Locked model version
                    </p>
                    <p className="text-[13px] text-muted-foreground font-serif">
                      We pin to a specific model snapshot (e.g.,{" "}
                      <code className="font-mono text-xs text-amber">
                        claude-sonnet-4-20250514
                      </code>
                      ). When the model provider releases a new version, we do
                      not silently switch. We create a new benchmark version.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="mt-1 h-5 w-5 rounded-full bg-verified-green/20 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-verified-green" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Version-bumping policy
                    </p>
                    <p className="text-[13px] text-muted-foreground font-serif">
                      Any change to the judge model, prompt, or scoring logic
                      triggers a new benchmark version. All systems are re-run
                      on the new version to maintain comparability. Historical
                      results under previous versions are preserved and clearly
                      labeled.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 5: Versioning Policy ────────────────────────────── */}
          <section id="versioning" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Versioning Policy
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Bench'd uses semantic versioning for benchmarks. The version
                number is embedded in every signed receipt, making it impossible
                to compare results from different versions without being
                explicit about it.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                A <strong className="font-sans font-semibold text-foreground">patch version</strong>{" "}
                bump (e.g., 2.4.0 to 2.4.1) means bug fixes to the harness
                that do not affect scoring. A{" "}
                <strong className="font-sans font-semibold text-foreground">minor version</strong>{" "}
                bump means new questions were added or the judge prompt was
                revised. A{" "}
                <strong className="font-sans font-semibold text-foreground">major version</strong>{" "}
                bump means the scoring model changed, dimensions were added or
                removed, or weights were adjusted.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                When a minor or major version bump occurs, we re-run all
                actively maintained systems against the new version within 72
                hours. Leaderboard rankings always reflect the latest version.
                Historical runs are archived and remain verifiable.
              </p>

              <CodeBlock
                code={`// Version history (excerpt)
v2.4.1  2026-04-15  Prompt clarification for temporal boundary questions
v2.4.0  2026-03-01  Added 12 multi-hop reasoning questions
v2.3.0  2026-01-20  Judge model updated to claude-sonnet-4-20250514
v2.0.0  2025-11-01  Added temporal dimension, reweighted overall score
v1.0.0  2025-08-15  Initial release: recall + reasoning only`}
                language="plaintext"
                title="CHANGELOG"
              />
            </div>
          </section>

          {/* ── Section 6: How Signing Works ─────────────────────────────── */}
          <section id="signing" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              How Signing Works
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                Every completed benchmark run produces a signed receipt. The
                receipt contains the full run manifest &mdash; system identity,
                benchmark version, harness version, judge configuration, all
                scores, and timing data &mdash; hashed into a Merkle tree.
              </p>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                The signing process works as follows:
              </p>
              <ol className="space-y-3 ml-1">
                <li className="flex gap-3 text-[13px]">
                  <span className="font-mono text-amber font-bold shrink-0">1.</span>
                  <span className="text-foreground/85 font-serif">
                    Each question-answer pair is hashed individually (SHA-256).
                    These form the leaves of the Merkle tree.
                  </span>
                </li>
                <li className="flex gap-3 text-[13px]">
                  <span className="font-mono text-amber font-bold shrink-0">2.</span>
                  <span className="text-foreground/85 font-serif">
                    The leaves are combined pairwise until a single root hash
                    remains. This is the{" "}
                    <code className="font-mono text-xs text-amber bg-amber/10 px-1 py-0.5 rounded">
                      merkleRoot
                    </code>
                    .
                  </span>
                </li>
                <li className="flex gap-3 text-[13px]">
                  <span className="font-mono text-amber font-bold shrink-0">3.</span>
                  <span className="text-foreground/85 font-serif">
                    The manifest (including the Merkle root) is signed with
                    Bench'd's Ed25519 signing key.
                  </span>
                </li>
                <li className="flex gap-3 text-[13px]">
                  <span className="font-mono text-amber font-bold shrink-0">4.</span>
                  <span className="text-foreground/85 font-serif">
                    The signature and public key fingerprint are embedded in the
                    receipt. Anyone can verify the signature using the published
                    public key.
                  </span>
                </li>
              </ol>
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mt-4">
                If any single answer in the run is modified &mdash; even by one
                character &mdash; the Merkle root changes and the signature
                becomes invalid. This makes tampering with individual results
                cryptographically detectable.
              </p>
            </div>
          </section>

          {/* ── Section 7: Verify a Receipt Yourself ─────────────────────── */}
          <section id="verify-receipt" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Verify a Receipt Yourself
            </h2>
            <div className="space-y-4">
              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                You don't need to trust us. Every receipt can be independently
                verified. Download the signed receipt JSON from any run page,
                then verify it locally:
              </p>

              <CodeBlock
                code={`# Download a receipt
curl -sL https://benchd.dev/api/receipt/run_abc123.json -o receipt.json

# Verify the signature (requires the benchd public key)
benchd verify receipt.json

# Or verify manually with openssl
cat receipt.json | jq -r '.manifest' | \\
  openssl dgst -sha256 -verify benchd-public.pem -signature <(
    cat receipt.json | jq -r '.signature' | base64 -d
  )`}
                language="bash"
                title="verify-receipt.sh"
              />

              <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                The verification checks two things: that the Merkle root
                matches the individual question hashes (data integrity), and
                that the signature is valid for Bench'd's published public key
                (authenticity).
              </p>

              <div className="rounded-lg border border-border bg-card p-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  For the full verification walkthrough, including Merkle proof
                  validation and key rotation history, see the{" "}
                  <Link
                    href="/trust"
                    className="text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
                  >
                    Trust &amp; Verification
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </section>

          {/* ── Section 8: Known Controversies ───────────────────────────── */}
          <section id="controversies" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Known Controversies
            </h2>
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-6">
              We document cases where Bench'd scores diverge significantly from
              vendor-reported metrics. These are not accusations &mdash; they
              are explanations of methodological differences that produce
              different numbers.
            </p>

            {/* MemPalace entry */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <h3 className="text-sm font-semibold text-foreground">
                    MemPalace: Metric Mismatch
                  </h3>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-destructive/20 text-red-400 border border-destructive/30">
                  High Impact
                </span>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    What was claimed
                  </p>
                  <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                    MemPalace published a blog post claiming "state-of-the-art
                    Retrieval Recall of 98.6%" on their internal benchmark.
                    This number was widely cited in social media and investor
                    materials as evidence of superior accuracy.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    What actually happened
                  </p>
                  <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                    MemPalace's 98.6% measures{" "}
                    <em>retrieval recall</em> &mdash; whether the system
                    retrieves the correct chunk from its vector store. Bench'd
                    measures <em>end-to-end QA accuracy</em> &mdash; whether
                    the system actually answers the question correctly given the
                    retrieved context. These are fundamentally different metrics.
                  </p>
                  <p className="font-serif text-[14px] leading-relaxed text-foreground/85 mt-2">
                    A system can retrieve the right chunk 98.6% of the time and
                    still fail to answer correctly because it misinterprets the
                    context, conflates entities, or truncates relevant detail.
                    On Bench'd's end-to-end measure, MemPalace scored{" "}
                    <span className="font-mono text-amber font-semibold">
                      72.4
                    </span>{" "}
                    verified.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Why it matters
                  </p>
                  <p className="font-serif text-[14px] leading-relaxed text-foreground/85">
                    Retrieval recall is a component metric, not an outcome
                    metric. Users care about whether the system gives them the
                    right answer, not whether it found the right paragraph
                    internally. Reporting component metrics as if they were
                    outcome metrics inflates perceived performance and misleads
                    buyers. This is the most common pattern we see in vendor
                    benchmarks across the industry.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Sources
                  </p>
                  <ul className="space-y-1 text-[13px] text-muted-foreground">
                    <li className="font-serif">
                      MemPalace blog, "Setting the Standard for Memory Recall",
                      March 2026
                    </li>
                    <li className="font-serif">
                      Bench'd run receipt:{" "}
                      <code className="font-mono text-xs text-amber">
                        run_mp_20260402
                      </code>
                    </li>
                    <li className="font-serif">
                      Discussion thread on the Bench'd GitHub repository (#247)
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 9: FAQ ───────────────────────────────────────────── */}
          <section id="faq" className="scroll-mt-24 mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <FaqItem question="Can vendors run the benchmark themselves?">
                Yes. The harness is open source. Vendors can run it locally and
                submit results, but self-reported runs are tagged as{" "}
                <code className="font-mono text-xs text-amber bg-amber/10 px-1 py-0.5 rounded">
                  unclaimed-self-reported
                </code>{" "}
                and carry a lower trust tier. For results to appear as
                vendor-verified, the vendor must connect their production
                endpoint and allow Bench'd to run the harness directly against
                it.
              </FaqItem>

              <FaqItem question="How often are systems re-benchmarked?">
                Actively maintained systems are re-run whenever a new benchmark
                version is released (typically every 4-8 weeks) and whenever a
                vendor ships a significant update to their system. Vendors can
                request a re-run at any time by opening a pull request against
                the harness repository.
              </FaqItem>

              <FaqItem question="Why might the nuance score change between runs?">
                The nuance score uses an LLM judge, which is inherently
                non-deterministic. Even with temperature 0.0, model providers
                may update their infrastructure in ways that cause subtle
                output shifts. We mitigate this by pinning model versions and
                re-running all systems when the judge changes, but small
                variations (typically less than 0.5%) are expected. This is why
                we separate it from the verified score.
              </FaqItem>

              <FaqItem question="What happens if I find a bug in the benchmark?">
                Open an issue on GitHub. If the bug affects scoring, we will
                issue a patch version bump, re-run affected systems, and
                publish a postmortem. Every correction is documented in the
                version history and linked from the affected receipts.
              </FaqItem>

              <FaqItem question="Do you accept sponsorship from vendors?">
                No. Bench'd is funded independently. We do not accept payment
                from any vendor whose system appears on the leaderboard. Our
                funding sources are disclosed on the About page. If this ever
                changes, it will be announced publicly before any sponsored
                content appears.
              </FaqItem>
            </div>
          </section>

          {/* Bottom divider */}
          <div className="border-t border-border pt-8 mt-8">
            <p className="text-xs text-muted-foreground">
              Last updated: May 2026. This document is versioned alongside the
              benchmark.{" "}
              <a
                href="https://github.com/benchd/methodology"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
              >
                View revision history on GitHub
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  children,
}: {
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border pb-5 last:border-0">
      <h3 className="text-sm font-semibold text-foreground mb-2">
        {question}
      </h3>
      <p className="font-serif text-[14px] leading-relaxed text-foreground/80">
        {children}
      </p>
    </div>
  );
}
