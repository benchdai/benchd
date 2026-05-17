import Link from "next/link";
import { ArrowLeft, ShieldCheck, ShieldAlert, AlertTriangle, Info } from "lucide-react";

export const metadata = {
  title: "Trust Boundaries — What ProofMeter Proves and Does Not Prove",
  description:
    "Explicit documentation of what ProofMeter cryptographically attests to, what it estimates, and what it cannot prove. No overclaiming.",
};

export default function TrustBoundariesPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link
        href="/methodology"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Methodology
      </Link>

      <div className="mb-12 max-w-2xl">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-amber mb-2 block">
          ProofMeter v1.1
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Trust Boundaries
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          What ProofMeter cryptographically proves, what it estimates, and what it
          explicitly does not claim. Honest infrastructure requires honest documentation.
        </p>
      </div>

      <div className="space-y-10 max-w-3xl">
        {/* What we PROVE */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            What ProofMeter proves
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            These facts are cryptographically signed, hash-chained, and independently
            verifiable by any third party with access to the receipt and the public key.
          </p>
          <div className="space-y-2">
            {[
              ["Usage was recorded", "The receipt contains exact token counts, provider, model, endpoint class, and timestamp as observed by the runner's infrastructure."],
              ["Receipt was signed", "Ed25519 signature over canonical JSON payload. Verifiable with the public key."],
              ["Receipt was not altered", "SHA-256 hash chain links each receipt to the previous one. Modifying or removing any receipt breaks the chain for all subsequent receipts."],
              ["Price book hash matches", "The pricing table used for cost estimation is hashed. Anyone can re-derive cost from the same receipt using the same or different pricing table."],
              ["Cost math is reproducible", "Given the token counts and the declared pricing table, the estimated cost can be independently recomputed."],
              ["Settlement matches receipts", "The Merkle root of the settlement commits to all individual receipt hashes. Verifiable in O(log n) time."],
              ["Budget authorization existed", "The capability ID on each receipt references a signed budget authorization that was valid at the time of issuance."],
              ["Sequence integrity", "Monotonic sequence numbers per-capability prevent receipt reordering or insertion."],
            ].map(([title, desc]) => (
              <div key={title} className="border border-green-500/20 rounded-lg p-4 bg-green-500/5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-foreground/70 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we ESTIMATE */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            What ProofMeter estimates
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            These values are derived computations, clearly labeled with confidence levels.
            They are useful approximations, not cryptographic facts.
          </p>
          <div className="space-y-2">
            {[
              ["Cost in USD", "Computed from declared pricing table (public list prices, customer rates, or usage-only). Always labeled as 'estimated' unless invoice-reconciled. Different parties can compute different costs from the same receipt."],
              ["Budget utilization", "How much of the authorized budget has been consumed. Depends on the pricing basis used for the budget denomination."],
              ["Per-model cost breakdown", "Aggregated from individual receipt cost estimates. Same caveat: derived from declared pricing, not actual billing."],
            ].map(([title, desc]) => (
              <div key={title} className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-foreground/70 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What we DO NOT prove */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            What ProofMeter does not prove
          </h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-4">
            These are explicit non-claims. Honest infrastructure is clear about its limits.
          </p>
          <div className="space-y-2">
            {[
              ["Actual billed cost", "ProofMeter does not know what the customer actually paid. Enterprise discounts, committed-use agreements, free credits, and promotional pricing are invisible to the receipt. Cost is always derived from a declared pricing table unless the customer provides invoice reconciliation data."],
              ["Provider-side truth", "Providers (OpenAI, Anthropic, Google) do not sign their API responses. Token counts in receipts are as reported by the provider's API, but not independently attested by the provider. A compromised agent could theoretically report different token counts than the provider returned."],
              ["Fraud prevention", "ProofMeter attests to what was observed, not whether it was reasonable. An agent that makes 10,000 unnecessary API calls will get 10,000 valid receipts. Budget enforcement limits spend, but does not evaluate whether the spend was warranted."],
              ["Vendor-side budget enforcement", "Budgets are enforced at the meter level, not at the provider. If the meter is bypassed (agent calls the API directly without going through ProofMeter), the spend is unmetered. ProofMeter is an observation layer, not a gateway."],
              ["Regulatory compliance", "ProofMeter is a technical primitive, not a compliance product. It does not constitute SOC 2, GDPR, HIPAA, or any other regulatory compliance on its own. Receipts contain minimal PII by design, which supports data minimization requirements, but customers must evaluate compliance in their own context."],
              ["Timestamp authority", "Timestamps are signer-asserted (the system that created the receipt declared the time). They are not countersigned by an independent timestamp authority (RFC 3161). For most use cases this is sufficient. Regulated industries requiring non-repudiable timestamps should integrate a TSA."],
              ["Agent identity verification", "Agent IDs are pseudonymous identifiers assigned by the customer. ProofMeter does not verify that the agent is who it claims to be. Agent identifiers are linkable across receipts — customers handling sensitive workloads should rotate agent IDs."],
            ].map(([title, desc]) => (
              <div key={title} className="border border-red-500/20 rounded-lg p-4 bg-red-500/5">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-foreground/70 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Non-goals */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber" />
            Explicit non-goals for v1
          </h2>
          <ul className="space-y-2">
            {[
              "Invoice reconciliation (deferred until enterprise demand)",
              "Provider-attested responses (waiting for vendors to sign API responses)",
              "Trusted timestamps via RFC 3161 (deferred for regulated industries)",
              "Cross-agent spend attribution (no agent-to-agent commerce standard exists yet)",
              "Unlinkable receipts (agent IDs are pseudonymous but linkable by design)",
              "Self-hosted reference server (architecture supports it; Docker image deferred)",
              "Real-time streaming spend dashboards (batch settlement is v1)",
              "Multi-key co-signing (customer-held keys deferred to v2)",
              "Automatic price book updates from provider pricing pages",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-amber mt-0.5 shrink-0">-</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Key rotation */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Key rotation</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            Every receipt includes a <code className="font-mono text-xs bg-muted/30 px-1 rounded">signing_key_id</code> identifying
            which key signed it. When keys rotate, old receipts remain verifiable by looking
            up the historical key via its ID. The key directory maintains all public keys
            with their validity periods. Receipts signed under a rotated key are still
            cryptographically valid — rotation affects future signing, not past verification.
          </p>
        </section>

        {/* Schema versioning */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Schema versioning</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            Every receipt and settlement includes a <code className="font-mono text-xs bg-muted/30 px-1 rounded">schema_version</code> field
            (e.g., <code className="font-mono text-xs bg-muted/30 px-1 rounded">proofmeter.receipt.v1.1</code>).
            Verifiers ignore unknown fields when checking signatures. Old receipts missing
            new fields are still valid under their original schema version. Schema changes
            are additive only — no fields are removed or renamed within a major version.
          </p>
        </section>

        {/* Retention */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Retention and deletion</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            Receipts are append-only by design. Deleting a receipt would break the hash chain
            for all subsequent receipts in that capability. Customers can export receipts and
            request deletion of the server-side copy, but the cryptographic chain becomes
            unverifiable at the deletion point. Capability revocation does not delete receipts —
            it marks them as historical and prevents new spend against the capability.
          </p>
        </section>

        {/* Stable URL */}
        <section className="border-t border-border/30 pt-8">
          <p className="text-xs text-muted-foreground">
            Stable URL:{" "}
            <code className="font-mono bg-muted/30 px-1 py-0.5 rounded">
              benchd.ai/methodology/trust-boundaries
            </code>
            <br />
            Version: <strong>1.0</strong> | ProofMeter v1.1. Patent pending.
          </p>
        </section>
      </div>
    </div>
  );
}
