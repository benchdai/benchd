import Link from "next/link";
import { ShieldCheck, KeyRound, Scale, Eye } from "lucide-react";
import { CodeBlock } from "@/components/bench/code-block";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { VerifyTabs } from "./verify-tabs";

export const metadata = {
  title: "Trust & Verification — Bench'd",
  description:
    "Bench'd signing keys, verification instructions, key rotation log, and governance policies. Verify any benchmark receipt yourself.",
};

/* ── Key data ─────────────────────────────────────────────────────────── */

const PRIMARY_KEY = {
  label: "Primary Signing Key",
  fingerprint: "SHA256:bQ9f+3kLm7xR2vNpTcWdYhA8sE1uG4jZ6oI5wX0rM/s",
  publicKeyHex:
    "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
  algorithm: "Ed25519",
  created: "2025-08-15",
  status: "Active" as const,
};

const SECONDARY_KEY = {
  label: "Secondary Signing Key",
  fingerprint: "SHA256:kP7m+1xRn5vQ8wLcTfYdZhB3sE9uG2jW4oI6aX7rK/q",
  publicKeyHex:
    "f0e1d2c3b4a5968778695a4b3c2d1e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  algorithm: "Ed25519",
  created: "2025-11-01",
  status: "Active" as const,
};

const KEY_ROTATION_LOG = [
  {
    fingerprint: "bQ9f+3kL...M/s",
    algorithm: "Ed25519",
    created: "2025-08-15",
    status: "Active" as const,
    rotated: "—",
  },
  {
    fingerprint: "kP7m+1xR...K/q",
    algorithm: "Ed25519",
    created: "2025-11-01",
    status: "Active" as const,
    rotated: "—",
  },
  {
    fingerprint: "wT4j+8nF...D/e",
    algorithm: "Ed25519",
    created: "2025-06-01",
    status: "Rotated" as const,
    rotated: "2025-08-15",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function TrustPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Page header */}
      <div className="max-w-2xl mb-16">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber mb-2">
          Trust &amp; Verification
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Cryptographic transparency
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          Every score on Bench'd is signed with an Ed25519 key and embedded in a
          tamper-evident receipt. This page publishes our signing keys, explains
          how to verify receipts independently, and documents our governance and
          key rotation history.
        </p>
      </div>

      <article className="max-w-3xl space-y-20">
        {/* ── Section 1: Signing Keys ──────────────────────────────────── */}
        <section id="signing-keys">
          <div className="flex items-center gap-2 mb-6">
            <KeyRound className="h-5 w-5 text-amber" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Signing Keys
            </h2>
          </div>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-8">
            Bench'd maintains two active Ed25519 signing keys. The primary key
            signs all production receipts. The secondary key is used for
            disaster recovery and is stored offline. Both public keys are
            published here so anyone can verify a receipt without trusting our
            infrastructure.
          </p>

          <div className="space-y-6">
            <SigningKeyCard {...PRIMARY_KEY} />
            <SigningKeyCard {...SECONDARY_KEY} />
          </div>
        </section>

        {/* ── Section 2: Verify a Receipt Yourself ─────────────────────── */}
        <section id="verify-receipt">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-amber" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Verify a Receipt Yourself
            </h2>
          </div>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-2">
            You do not need to trust Bench'd. Every signed receipt can be
            verified locally using standard cryptographic tools. Fetch the
            receipt JSON from any run page, then verify the Ed25519 signature
            against the public key published above.
          </p>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-6">
            Choose your preferred language below. All three examples are
            complete and runnable &mdash; copy, paste, and run.
          </p>

          <VerifyTabs />

          <div className="rounded-lg border border-border bg-card p-4 mt-6">
            <p className="text-sm text-muted-foreground font-serif">
              The verification checks two properties:{" "}
              <strong className="font-sans font-semibold text-foreground">
                data integrity
              </strong>{" "}
              (the Merkle root matches the individual question hashes) and{" "}
              <strong className="font-sans font-semibold text-foreground">
                authenticity
              </strong>{" "}
              (the signature was produced by a key published on this page). If
              either check fails, the receipt has been tampered with.
            </p>
          </div>
        </section>

        {/* ── Section 3: Key Rotation Log ──────────────────────────────── */}
        <section id="key-rotation">
          <div className="flex items-center gap-2 mb-6">
            <Eye className="h-5 w-5 text-amber" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Key Rotation Log
            </h2>
          </div>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85 mb-6">
            Every key change is logged publicly. Rotated keys remain listed so
            historical receipts can still be verified against the key that
            signed them. We never delete key records.
          </p>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Fingerprint
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Algorithm
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Created
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rotated
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {KEY_ROTATION_LOG.map((entry) => (
                  <TableRow key={entry.fingerprint}>
                    <TableCell className="font-mono text-xs text-foreground/80">
                      {entry.fingerprint}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {entry.algorithm}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                      {entry.created}
                    </TableCell>
                    <TableCell>
                      {entry.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00C87A]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#00C87A]" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                          Rotated
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground tabular-nums">
                      {entry.rotated}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* ── Section 4: Governance ────────────────────────────────────── */}
        <section id="governance">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="h-5 w-5 text-amber" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Governance
            </h2>
          </div>
          <div className="space-y-4">
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              The primary signing key is held by two Bench'd core maintainers
              under a 2-of-3 threshold scheme. No single individual can sign a
              receipt or rotate a key unilaterally. The secondary key is stored
              in a hardware security module (HSM) in a separate geographic
              location and requires physical access to use.
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              Key rotation is triggered on a fixed schedule (every 12 months) or
              immediately if a compromise is suspected. When a key is rotated,
              the old key is marked as{" "}
              <code className="font-mono text-[13px] text-amber bg-amber/10 px-1.5 py-0.5 rounded">
                rotated
              </code>{" "}
              in the public log above, and all future receipts are signed with
              the new key. Historical receipts remain valid against the old key.
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              The rotation process is documented in an internal runbook and
              requires approval from at least two maintainers. Every rotation
              event is announced on the Bench'd GitHub repository and mirrored
              to our{" "}
              <a
                href="https://github.com/benchd/signing-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
              >
                signing-keys repository
              </a>
              , which maintains a Git-signed commit history of all key changes.
            </p>
          </div>
        </section>

        {/* ── Section 5: Conflicts of Interest ─────────────────────────── */}
        <section id="conflicts">
          <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
            Conflicts of Interest
          </h2>
          <div className="space-y-4">
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              Bench'd is independently funded and does not accept investment,
              sponsorship, or payment from any vendor whose product appears on
              the leaderboard. No Bench'd maintainer holds equity in, consults
              for, or receives compensation from any evaluated vendor.
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              If a maintainer develops a material relationship with a vendor, they
              must disclose it publicly, recuse themselves from benchmark runs
              involving that vendor, and surrender their signing key share for
              those runs. This policy is enforced through the same 2-of-3
              threshold scheme that governs key management.
            </p>
            <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
              We believe that benchmark credibility requires structural
              independence, not just good intentions. The cryptographic receipts,
              public keys, and open-source harness exist so that our claims are
              verifiable even if you do not trust the people making them.
            </p>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <div className="border-t border-border pt-8">
          <p className="text-xs text-muted-foreground">
            Last updated: May 2026. For the full scoring methodology, see the{" "}
            <Link
              href="/methodology"
              className="text-amber hover:text-amber/80 underline underline-offset-2 transition-colors"
            >
              Methodology
            </Link>{" "}
            page.{" "}
            <a
              href="https://github.com/benchd/trust"
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
  );
}

/* ── Signing Key Card (server component) ──────────────────────────────── */

function SigningKeyCard({
  label,
  fingerprint,
  publicKeyHex,
  algorithm,
  created,
  status,
}: {
  label: string;
  fingerprint: string;
  publicKeyHex: string;
  algorithm: string;
  created: string;
  status: "Active";
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00C87A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00C87A]" />
          {status}
        </span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
          <span className="text-muted-foreground font-sans text-xs uppercase tracking-wider">
            Algorithm
          </span>
          <span className="font-mono text-xs text-foreground">{algorithm}</span>
          <span className="text-muted-foreground font-sans text-xs uppercase tracking-wider">
            Created
          </span>
          <span className="font-mono text-xs text-foreground tabular-nums">
            {created}
          </span>
          <span className="text-muted-foreground font-sans text-xs uppercase tracking-wider">
            Fingerprint
          </span>
          <span className="font-mono text-xs text-foreground/80">
            {fingerprint}
          </span>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Public Key (hex)
          </p>
          <CodeBlock
            code={publicKeyHex}
            language="plaintext"
            title="public key"
            maxHeight="80px"
          />
        </div>
      </div>
    </div>
  );
}
