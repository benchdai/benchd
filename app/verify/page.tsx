"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, ArrowLeft, Upload, Copy } from "lucide-react";

export default function VerifyPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | {
    valid: boolean;
    checks: { label: string; passed: boolean; detail: string }[];
    parsed: Record<string, unknown> | null;
    error?: string;
  }>(null);

  function verify() {
    try {
      const data = JSON.parse(input);

      const checks: { label: string; passed: boolean; detail: string }[] = [];

      // Check: has manifest or is a receipt
      const isManifest = !!data.manifest;
      const isReceipt = !!data.proven_usage || !!data.receipt_id;
      const isSignedManifest = isManifest && !!data.signature;

      if (isSignedManifest) {
        // Signed manifest verification
        const manifest = data.manifest;
        checks.push({
          label: "Manifest structure",
          passed: !!manifest && typeof manifest === "object",
          detail: manifest ? `Run: ${manifest.run_id || "unknown"}` : "Missing manifest field",
        });
        checks.push({
          label: "Signature present",
          passed: !!data.signature && data.signature.length > 10,
          detail: data.signature ? `${data.signature.substring(0, 32)}...` : "No signature",
        });
        checks.push({
          label: "Public key present",
          passed: !!data.public_key && data.public_key.length === 64,
          detail: data.public_key ? `${data.public_key.substring(0, 16)}...` : "No public key",
        });
        checks.push({
          label: "Manifest hash present",
          passed: !!data.manifest_hash && data.manifest_hash.length === 64,
          detail: data.manifest_hash ? `sha256:${data.manifest_hash.substring(0, 16)}...` : "No hash",
        });
        checks.push({
          label: "Key fingerprint",
          passed: !!data.signing_key_fingerprint,
          detail: data.signing_key_fingerprint || "Missing",
        });

        // Check ProofMeter section
        const pm = manifest?.proofmeter;
        if (pm) {
          checks.push({
            label: "ProofMeter section",
            passed: true,
            detail: `${pm.receipt_count || 0} receipts`,
          });
          const usage = pm.proven_usage;
          if (usage) {
            checks.push({
              label: "Proven usage",
              passed: !!usage.total_tokens,
              detail: `${(usage.total_tokens || 0).toLocaleString()} tokens`,
            });
          }
          const cost = pm.cost_estimate;
          if (cost) {
            checks.push({
              label: "Cost confidence",
              passed: !!cost.cost_confidence,
              detail: `${cost.cost_confidence}: ${cost.estimated_total_usd ? `~$${cost.estimated_total_usd}` : "usage only"}`,
            });
            checks.push({
              label: "Price book hash",
              passed: !!cost.price_book_hash,
              detail: cost.price_book_hash ? `sha256:${cost.price_book_hash.substring(0, 16)}...` : "Not hashed",
            });
          }
          const settlement = pm.settlement;
          if (settlement) {
            checks.push({
              label: "Settlement status",
              passed: settlement.status === "settled",
              detail: settlement.status || "unknown",
            });
            checks.push({
              label: "Merkle root",
              passed: !!settlement.merkle_root,
              detail: settlement.merkle_root ? `${settlement.merkle_root.substring(0, 24)}...` : "Not present",
            });
          }
        }

        // Structured score
        const ss = manifest?.structured_score;
        if (ss) {
          checks.push({
            label: "Structured score",
            passed: true,
            detail: `${ss.metric_id} — ${ss.status}`,
          });
          checks.push({
            label: "Interpretation persisted",
            passed: !!ss.interpretation?.label,
            detail: ss.interpretation?.label || "Not persisted",
          });
        }

        const allPassed = checks.every((c) => c.passed);
        setResult({ valid: allPassed, checks, parsed: manifest });

      } else if (isReceipt) {
        // Single receipt verification
        checks.push({
          label: "Receipt ID",
          passed: !!data.receipt_id,
          detail: data.receipt_id || "Missing",
        });
        checks.push({
          label: "Signature",
          passed: !!data.signature,
          detail: data.signature ? `${String(data.signature).substring(0, 32)}...` : "Not signed",
        });
        checks.push({
          label: "Event hash",
          passed: !!data.event_hash,
          detail: data.event_hash ? `sha256:${data.event_hash.substring(0, 16)}...` : "Missing",
        });
        checks.push({
          label: "Chain link",
          passed: data.previous_hash !== undefined,
          detail: data.previous_hash ? `prev: ${data.previous_hash.substring(0, 16)}...` : "First in chain",
        });

        const allPassed = checks.every((c) => c.passed);
        setResult({ valid: allPassed, checks, parsed: data });

      } else {
        setResult({
          valid: false,
          checks: [{
            label: "Format",
            passed: false,
            detail: "Not a recognized manifest or receipt. Expected a signed manifest (with 'manifest' + 'signature' fields) or a ProofMeter receipt (with 'receipt_id').",
          }],
          parsed: null,
        });
      }
    } catch {
      setResult({
        valid: false,
        checks: [{ label: "JSON parse", passed: false, detail: "Invalid JSON" }],
        parsed: null,
        error: "Could not parse input as JSON.",
      });
    }
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Home
      </Link>

      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Verify
        </h1>
        <p className="mt-3 text-muted-foreground text-base leading-relaxed font-serif">
          Paste a signed manifest or ProofMeter receipt to verify its integrity.
          No data is sent to any server — verification runs entirely in your browser.
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Paste manifest or receipt JSON
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"manifest": {...}, "signature": "...", "public_key": "..."}'
            className="w-full h-48 bg-card border border-border rounded-lg p-4 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber resize-y"
          />
        </div>

        <button
          onClick={verify}
          disabled={!input.trim()}
          className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          Verify
        </button>

        {result && (
          <div className={`border rounded-xl p-6 ${result.valid ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <div className="flex items-center gap-2 mb-4">
              {result.valid ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">VALID</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">
                    {result.error ? "ERROR" : "ISSUES FOUND"}
                  </span>
                </>
              )}
            </div>

            {result.error && (
              <p className="text-sm text-red-500 mb-4">{result.error}</p>
            )}

            <div className="space-y-1.5">
              {result.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className={`mt-0.5 shrink-0 ${check.passed ? "text-green-500" : "text-red-500"}`}>
                    {check.passed ? "✓" : "✗"}
                  </span>
                  <span className="font-medium text-foreground w-44 shrink-0">{check.label}</span>
                  <span className="text-muted-foreground font-mono text-xs">{check.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          For full cryptographic verification (Ed25519 signature check), use the CLI:{" "}
          <code className="font-mono bg-muted/30 px-1 rounded">benchd verify ./manifest.signed.json</code>
          <br />
          This browser tool checks structure and field presence. The CLI verifies the actual signature.
        </p>
      </div>
    </div>
  );
}
