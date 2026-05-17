import Link from "next/link";
import { ArrowLeft, ShieldCheck, Hash, Link2 } from "lucide-react";
import { CodeBlock } from "@/components/bench/code-block";

export const metadata = {
  title: "ProofMeter Receipt Specification v1.0 — Bench'd",
  description:
    "Formal specification for ProofMeter cryptographic spend receipts. Defines the receipt format, signing scheme, hash chaining, budget capabilities, and verification rules for AI agent spend attestation.",
};

export default function ReceiptSpecPage() {
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
          ProofMeter Specification v1.0
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Receipt Specification
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          ProofMeter provides cryptographic spend attestation for AI agent actions.
          This document defines the receipt format, budget capability model, signing
          scheme, and verification rules. Patent pending.
        </p>
      </div>

      <div className="space-y-12 max-w-3xl">
        {/* Core loop */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Core loop</h2>
          <div className="flex items-center gap-2 flex-wrap text-sm font-mono">
            <span className="bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Authorize</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">Meter</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-1 rounded">Sign</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-1 rounded">Settle</span>
            <span className="text-muted-foreground">&rarr;</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded">Verify</span>
          </div>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-foreground/85">
            Before an agent, benchmark run, or workflow can incur cost, it receives a
            signed <strong>budget capability</strong>. Each billable action produces a signed,
            hash-chained <strong>spend receipt</strong>. When the task completes, receipts are
            aggregated into a Merkle-rooted <strong>settlement</strong>. Any party can
            independently <strong>verify</strong> any receipt or settlement without trusting
            the runner or the platform.
          </p>
        </section>

        {/* Budget Capability */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Budget Capability
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            A budget capability is a signed permission granting an agent a maximum spend
            within defined scope and time bounds.
          </p>
          <CodeBlock language="json" code={`{
  "schema": "proofmeter.capability.v1",
  "capability_id": "cap_01HX...",
  "namespace_id": "ns_benchd",
  "authorized_agent_id": "benchd-runner",
  "max_budget_cents": 500,
  "currency": "USD",
  "scope": {
    "allowed_providers": ["openai", "anthropic"],
    "allowed_endpoint_classes": ["chat", "embedding"]
  },
  "expires_at": "2026-05-18T00:00:00Z",
  "metadata": {
    "task_id": "run_abc123",
    "source": "benchd-harness"
  },
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "key_01HX...",
    "value": "base64..."
  }
}`} />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-foreground/80"><strong>max_budget_cents</strong> — Hard spending limit in cents. Enforced per-receipt.</p>
            <p className="text-sm text-foreground/80"><strong>scope</strong> — Restricts which providers and endpoint classes the agent may use.</p>
            <p className="text-sm text-foreground/80"><strong>expires_at</strong> — Capability becomes invalid after this timestamp.</p>
          </div>
        </section>

        {/* Design principle */}
        <section className="border border-amber/20 rounded-xl p-5 bg-amber/5">
          <h2 className="text-lg font-bold text-foreground mb-2">Design principle: Usage is fact. Cost is derived.</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            Receipts attest to <strong>provable facts</strong> — tokens consumed, provider called,
            model used, timestamps. Cost is a <strong>derived computation</strong> that depends on
            who&apos;s computing it (list price, enterprise discount, internal chargeback).
            The receipt never claims to know what the customer actually paid. Different
            parties can compute different cost views from the same provable token counts.
          </p>
        </section>

        {/* Spend Receipt */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Hash className="w-5 h-5 text-blue-500" />
            Usage Receipt
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            Every API/LLM call produces a receipt with two distinct sections: <strong>proven
            usage</strong> (signed, verifiable forever) and an optional <strong>cost estimate</strong> (derived
            from a declared pricing table, re-computable by anyone).
          </p>
          <CodeBlock language="json" code={`{
  "schema": "proofmeter.receipt.v1.1",
  "receipt_id": "rcpt_01HX...",
  "namespace_id": "ns_benchd",
  "actor_id": "benchd-runner",
  "capability_id": "cap_01HX...",
  "task_id": "run_abc123",

  "proven_usage": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "endpoint_class": "chat",
    "input_tokens": 1200,
    "output_tokens": 300,
    "total_tokens": 1500,
    "latency_ms": 842,
    "occurred_at": "2026-05-17T14:30:00Z"
  },

  "cost_estimate": {
    "estimated_cost_usd": 0.00033,
    "cost_confidence": "estimated",
    "pricing_basis": "list_price",
    "pricing_version": "2026-05",
    "note": "Derived from public list prices. Actual billed amount may differ."
  },

  "metadata": {
    "question_id": "q_014",
    "benchmark": "reliability",
    "adapter": "verifiedstate"
  },

  "chain": {
    "previous_hash": "sha256:abc123...",
    "event_hash": "sha256:def456..."
  },
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "key_01HX...",
    "value": "base64..."
  }
}`} />
          <div className="mt-4 space-y-2">
            <p className="text-sm text-foreground/80"><strong>proven_usage</strong> — Signed, verifiable facts from the API response. This never changes.</p>
            <p className="text-sm text-foreground/80"><strong>cost_estimate</strong> — Derived from a declared pricing table. Can be recomputed by anyone with a different pricing table. Explicitly labeled as an estimate.</p>
            <p className="text-sm text-foreground/80"><strong>cost_confidence</strong> — One of: <code className="font-mono text-xs bg-muted/30 px-1 rounded">estimated</code> (list prices), <code className="font-mono text-xs bg-muted/30 px-1 rounded">customer_supplied</code> (their rates), <code className="font-mono text-xs bg-muted/30 px-1 rounded">invoice_reconciled</code> (matched to billing), <code className="font-mono text-xs bg-muted/30 px-1 rounded">usage_only</code> (no cost calculated).</p>
          </div>
        </section>

        {/* Hash Chaining */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-amber-500" />
            Hash Chaining
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            Receipts are hash-chained: each receipt&apos;s <code className="font-mono text-xs bg-muted/30 px-1 rounded">event_hash</code> is
            computed over the canonical JSON of the receipt payload plus the previous
            receipt&apos;s hash. This creates a tamper-evident chain — modifying or removing
            any receipt breaks the chain for all subsequent receipts.
          </p>
          <CodeBlock language="text" code={`Receipt 1:  event_hash = SHA-256(canonical(payload) + "null")
Receipt 2:  event_hash = SHA-256(canonical(payload) + receipt_1.event_hash)
Receipt 3:  event_hash = SHA-256(canonical(payload) + receipt_2.event_hash)
...
Settlement: merkle_root = Merkle(all event_hashes)`} />
        </section>

        {/* Settlement */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Settlement</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            When a task completes, all receipts are settled into a Merkle-rooted batch.
            The settlement is the final audit record for the task.
          </p>
          <CodeBlock language="json" code={`{
  "schema": "proofmeter.settlement.v1.1",
  "settlement_id": "stl_01HX...",
  "namespace_id": "ns_benchd",
  "task_id": "run_abc123",
  "capability_id": "cap_01HX...",
  "receipt_count": 294,

  "proven_totals": {
    "total_input_tokens": 352800,
    "total_output_tokens": 88200,
    "total_tokens": 441000
  },

  "cost_estimate": {
    "estimated_total_usd": "0.2646",
    "cost_confidence": "estimated",
    "pricing_basis": "list_price",
    "pricing_version": "2026-05"
  },

  "merkle_root": "sha256:...",
  "signature": {
    "algorithm": "Ed25519",
    "key_id": "key_01HX...",
    "value": "base64..."
  }
}`} />
        </section>

        {/* Signing Scheme */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Signing scheme</h2>
          <div className="space-y-3 text-sm text-foreground/80">
            <p><strong>Algorithm:</strong> Ed25519</p>
            <p><strong>Canonicalization:</strong> JCS (RFC 8785) — deterministic JSON serialization</p>
            <p><strong>Hash:</strong> SHA-256 over canonical JSON bytes</p>
            <p><strong>Signature:</strong> Ed25519 sign over the SHA-256 hash</p>
            <p><strong>Key format:</strong> Hex-encoded 32-byte public keys</p>
          </div>
          <p className="mt-4 font-serif text-[15px] leading-relaxed text-foreground/85">
            The same signing scheme used by the Bench&apos;d harness for benchmark manifests.
            A single manifest may carry both a harness signature (proving the score) and
            ProofMeter receipts (proving the cost).
          </p>
        </section>

        {/* Verification */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Verification</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            Any party can verify a receipt or settlement without trusting the runner:
          </p>
          <ol className="space-y-2 list-decimal list-inside text-sm text-foreground/80">
            <li>Re-canonicalize the receipt payload using JCS</li>
            <li>Recompute SHA-256 hash of canonical bytes + previous_hash</li>
            <li>Verify Ed25519 signature against the computed hash</li>
            <li>Check that event_hash matches the recomputed hash (chain integrity)</li>
            <li>For settlements: verify Merkle root against all receipt hashes</li>
            <li>Check budget: total spend across receipts &le; capability max_budget_cents</li>
          </ol>
        </section>

        {/* MCP Tools */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">MCP integration</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            ProofMeter is accessible as MCP tools. Any MCP-compatible agent can
            authorize budgets, record spend, and verify receipts:
          </p>
          <div className="border border-border/40 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">Tool</th>
                  <th className="text-left px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["meter_authorize", "Create budget capability"],
                  ["meter_spend", "Record spend event, get signed receipt"],
                  ["meter_budget", "Check remaining budget"],
                  ["meter_settle", "Settle receipts into Merkle batch"],
                  ["meter_verify", "Verify receipt signature and chain"],
                  ["meter_receipts", "List and filter receipts"],
                ].map(([tool, desc]) => (
                  <tr key={tool} className="border-t border-border/30">
                    <td className="px-4 py-2 font-mono text-xs">{tool}</td>
                    <td className="px-4 py-2 text-foreground/80">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Receipt examples */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Receipt examples by pricing mode</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            The same usage event looks different depending on the pricing mode.
            The <code className="font-mono text-xs bg-muted/30 px-1 rounded">proven_usage</code> section
            is identical in all cases — only the cost section changes.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">1. Usage-only (no cost)</h3>
              <CodeBlock language="json" code={`{
  "proven_usage": { "provider": "openai", "model": "gpt-4o", "input_tokens": 1200, "output_tokens": 300 },
  "cost_estimate": { "estimated_cost_usd": null, "cost_confidence": "usage_only" }
}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">2. Public estimated (default)</h3>
              <CodeBlock language="json" code={`{
  "proven_usage": { "provider": "openai", "model": "gpt-4o", "input_tokens": 1200, "output_tokens": 300 },
  "cost_estimate": {
    "estimated_cost_usd": 0.006,
    "cost_confidence": "estimated",
    "pricing_basis": "public_estimate",
    "price_book_id": "proofmeter_public_2026_05",
    "price_book_hash": "sha256:8cfb89..."
  }
}`} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">3. Customer price book (private rates)</h3>
              <CodeBlock language="json" code={`{
  "proven_usage": { "provider": "openai", "model": "gpt-4o", "input_tokens": 1200, "output_tokens": 300 },
  "cost_estimate": {
    "estimated_cost_usd": 0.003,
    "cost_confidence": "customer_supplied",
    "pricing_basis": "customer_price_book",
    "price_book_id": "acme_openai_q2_2026",
    "price_book_hash": "sha256:a6f9bf..."
  }
}`} />
              <p className="text-xs text-muted-foreground mt-1">
                Note: Raw rates are excluded from shared receipts when <code className="font-mono bg-muted/30 px-1 rounded">rates_private: true</code>.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">4. Invoice-reconciled (future)</h3>
              <CodeBlock language="json" code={`{
  "proven_usage": { "provider": "openai", "model": "gpt-4o", "input_tokens": 1200, "output_tokens": 300 },
  "cost_estimate": {
    "estimated_cost_usd": 0.003,
    "cost_confidence": "invoice_reconciled",
    "pricing_basis": "customer_price_book",
    "reconciliation_status": "reconciled",
    "invoice_reference": "inv_2026_05_openai"
  }
}`} />
            </div>
          </div>
        </section>

        {/* Usage in benchd */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Usage in benchd-harness</h2>
          <CodeBlock language="bash" code={`# Run a benchmark with $5 budget and spend tracking
benchd run -a verifiedstate -b reliability --budget 5.00

# The signed manifest will include a proofmeter section:
# - total_spend_usd
# - receipt_count
# - per-model cost breakdown
# - settlement_merkle_root
# - settlement_signature`} />
        </section>

        {/* Reference implementation */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Reference implementation</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            The reference implementation ships with{" "}
            <code className="font-mono text-xs bg-muted/30 px-1 rounded">benchd-harness</code> on
            PyPI as the <code className="font-mono text-xs bg-muted/30 px-1 rounded">benchd_harness.proofmeter</code> submodule.
            It can be imported independently:
          </p>
          <CodeBlock language="python" code={`from benchd_harness.proofmeter import ProofMeterClient

client = ProofMeterClient(api_key="vs_live_...", namespace_id="ns_...")
client.connect()

budget = client.authorize_budget(
    agent_id="my-agent",
    max_budget_cents=500,
)

receipt = client.record_spend(
    actor_id="my-agent",
    provider_id="openai",
    usage_unit="tokens",
    usage_quantity=1500,
    cost_cents=2,
    capability_id=budget.capability_id,
)

settlement = client.settle(capability_id=budget.capability_id)`} />
        </section>

        {/* Non-goals */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Non-goals</h2>
          <ol className="space-y-1.5 list-decimal list-inside text-sm text-foreground/80">
            <li>ProofMeter does not prevent fraud or validate request reasonableness.</li>
            <li>ProofMeter does not enforce budgets at the provider layer — only at the meter.</li>
            <li>ProofMeter does not validate vendor honesty about token counts (providers do not sign responses).</li>
            <li>ProofMeter does not match invoices unless the customer provides reconciliation data.</li>
            <li>ProofMeter does not claim to know actual billed cost — only estimated cost under a declared pricing basis.</li>
            <li>ProofMeter does not provide regulatory compliance (SOC 2, GDPR, HIPAA) on its own.</li>
            <li>ProofMeter does not attest to timestamp accuracy beyond signer assertion.</li>
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">
            See <Link href="/methodology/trust-boundaries" className="text-amber hover:underline">Trust Boundaries</Link> for
            the full analysis of what ProofMeter proves, estimates, and does not prove.
          </p>
        </section>

        {/* Stable URL */}
        <section className="border-t border-border/30 pt-8">
          <p className="text-xs text-muted-foreground">
            Stable URL:{" "}
            <code className="font-mono bg-muted/30 px-1 py-0.5 rounded">
              benchd.ai/methodology/receipt-spec
            </code>
            <br />
            Version: <strong>1.1</strong> | Protocol by VerifiedState. Patent pending.
            <br />
            See also:{" "}
            <Link href="/methodology/trust-boundaries" className="text-amber hover:underline">Trust Boundaries</Link>{" "}
            (what ProofMeter proves and does not prove)
          </p>
        </section>
      </div>
    </div>
  );
}
