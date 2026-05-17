import Link from "next/link";
import { ArrowRight, Terminal, Code, Upload, Shield, Zap, GitBranch, Package } from "lucide-react";
import { NewsletterSignup } from "@/components/bench/newsletter-signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs — Run Benchmarks, Write Adapters, Submit Results",
  description:
    "How to benchmark your AI memory system with Bench'd. Install the harness, run LongMemEval or LOCOMO, and submit cryptographically signed results.",
  keywords: [
    "benchd documentation",
    "ai memory benchmark how to",
    "benchmark your memory system",
    "MCP memory benchmark",
    "memory system adapter",
  ],
  alternates: { canonical: "https://benchd.ai/docs" },
};

export default function DocsPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2.5 mb-4">
          <Terminal className="h-5 w-5 text-amber" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Documentation</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-10 max-w-xl leading-relaxed">
          Benchmark your AI memory system in minutes. The harness is open source,
          the methodology is public, and every result is cryptographically signed.
        </p>

        {/* Quick Start */}
        <section id="quick-start" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber" />
            Quick Start
          </h2>

          <div className="space-y-4">
            <div className="border border-border rounded-xl p-5 bg-card card-sm">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                Install the harness
              </h3>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto">
                <code>{`pip install benchd-harness

# Or from source:
git clone https://github.com/benchdai/harness.git
cd harness && pip install -e .`}</code>
              </pre>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card card-sm">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                Generate signing keys
              </h3>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto">
                <code>{`benchd keys generate --out ./keys

# Creates:
#   keys/private.key  (keep secret)
#   keys/public.key   (share freely)`}</code>
              </pre>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card card-sm">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                Run a benchmark
              </h3>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto">
                <code>{`# Set your LLM API key (for the judge)
export OPENROUTER_API_KEY=sk-or-...

# Run LongMemEval against your system
benchd run \\
  -a mcp \\
  -b longmemeval-v1 \\
  --judge \\
  --key ./keys/private.key \\
  --adapter-config '{"endpoint": "http://localhost:3000/mcp"}'

# Results saved to: ./runs/run_xxx/manifest.signed.json`}</code>
              </pre>
            </div>

            <div className="border border-border rounded-xl p-5 bg-card card-sm">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber text-primary-foreground text-xs font-bold flex items-center justify-center">4</span>
                Submit your results
              </h3>
              <pre className="bg-code-bg rounded-lg p-4 text-xs font-mono overflow-x-auto">
                <code>{`benchd submit ./runs/run_xxx/manifest.signed.json

# Or upload at: https://benchd.ai/submit`}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* MCP — Zero Code */}
        <section id="mcp" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber" />
            MCP Systems: Zero-Code Testing
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            If your memory system exposes an MCP server, you don&apos;t need to write any adapter code.
            The generic MCP adapter auto-discovers your tools and maps them to Bench&apos;d&apos;s
            ingest/recall/reset interface.
          </p>

          <div className="border border-amber/20 rounded-xl p-5 bg-amber/[0.03]">
            <h3 className="text-sm font-semibold mb-2">Requirements</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">&#x2022;</span>
                <span>Your MCP server must expose at least an <strong>ingest</strong> tool and a <strong>query</strong> tool</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">&#x2022;</span>
                <span>Tool names are auto-detected (e.g., <code className="bg-code-bg px-1 rounded text-[11px]">memory_ingest</code>, <code className="bg-code-bg px-1 rounded text-[11px]">memory_query</code>)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">&#x2022;</span>
                <span>Override tool names with <code className="bg-code-bg px-1 rounded text-[11px]">ingest_tool</code> and <code className="bg-code-bg px-1 rounded text-[11px]">query_tool</code> in adapter config</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber mt-0.5">&#x2022;</span>
                <span>A <strong>reset</strong> tool is optional but recommended for clean benchmark runs</span>
              </li>
            </ul>

            <pre className="bg-code-bg-deep rounded-lg p-4 text-xs font-mono overflow-x-auto mt-4">
              <code>{`# Auto-discover tools
benchd run -a mcp -b longmemeval-v1 --judge \\
  --adapter-config '{"endpoint": "http://localhost:3000/mcp"}'

# Explicit tool names
benchd run -a mcp -b longmemeval-v1 --judge \\
  --adapter-config '{
    "endpoint": "http://localhost:3000/mcp",
    "ingest_tool": "memory_ingest",
    "query_tool": "memory_query",
    "reset_tool": "memory_delete"
  }'`}</code>
            </pre>
          </div>
        </section>

        {/* Writing a Custom Adapter */}
        <section id="custom-adapter" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-amber" />
            Writing a Custom Adapter
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            If your system doesn&apos;t support MCP, write a Python adapter. It&apos;s ~50 lines:
          </p>

          <pre className="bg-code-bg rounded-xl p-5 text-xs font-mono overflow-x-auto border border-border">
            <code>{`from benchd_harness.adapters.base import BaseAdapter
from typing import Any, Dict, List, Optional


class MyMemoryAdapter(BaseAdapter):
    """Adapter for My Memory System."""

    @property
    def name(self) -> str:
        return "my-memory-system"

    @property
    def version(self) -> Optional[str]:
        return "1.0.0"

    def setup(self) -> None:
        """Initialize your memory system client."""
        self.client = MyMemoryClient()

    def reset(self) -> None:
        """Clear memory between benchmark questions."""
        self.client.clear()

    def teardown(self) -> None:
        """Clean up resources."""
        self.client.close()

    def ingest(self, turns: List[Dict[str, Any]]) -> None:
        """
        Feed conversation turns into your memory system.

        Each turn has: role, content, timestamp (optional)
        """
        for turn in turns:
            self.client.add_message(
                role=turn["role"],
                content=turn["content"],
            )

    def recall(self, query: str) -> str:
        """
        Query your memory system and return a plain string.
        """
        results = self.client.search(query)
        return results.text`}</code>
          </pre>

          <p className="text-xs text-muted-foreground mt-3">
            Register your adapter in <code className="bg-code-bg px-1 rounded text-[11px]">benchd_harness/adapters/__init__.py</code>{" "}
            and run with <code className="bg-code-bg px-1 rounded text-[11px]">benchd run -a my-memory-system</code>.
          </p>
        </section>

        {/* System Categories */}
        <section id="categories" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-amber" />
            System Categories
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Systems are grouped by what they do. Each category has its own leaderboard and question set.
          </p>
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">Category</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">What it tests</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-foreground">Example Systems</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">Conversational Memory</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Chat recall across sessions</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Mem0, LangChain, LlamaIndex</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">Knowledge Brain</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Document storage + retrieval</td>
                  <td className="px-4 py-2.5 text-muted-foreground">gbrain, Quivr, AnythingLLM</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">Agent Memory</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Task/action persistence</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Letta, AutoGPT, claude-mem</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">Graph/RAG</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Entity graphs + retrieval</td>
                  <td className="px-4 py-2.5 text-muted-foreground">Graphiti, Cognee, GraphRAG</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Available Benchmarks */}
        <section id="benchmarks" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-amber" />
            Available Benchmarks
          </h2>

          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4 bg-card flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">longmemeval-v1</h3>
                <p className="text-xs text-muted-foreground mt-0.5">500 questions &middot; Recall, temporal reasoning, knowledge updates</p>
              </div>
              <pre className="bg-code-bg px-2 py-1 rounded text-[10px] font-mono">-b longmemeval-v1</pre>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">locomo-v1</h3>
                <p className="text-xs text-muted-foreground mt-0.5">1,540 questions &middot; Multi-session conversational memory</p>
              </div>
              <pre className="bg-code-bg px-2 py-1 rounded text-[10px] font-mono">-b locomo-v1</pre>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold">smoke-memory-v0</h3>
                <p className="text-xs text-muted-foreground mt-0.5">10 questions &middot; Quick sanity check</p>
              </div>
              <pre className="bg-code-bg px-2 py-1 rounded text-[10px] font-mono">-b smoke-memory-v0</pre>
            </div>
          </div>
        </section>

        {/* Submission */}
        <section id="submit" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber" />
            Submitting Results
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            After running a benchmark, submit your signed manifest to appear on the Bench&apos;d leaderboard.
            All submissions are verified before publishing.
          </p>

          <div className="space-y-3">
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-semibold mb-1">Via CLI</h3>
              <pre className="bg-code-bg rounded-lg p-3 text-xs font-mono">
                <code>benchd submit ./runs/run_xxx/manifest.signed.json</code>
              </pre>
            </div>
            <div className="border border-border rounded-lg p-4 bg-card">
              <h3 className="text-sm font-semibold mb-1">Via Web</h3>
              <p className="text-xs text-muted-foreground">
                Upload your <code className="bg-code-bg px-1 rounded text-[11px]">manifest.signed.json</code> at{" "}
                <Link href="/submit" className="text-amber hover:text-amber/80">benchd.ai/submit</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Trust Tiers */}
        <section id="trust" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber" />
            Trust Tiers
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Results on the leaderboard are categorized by how they were verified:
          </p>
          <div className="space-y-2">
            {[
              { tier: "Community-Verified", desc: "Run by Bench'd with our signing key. Highest trust.", color: "text-tier-community" },
              { tier: "Vendor-Verified", desc: "Run by the vendor using our harness. Co-signed with vendor's key.", color: "text-tier-vendor" },
              { tier: "Self-Reported", desc: "Vendor claims, not independently verified. Flagged on leaderboard.", color: "text-tier-self-reported" },
              { tier: "Listed", desc: "System indexed but not yet benchmarked.", color: "text-tier-listed" },
            ].map((t) => (
              <div key={t.tier} className="border border-border rounded-lg p-3 bg-card flex items-start gap-3">
                <span className={`text-xs font-semibold ${t.color} whitespace-nowrap`}>{t.tier}</span>
                <span className="text-xs text-muted-foreground">{t.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How Bench'd Uses VerifiedState + ProofMeter */}
        <section id="how-we-use-it" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber" />
            How Bench&apos;d Uses VerifiedState &amp; ProofMeter
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Bench&apos;d is a real-world example of how VerifiedState memory verification
            and ProofMeter spend attestation work together in production. Here&apos;s
            exactly how we use them.
          </p>

          <div className="space-y-4">
            {/* VerifiedState use case */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="text-sm font-semibold mb-2">VerifiedState — Memory verification for benchmark results</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Every benchmark score on Bench&apos;d is a claim: &ldquo;System X scored 80% on Knowledge Retrieval.&rdquo;
                That claim needs to be independently verifiable. We use VerifiedState to:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Ingest benchmark manifests</strong> into verified memory so the full trace of every run is queryable and auditable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Run verification ladders</strong> on score claims — checking that the manifest hash matches, the signature is valid, and the traces support the reported score</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Generate signed receipts</strong> for each verified score, creating an audit trail from raw question to published leaderboard number</span>
                </li>
              </ul>
              <pre className="bg-code-bg rounded-lg p-3 text-[11px] font-mono mt-3 overflow-x-auto">
                <code>{`# VerifiedState is also benchmarked AS a memory system:
benchd run -a verifiedstate -b knowledge-retrieval-v0
# This tests VS's own memory_ingest + memory_query capabilities`}</code>
              </pre>
            </div>

            {/* ProofMeter use case */}
            <div className="border border-border rounded-xl p-5 bg-card">
              <h3 className="text-sm font-semibold mb-2">ProofMeter — Spend tracking for benchmark runs</h3>
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                Running benchmarks costs real money — LLM judge calls, embedding API calls, model inference.
                ProofMeter tracks every dollar so benchmark costs are transparent and verifiable:
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Budget authorization</strong> — before a run starts, a signed budget cap is set (e.g., $5.00 max)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Per-call receipts</strong> — every LLM judge call records provider, model, tokens, and cost as a signed receipt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Budget enforcement</strong> — if spend exceeds the budget, the run pauses automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 shrink-0">-</span>
                  <span><strong className="text-foreground">Settlement</strong> — after the run, all receipts are Merkle-rooted into a settlement attached to the manifest</span>
                </li>
              </ul>
              <pre className="bg-code-bg rounded-lg p-3 text-[11px] font-mono mt-3 overflow-x-auto">
                <code>{`# Run reliability benchmark with $5 budget and spend tracking:
benchd run -a graphiti -b reliability-v1 --budget 5.00

# Manifest includes proofmeter section:
# {
#   "proofmeter": {
#     "total_spend_usd": "3.81",
#     "receipt_count": 294,
#     "by_model": {
#       "openai/gpt-4o-mini": { "calls": 294, "cost_usd": "3.81" }
#     },
#     "settlement_merkle_root": "sha256:...",
#     "settlement_status": "settled"
#   }
# }`}</code>
              </pre>
            </div>

            {/* Why this matters */}
            <div className="border border-amber/20 rounded-xl p-5 bg-amber/5">
              <h3 className="text-sm font-semibold mb-2">Why this matters for AI agents and developers</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When an AI agent runs a benchmark, deploys a workflow, or calls an API on your behalf,
                you need answers to three questions: <em>What happened?</em> (VerifiedState memory),{" "}
                <em>What did it cost?</em> (ProofMeter receipts), and <em>Can I verify this without trusting the runner?</em>{" "}
                (cryptographic signatures). Bench&apos;d is the first production system that answers all three.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/methodology/receipt-spec" className="text-[11px] text-amber hover:underline">
                  ProofMeter Spec &rarr;
                </Link>
                <Link href="/methodology/trust-tiers" className="text-[11px] text-amber hover:underline">
                  Trust Tiers &rarr;
                </Link>
                <Link href="/methodology" className="text-[11px] text-amber hover:underline">
                  Full Methodology &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* GitHub Action */}
        <section id="ci" className="mb-12">
          <h2 className="font-serif text-2xl font-semibold mb-4 flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-amber" />
            CI Integration (GitHub Action)
          </h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Run Bench&apos;d on every PR to catch memory regressions before they ship.
          </p>

          <pre className="bg-code-bg rounded-xl p-5 text-xs font-mono overflow-x-auto border border-border">
            <code>{`# .github/workflows/benchd.yml
name: Bench'd Memory Benchmark
on: [pull_request]

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start your memory server
        run: docker-compose up -d memory-server

      - name: Run Bench'd
        uses: benchdai/benchmark-action@v1
        with:
          adapter: mcp
          benchmark: smoke-memory-v0
          endpoint: http://localhost:3000/mcp
          openrouter-key: \${{ secrets.OPENROUTER_API_KEY }}

      - name: Upload results
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        run: benchd submit ./runs/*/manifest.signed.json`}</code>
          </pre>
          <p className="text-[10px] text-muted-foreground mt-2">
            GitHub Action coming soon. Star{" "}
            <a href="https://github.com/benchdai/harness" className="text-amber hover:text-amber/80" target="_blank" rel="noopener noreferrer">
              benchdai/harness
            </a>{" "}
            to get notified.
          </p>
        </section>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/benchdai/harness"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
          >
            View on GitHub <ArrowRight className="ml-2 h-4 w-4" />
          </a>
          <Link
            href="/submit"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-secondary transition-colors"
          >
            Submit Results
          </Link>
        </div>

        <div className="mt-8">
          <NewsletterSignup variant="card" />
        </div>
      </div>
    </div>
  );
}
