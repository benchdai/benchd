"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/bench/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Plug,
  FlaskConical,
  Scale,
  Play,
  Terminal,
  ExternalLink,
  Clock,
  DollarSign,
  Check,
  Copy,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";

type Benchmark = "longmemeval" | "locomo" | "quick";

const BENCHMARKS: {
  id: Benchmark;
  name: string;
  version: string;
  description: string;
  questions: number;
  estimatedTime: string;
  estimatedCost: string;
}[] = [
  {
    id: "longmemeval",
    name: "LongMemEval",
    version: "v1.0",
    description: "500 questions across 6 categories. The standard.",
    questions: 500,
    estimatedTime: "~25 min",
    estimatedCost: "~$2.50",
  },
  {
    id: "locomo",
    name: "LoCoMo",
    version: "v1.0",
    description: "1540 questions. Single-hop, multi-hop, temporal, open-domain.",
    questions: 1540,
    estimatedTime: "~80 min",
    estimatedCost: "~$7.00",
  },
  {
    id: "quick",
    name: "Quick Test",
    version: "50 questions",
    description: "Stratified sample for fast iteration.",
    questions: 50,
    estimatedTime: "~3 min",
    estimatedCost: "~$0.25",
  },
];

type JudgeOption = "benchd" | "byok";

export default function RunPage() {
  // Step 1: Connection
  const [endpointTab, setEndpointTab] = useState("mcp");
  const [mcpUrl, setMcpUrl] = useState("");
  const [mcpApiKey, setMcpApiKey] = useState("");
  const [restIngestUrl, setRestIngestUrl] = useState("");
  const [restRecallUrl, setRestRecallUrl] = useState("");
  const [restHeaders, setRestHeaders] = useState("");
  const [showMcpKey, setShowMcpKey] = useState(false);
  const [connectionToast, setConnectionToast] = useState(false);

  // Step 2: Benchmark
  const [selectedBenchmark, setSelectedBenchmark] = useState<Benchmark>("longmemeval");

  // Step 3: Scoring
  const [judgeOption, setJudgeOption] = useState<JudgeOption>("benchd");
  const [byokKey, setByokKey] = useState("");
  const [showByokKey, setShowByokKey] = useState(false);

  // CLI copy
  const [copied, setCopied] = useState(false);

  const hasEndpoint =
    endpointTab === "mcp" ? mcpUrl.trim().length > 0 : restIngestUrl.trim().length > 0 && restRecallUrl.trim().length > 0;

  const cliCommand = `pip install benchd-harness && benchd run --adapter mcp --benchmark longmemeval-v1`;

  function handleTestConnection() {
    setConnectionToast(true);
    setTimeout(() => setConnectionToast(false), 3000);
  }

  function handleCopy() {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ArrowLeft className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
        {/* ── Section 1: Header ── */}
        <section className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
            Run a Benchmark
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl leading-relaxed">
            Test your memory system against standardized benchmarks. Paste your endpoint, pick a benchmark, get a signed receipt.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-amber/10 text-amber px-3 py-1 text-xs font-medium">
            <Zap className="size-3" />
            Live runs coming soon — UI preview
          </div>
        </section>

        {/* ── Section 2: Configuration ── */}
        <div className="space-y-6">
          {/* Step 1: Connect */}
          <div className="rounded-xl border border-border bg-card card-md overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="flex items-center justify-center size-7 rounded-full bg-amber/15 text-amber text-xs font-bold">
                1
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold">Connect your system</h2>
                <p className="text-xs text-muted-foreground">Provide your MCP endpoint or REST API URLs</p>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5">
              <Tabs value={endpointTab} onValueChange={setEndpointTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="mcp">
                    <Plug className="size-3.5" />
                    MCP Endpoint
                    <span className="ml-1 text-[10px] text-amber font-medium">(recommended)</span>
                  </TabsTrigger>
                  <TabsTrigger value="rest">REST API</TabsTrigger>
                </TabsList>

                <TabsContent value="mcp" className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">MCP Server URL</label>
                    <Input
                      placeholder="http://localhost:3000/mcp"
                      value={mcpUrl}
                      onChange={(e) => setMcpUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      API Key <span className="text-xs">(optional)</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showMcpKey ? "text" : "password"}
                        placeholder="sk-..."
                        value={mcpApiKey}
                        onChange={(e) => setMcpApiKey(e.target.value)}
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowMcpKey(!showMcpKey)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showMcpKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={!mcpUrl.trim()}
                    >
                      <Plug className="size-3.5" />
                      Test Connection
                    </Button>
                    {connectionToast && (
                      <span className="absolute left-32 top-1/2 -translate-y-1/2 text-xs text-muted-foreground animate-in fade-in slide-in-from-left-2">
                        Connection testing coming soon
                      </span>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="rest" className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Ingest URL</label>
                    <Input
                      placeholder="https://api.example.com/ingest"
                      value={restIngestUrl}
                      onChange={(e) => setRestIngestUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Recall URL</label>
                    <Input
                      placeholder="https://api.example.com/recall"
                      value={restRecallUrl}
                      onChange={(e) => setRestRecallUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Headers <span className="text-xs">(JSON, optional)</span>
                    </label>
                    <Input
                      placeholder='{"Authorization": "Bearer sk-..."}'
                      value={restHeaders}
                      onChange={(e) => setRestHeaders(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Step 2: Benchmark */}
          <div className="rounded-xl border border-border bg-card card-md overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="flex items-center justify-center size-7 rounded-full bg-amber/15 text-amber text-xs font-bold">
                2
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold">Choose benchmark</h2>
                <p className="text-xs text-muted-foreground">Select the evaluation suite to run</p>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-3">
              {BENCHMARKS.map((b) => {
                const isSelected = selectedBenchmark === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBenchmark(b.id)}
                    className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                      isSelected
                        ? "border-amber bg-amber/5 shadow-sm"
                        : "border-border hover:border-amber/40 bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{b.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                            {b.version}
                          </span>
                          {isSelected && (
                            <Check className="size-3.5 text-amber" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{b.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {b.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3" />
                          {b.estimatedCost}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Scoring */}
          <div className="rounded-xl border border-border bg-card card-md overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
              <div className="flex items-center justify-center size-7 rounded-full bg-amber/15 text-amber text-xs font-bold">
                3
              </div>
              <div>
                <h2 className="font-serif text-lg font-semibold">Scoring</h2>
                <p className="text-xs text-muted-foreground">Pick a judge model for answer evaluation</p>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-5 space-y-4">
              {/* Bench'd Judge */}
              <button
                onClick={() => setJudgeOption("benchd")}
                className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                  judgeOption === "benchd"
                    ? "border-amber bg-amber/5 shadow-sm"
                    : "border-border hover:border-amber/40 bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-amber" />
                  <span className="font-semibold text-sm">Use Bench&apos;d Judge</span>
                  <span className="text-[10px] bg-verified-green/15 text-verified-green px-1.5 py-0.5 rounded font-medium">
                    free
                  </span>
                  {judgeOption === "benchd" && <Check className="size-3.5 text-amber ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  gpt-4o-mini via OpenRouter. Rate-limited, no API key required.
                </p>
              </button>

              {/* BYOK */}
              <button
                onClick={() => setJudgeOption("byok")}
                className={`w-full text-left rounded-lg border-2 p-4 transition-all ${
                  judgeOption === "byok"
                    ? "border-amber bg-amber/5 shadow-sm"
                    : "border-border hover:border-amber/40 bg-card"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="size-4 text-muted-foreground" />
                  <span className="font-semibold text-sm">Bring Your Own Key</span>
                  {judgeOption === "byok" && <Check className="size-3.5 text-amber ml-auto" />}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use your own OpenRouter API key. No rate limits.
                </p>
              </button>

              {judgeOption === "byok" && (
                <div className="space-y-1.5 pl-4 border-l-2 border-amber/30 ml-2">
                  <label className="text-sm font-medium">OpenRouter API Key</label>
                  <div className="relative">
                    <Input
                      type={showByokKey ? "text" : "password"}
                      placeholder="sk-or-..."
                      value={byokKey}
                      onChange={(e) => setByokKey(e.target.value)}
                      className="pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowByokKey(!showByokKey)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showByokKey ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Judge model: gpt-4o-mini via OpenRouter
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Section 3: Run + Output ── */}
        <section className="space-y-4">
          <Button
            size="lg"
            disabled={!hasEndpoint}
            className="w-full sm:w-auto h-12 px-8 text-base font-semibold bg-amber hover:bg-amber/90 text-charcoal"
          >
            <Play className="size-4" />
            Run Benchmark
          </Button>

          <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Results will appear here after your run completes.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              For now, use the CLI:{" "}
              <code className="bg-code-bg px-1.5 py-0.5 rounded text-[11px] font-mono">
                pip install benchd-harness && benchd run
              </code>
            </p>
          </div>
        </section>

        {/* ── Section 4: CLI Alternative ── */}
        <section className="rounded-xl border border-border bg-card card-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-border flex items-center gap-3">
            <Terminal className="size-4 text-muted-foreground" />
            <h2 className="font-serif text-lg font-semibold">CLI Alternative</h2>
          </div>
          <div className="px-5 sm:px-6 py-5 space-y-4">
            <p className="text-sm text-muted-foreground">
              Prefer the command line? The harness runs locally and produces the same signed receipts.
            </p>
            <div className="relative group">
              <pre className="bg-code-bg-deep rounded-lg p-4 pr-12 overflow-x-auto text-sm font-mono text-foreground">
                <code>{cliCommand}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                title="Copy command"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              The harness is open source.{" "}
              <a
                href="https://github.com/benchdai/harness"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber hover:underline inline-flex items-center gap-1"
              >
                github.com/benchdai/harness
                <ExternalLink className="size-3" />
              </a>
            </p>
          </div>
        </section>

        {/* Bottom spacer */}
        <div className="h-8" />
      </main>
    </div>
  );
}
