import Link from "next/link";
import { ArrowLeft, Key } from "lucide-react";

export const metadata = {
  title: "Signing Keys — Bench'd",
  description: "Public key directory for verifying Bench'd signed manifests and ProofMeter receipts.",
};

// Key directory — add new entries when keys rotate, never remove old ones
const KEYS = [
  {
    key_id: "benchd_harness_v1",
    algorithm: "Ed25519",
    public_key: "auto-generated at first run — see keys/public.key",
    valid_from: "2025-12-01",
    valid_until: null as string | null,
    status: "active" as const,
    usage: "Benchmark manifest signing, ProofMeter receipt signing",
    note: "Default harness key. Auto-generated per installation. Each operator has their own keypair.",
  },
];

export default function KeysPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link
        href="/methodology"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Methodology
      </Link>

      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Key className="w-7 h-7 text-amber" />
          Signing Keys
        </h1>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed font-serif">
          Public key directory for verifying Bench&apos;d manifests and ProofMeter receipts.
          Every receipt includes a <code className="font-mono text-xs bg-muted/30 px-1 rounded">signing_key_id</code> that
          maps to an entry here. Old keys are never removed — they remain for
          verifying historical receipts.
        </p>
      </div>

      <div className="max-w-3xl space-y-4">
        {KEYS.map((key) => (
          <div key={key.key_id} className="border border-border/40 rounded-xl p-5 bg-card/50">
            <div className="flex items-start justify-between mb-3">
              <code className="font-mono text-sm font-semibold text-foreground">{key.key_id}</code>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                key.status === "active"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-zinc-500/10 text-zinc-500"
              }`}>
                {key.status}
              </span>
            </div>
            <div className="space-y-1.5 text-sm text-foreground/80">
              <p><strong>Algorithm:</strong> {key.algorithm}</p>
              <p><strong>Valid from:</strong> {key.valid_from}{key.valid_until ? ` to ${key.valid_until}` : " (current)"}</p>
              <p><strong>Usage:</strong> {key.usage}</p>
              {key.note && <p className="text-xs text-muted-foreground mt-2">{key.note}</p>}
            </div>
          </div>
        ))}

        <div className="border-t border-border/30 pt-6 mt-8">
          <h2 className="text-lg font-bold text-foreground mb-2">How key rotation works</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            When a signing key rotates, a new entry is added to this directory and the old
            entry&apos;s <code className="font-mono text-xs bg-muted/30 px-1 rounded">valid_until</code> is
            set. Old receipts remain verifiable using the key that was active when they
            were signed. Verifiers look up the <code className="font-mono text-xs bg-muted/30 px-1 rounded">signing_key_id</code> from
            the receipt, find the corresponding public key here, and verify the signature.
          </p>
          <p className="mt-3 font-serif text-[15px] leading-relaxed text-foreground/85">
            For self-hosted installations, operators generate their own keypair
            with <code className="font-mono text-xs bg-muted/30 px-1 rounded">benchd keys generate</code> and
            publish their public key at their own URL.
          </p>
        </div>
      </div>
    </div>
  );
}
