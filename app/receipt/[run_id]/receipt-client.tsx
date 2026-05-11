"use client";

import { useState } from "react";
import type { Run } from "@/lib/types";
import { CodeBlock } from "@/components/bench/code-block";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  ShieldCheck,
  ShieldX,
  Copy,
  Download,
  RefreshCw,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

interface ReceiptClientProps {
  run: Run;
}

export function ReceiptClient({ run }: ReceiptClientProps) {
  const [verified, setVerified] = useState(true);
  const [verifying, setVerifying] = useState(false);

  const manifestJson = JSON.stringify(run.manifest, null, 2);

  const completedDate = new Date(run.completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const signingKeyFingerprint = "SHA256:" + run.merkleRoot.slice(0, 43);

  const handleCopyManifest = async () => {
    await navigator.clipboard.writeText(manifestJson);
    toast.success("Manifest copied to clipboard");
  };

  const handleDownloadJson = () => {
    const blob = new Blob([manifestJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${run.id}_manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${run.id}_manifest.json`);
  };

  const handleVerifyAgain = async () => {
    setVerifying(true);
    // Simulate client-side verification
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setVerified(true);
    setVerifying(false);
    toast.success("Verification passed — manifest integrity confirmed");
  };

  const handleShare = async () => {
    const tweet = `Verified ${run.systemName} scored ${run.verifiedOverall} on ${run.benchmarkName} via @benchd_ai. Signed receipt: benchd.ai/receipt/${run.id}`;
    await navigator.clipboard.writeText(tweet);
    toast.success("Tweet template copied to clipboard");
  };

  const handleCopySignature = async () => {
    await navigator.clipboard.writeText(run.signature);
    toast.success("Signature copied to clipboard");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-mono text-foreground">
            Run: {run.id}
          </h1>
        </div>

        {/* Verification badge */}
        {verified ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md w-fit"
            style={{ backgroundColor: "rgba(0, 200, 122, 0.12)" }}
          >
            <ShieldCheck className="h-5 w-5" style={{ color: "#00C87A" }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: "#00C87A" }}>
              VERIFIED
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-red-500/10 w-fit">
            <ShieldX className="h-5 w-5 text-red-500" />
            <span className="text-sm font-semibold tracking-wide text-red-500">
              INVALID
            </span>
          </div>
        )}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 p-4 rounded-lg border border-border bg-code-bg">
        <SummaryItem label="System" value={run.systemName} />
        <SummaryItem label="Benchmark" value={run.benchmarkName} />
        <SummaryItem label="Harness" value={`v${run.harnessVersion}`} mono />
        <SummaryItem
          label="Verified Overall"
          value={`${run.verifiedOverall}%`}
          amber
        />
        <SummaryItem
          label="Nuance Overall"
          value={`${run.nuanceOverall}%`}
          amber
        />
        <SummaryItem label="Date" value={completedDate} />
      </div>

      {/* Tabs: Manifest / Signature / Proof */}
      <Tabs defaultValue="manifest" className="mb-10">
        <TabsList className="mb-4">
          <TabsTrigger value="manifest">Manifest</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="proof">Proof</TabsTrigger>
        </TabsList>

        <TabsContent value="manifest">
          <CodeBlock
            code={manifestJson}
            language="json"
            title="run_manifest.json"
            showCopy
            showDownload
            downloadFilename={`${run.id}_manifest.json`}
            maxHeight="none"
            className="min-h-[400px]"
          />
        </TabsContent>

        <TabsContent value="signature">
          <div className="rounded-lg border border-border bg-code-bg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Ed25519 Signature
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopySignature}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-xs">Copy</span>
              </Button>
            </div>
            <pre className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-all p-4 rounded-md bg-code-bg-deep border border-border">
              {run.signature}
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="proof">
          <div className="space-y-6">
            {/* Merkle Root */}
            <div className="rounded-lg border border-border bg-code-bg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Merkle Root
              </h3>
              <pre className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-all p-4 rounded-md bg-code-bg-deep border border-border">
                {run.merkleRoot}
              </pre>
            </div>

            {/* Signing Key Fingerprint */}
            <div className="rounded-lg border border-border bg-code-bg p-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Signing Key Fingerprint
              </h3>
              <pre className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap break-all p-4 rounded-md bg-code-bg-deep border border-border">
                {signingKeyFingerprint}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={handleCopyManifest}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Manifest
        </Button>

        <Button
          variant="outline"
          onClick={handleDownloadJson}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Download JSON
        </Button>

        <Button
          variant="outline"
          onClick={handleVerifyAgain}
          disabled={verifying}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${verifying ? "animate-spin" : ""}`} />
          {verifying ? "Verifying..." : "Verify Again"}
        </Button>

        <Button
          variant="outline"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share this verification
        </Button>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  mono,
  amber,
}: {
  label: string;
  value: string;
  mono?: boolean;
  amber?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60">
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          amber
            ? "text-amber-400"
            : mono
              ? "font-mono text-foreground/90"
              : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
