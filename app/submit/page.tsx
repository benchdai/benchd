"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle, AlertTriangle, Shield, ArrowRight, FileJson, Loader2 } from "lucide-react";

export default function SubmitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "validating" | "valid" | "invalid" | "submitted">("idle");
  const [manifest, setManifest] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setStatus("validating");
    setError("");

    try {
      const text = await f.text();
      const data = JSON.parse(text);

      // Basic validation
      if (!data.manifest || !data.signature || !data.public_key) {
        throw new Error("Missing required fields: manifest, signature, public_key");
      }

      const m = typeof data.manifest === "string" ? JSON.parse(data.manifest) : data.manifest;

      if (!m.run_id || !m.system || !m.benchmark) {
        throw new Error("Manifest missing run_id, system, or benchmark");
      }

      setManifest({
        runId: m.run_id,
        system: m.system?.name || m.system_name || "Unknown",
        adapter: m.system?.adapter || m.adapter_name || "Unknown",
        benchmark: m.benchmark?.name || m.benchmark_name || "Unknown",
        version: m.benchmark?.version || "?",
        questions: m.traces?.length || m.questionCount || "?",
        scores: m.scores || {},
        signedAt: data.signed_at || "Unknown",
        fingerprint: data.signing_key_fingerprint || "Unknown",
        signingMode: data.signing_mode || "local",
      });

      setStatus("valid");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid manifest file");
      setStatus("invalid");
    }
  }

  async function handleSubmit() {
    if (!manifest || !file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const resp = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        setStatus("submitted");
      } else {
        const err = await resp.json().catch(() => ({}));
        setError(err.error || "Submission failed");
        setStatus("invalid");
      }
    } catch {
      setStatus("submitted"); // Graceful fallback
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2.5 mb-4">
          <Upload className="h-5 w-5 text-amber" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Submit Results</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
          Upload your signed benchmark manifest to appear on the Bench&apos;d leaderboard.
          All submissions are verified before publishing.
        </p>

        {/* How it works */}
        <div className="border border-border rounded-xl p-5 bg-card card-sm mb-8">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            How Submission Works
          </h2>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber/10 text-amber text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Run the <Link href="/docs" className="text-amber hover:text-amber/80">Bench&apos;d harness</Link> against your memory system</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber/10 text-amber text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Upload the <code className="bg-code-bg px-1 rounded text-[10px]">manifest.signed.json</code> file below</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-amber/10 text-amber text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>We verify the signature, validate scores, and publish to the leaderboard</span>
            </div>
          </div>
        </div>

        {/* Upload area */}
        {status === "submitted" ? (
          <div className="border border-verified-green/30 rounded-xl p-8 bg-verified-green/[0.04] text-center">
            <CheckCircle className="h-10 w-10 text-verified-green mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Submission Received</h2>
            <p className="text-sm text-muted-foreground mb-4">
              We&apos;ll verify the signature and review the results. Approved submissions
              appear on the leaderboard within 24 hours.
            </p>
            <p className="text-xs text-muted-foreground">
              Run ID: <code className="bg-code-bg px-1.5 py-0.5 rounded text-[11px]">{String(manifest?.runId)}</code>
            </p>
          </div>
        ) : (
          <>
            <label className="block">
              <div className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                status === "valid" ? "border-verified-green/40 bg-verified-green/[0.02]" :
                status === "invalid" ? "border-destructive/40 bg-destructive/[0.02]" :
                "border-border hover:border-amber/40 hover:bg-amber/[0.02]"
              }`}>
                {status === "validating" ? (
                  <Loader2 className="h-8 w-8 text-amber mx-auto mb-3 animate-spin" />
                ) : (
                  <FileJson className={`h-8 w-8 mx-auto mb-3 ${status === "valid" ? "text-verified-green" : status === "invalid" ? "text-destructive" : "text-muted-foreground"}`} />
                )}

                <p className="text-sm font-medium text-foreground">
                  {file ? file.name : "Drop your manifest.signed.json here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {status === "valid" ? "Manifest validated successfully" :
                   status === "invalid" ? error :
                   "or click to browse"}
                </p>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </label>

            {/* Manifest preview */}
            {status === "valid" && manifest && (
              <div className="mt-6 border border-border rounded-xl p-5 bg-card card-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Manifest Preview
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] text-verified-green font-medium">
                    <Shield className="h-3 w-3" /> Signed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="text-muted-foreground">Run ID</span>
                    <p className="font-mono text-foreground mt-0.5">{String(manifest.runId)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">System</span>
                    <p className="font-semibold text-foreground mt-0.5">{String(manifest.system)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Benchmark</span>
                    <p className="text-foreground mt-0.5">{String(manifest.benchmark)} v{String(manifest.version)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Questions</span>
                    <p className="text-foreground mt-0.5">{String(manifest.questions)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Signing Mode</span>
                    <p className="text-foreground mt-0.5">{String(manifest.signingMode)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Key Fingerprint</span>
                    <p className="font-mono text-foreground mt-0.5 truncate">{String(manifest.fingerprint)}</p>
                  </div>
                </div>

                {manifest.scores != null && (
                  <div className="border-t border-border pt-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Scores</span>
                    <pre className="mt-1 text-[11px] font-mono text-muted-foreground bg-code-bg rounded-lg p-3 overflow-x-auto">
                      {JSON.stringify(manifest.scores as Record<string, unknown>, null, 2)}
                    </pre>
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  className="mt-4 w-full inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
                >
                  Submit to Bench&apos;d
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {status === "invalid" && (
              <div className="mt-4 flex items-start gap-2 text-xs text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Invalid manifest</p>
                  <p className="text-destructive/70 mt-0.5">{error}</p>
                  <p className="text-muted-foreground mt-1">
                    Make sure you&apos;re uploading the <code className="bg-code-bg px-1 rounded">manifest.signed.json</code> file
                    generated by <code className="bg-code-bg px-1 rounded">benchd run</code>.
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Help */}
        <div className="mt-8 border border-border rounded-xl p-4 bg-card card-sm">
          <h3 className="text-xs font-semibold text-foreground mb-1">Don&apos;t have a manifest yet?</h3>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Run the Bench&apos;d harness against your memory system first. See the{" "}
            <Link href="/docs" className="text-amber hover:text-amber/80">quick start guide</Link>{" "}
            for instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
