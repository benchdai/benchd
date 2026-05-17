import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code2, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/bench/code-block";

// ─────────────────────────────────────────────────────────
// Adapter contract specs per track
// ─────────────────────────────────────────────────────────

interface AdapterSpec {
  track: string;
  trackLabel: string;
  version: string;
  description: string;
  requiredMethods: { name: string; signature: string; description: string }[];
  requiredCapabilities: string[];
  benchmarks: { slug: string; name: string; alignment: string }[];
  exampleCode: string;
  installCommand: string;
  testCommand: string;
}

const SPECS: Record<string, Record<string, AdapterSpec>> = {
  conversational: {
    v1: {
      track: "conversational",
      trackLabel: "Conversational Memory",
      version: "1.0",
      description:
        "Adapter contract for conversational memory systems. These systems store and retrieve information from multi-turn dialogue, maintaining context across sessions.",
      requiredMethods: [
        { name: "setup()", signature: "def setup(self) -> None", description: "Initialize the memory system. Called once before any benchmark items. Must be idempotent." },
        { name: "reset()", signature: "def reset(self) -> None", description: "Clear all stored memories. Called between benchmark items to ensure isolation." },
        { name: "teardown()", signature: "def teardown(self) -> None", description: "Clean up resources. Called once after all benchmark items complete." },
        { name: "ingest(turns)", signature: "def ingest(self, turns: List[Dict[str, Any]]) -> None", description: "Store a conversation history. Each turn has 'role' (user/assistant) and 'content' keys." },
        { name: "recall(query)", signature: "def recall(self, query: str) -> str", description: "Retrieve relevant memories for a query. Returns the raw text response from the memory system." },
      ],
      requiredCapabilities: [
        "Multi-turn conversation ingestion",
        "Natural language query recall",
        "Session isolation (reset between items)",
      ],
      benchmarks: [
        { slug: "longmemeval", name: "LongMemEval", alignment: "core" },
        { slug: "locomo", name: "LoCoMo", alignment: "core" },
        { slug: "truth-arbitration", name: "Truth Arbitration", alignment: "core" },
        { slug: "memory-poisoning", name: "Memory Poisoning", alignment: "core" },
        { slug: "reliability", name: "Reliability", alignment: "core" },
        { slug: "knowledge-retrieval", name: "Knowledge Retrieval", alignment: "adjacent" },
        { slug: "budget-curves", name: "Budget Curves", alignment: "adjacent" },
      ],
      exampleCode: `"""Example conversational memory adapter."""
from typing import Any, Dict, List, Optional
from benchd_harness.adapters.base import BaseAdapter


class MyMemoryAdapter(BaseAdapter):

    @property
    def name(self) -> str:
        return "my-memory"

    @property
    def version(self) -> Optional[str]:
        return "1.0.0"

    def setup(self) -> None:
        # Initialize your memory system
        self._client = MyMemoryClient()

    def reset(self) -> None:
        # Clear all memories for isolation
        self._client.clear()

    def teardown(self) -> None:
        self._client.close()

    def ingest(self, turns: List[Dict[str, Any]]) -> None:
        for turn in turns:
            self._client.add_message(
                role=turn["role"],
                content=turn["content"],
            )

    def recall(self, query: str) -> str:
        return self._client.search(query)`,
      installCommand: "pip install benchd-harness",
      testCommand: "benchd adapter validate my-memory && benchd run -a my-memory -b smoke-memory-v0",
    },
  },
  "knowledge-brain": {
    v1: {
      track: "knowledge-brain",
      trackLabel: "Knowledge Brain",
      version: "1.0",
      description:
        "Adapter contract for knowledge brain systems. These systems store, index, and retrieve structured or unstructured knowledge at scale.",
      requiredMethods: [
        { name: "setup()", signature: "def setup(self) -> None", description: "Initialize the knowledge system and any backing stores (vector DB, graph, etc.)." },
        { name: "reset()", signature: "def reset(self) -> None", description: "Clear all stored knowledge. Must fully reset the knowledge base." },
        { name: "teardown()", signature: "def teardown(self) -> None", description: "Clean up resources, connections, and temporary files." },
        { name: "ingest(turns)", signature: "def ingest(self, turns: List[Dict[str, Any]]) -> None", description: "Store knowledge from conversation turns. May involve chunking, embedding, or graph construction." },
        { name: "recall(query)", signature: "def recall(self, query: str) -> str", description: "Retrieve relevant knowledge. Should return the most relevant content, not the entire knowledge base." },
      ],
      requiredCapabilities: [
        "Knowledge ingestion from conversational format",
        "Semantic or keyword-based retrieval",
        "Scale handling (10-100+ pages of content)",
        "Session isolation",
      ],
      benchmarks: [
        { slug: "knowledge-retrieval", name: "Knowledge Retrieval", alignment: "core" },
        { slug: "knowledge-scale", name: "Knowledge Scale", alignment: "core" },
        { slug: "truth-arbitration", name: "Truth Arbitration", alignment: "core" },
        { slug: "budget-curves", name: "Budget Curves", alignment: "core" },
        { slug: "memory-poisoning", name: "Memory Poisoning", alignment: "adjacent" },
        { slug: "reliability", name: "Reliability", alignment: "adjacent" },
      ],
      exampleCode: `"""Example knowledge brain adapter."""
from typing import Any, Dict, List, Optional
from benchd_harness.adapters.base import BaseAdapter


class MyKnowledgeAdapter(BaseAdapter):

    @property
    def name(self) -> str:
        return "my-knowledge"

    @property
    def version(self) -> Optional[str]:
        return "1.0.0"

    def setup(self) -> None:
        self._store = MyVectorStore()
        self._store.initialize()

    def reset(self) -> None:
        self._store.clear_all()

    def teardown(self) -> None:
        self._store.close()

    def ingest(self, turns: List[Dict[str, Any]]) -> None:
        # Concatenate turns into document text
        text = "\\n".join(
            f"[{t['role']}]: {t['content']}" for t in turns
        )
        self._store.add_document(text)

    def recall(self, query: str) -> str:
        results = self._store.search(query, top_k=5)
        return "\\n".join(r.text for r in results)`,
      installCommand: "pip install benchd-harness",
      testCommand: "benchd adapter validate my-knowledge && benchd run -a my-knowledge -b knowledge-retrieval-v0",
    },
  },
  "agent-memory": {
    v1: {
      track: "agent-memory",
      trackLabel: "Agent Memory",
      version: "1.0",
      description:
        "Adapter contract for agent memory systems. These systems provide persistent memory for autonomous agents, supporting cross-session recall and multi-agent isolation.",
      requiredMethods: [
        { name: "setup()", signature: "def setup(self) -> None", description: "Initialize the agent memory backend. May start services, connect to databases, etc." },
        { name: "reset()", signature: "def reset(self) -> None", description: "Clear agent memory state. Must isolate between benchmark items." },
        { name: "teardown()", signature: "def teardown(self) -> None", description: "Shut down services and clean up." },
        { name: "ingest(turns)", signature: "def ingest(self, turns: List[Dict[str, Any]]) -> None", description: "Store agent interaction history. Turns represent agent actions and observations." },
        { name: "recall(query)", signature: "def recall(self, query: str) -> str", description: "Retrieve relevant agent memories for decision-making context." },
      ],
      requiredCapabilities: [
        "Agent interaction history storage",
        "Cross-session memory persistence",
        "Memory isolation between agents/tasks",
        "Efficient recall under token constraints",
      ],
      benchmarks: [
        { slug: "knowledge-retrieval", name: "Knowledge Retrieval", alignment: "core" },
        { slug: "truth-arbitration", name: "Truth Arbitration", alignment: "core" },
        { slug: "memory-poisoning", name: "Memory Poisoning", alignment: "core" },
        { slug: "budget-curves", name: "Budget Curves", alignment: "core" },
        { slug: "reliability", name: "Reliability", alignment: "core" },
        { slug: "knowledge-scale", name: "Knowledge Scale", alignment: "adjacent" },
        { slug: "longmemeval", name: "LongMemEval", alignment: "adjacent" },
      ],
      exampleCode: `"""Example agent memory adapter."""
from typing import Any, Dict, List, Optional
from benchd_harness.adapters.base import BaseAdapter


class MyAgentMemoryAdapter(BaseAdapter):

    @property
    def name(self) -> str:
        return "my-agent-memory"

    @property
    def version(self) -> Optional[str]:
        return "1.0.0"

    def setup(self) -> None:
        self._memory = AgentMemoryStore(agent_id="benchd-eval")

    def reset(self) -> None:
        self._memory.clear(agent_id="benchd-eval")

    def teardown(self) -> None:
        self._memory.shutdown()

    def ingest(self, turns: List[Dict[str, Any]]) -> None:
        for turn in turns:
            self._memory.store(
                agent_id="benchd-eval",
                role=turn["role"],
                content=turn["content"],
            )

    def recall(self, query: str) -> str:
        results = self._memory.recall(
            agent_id="benchd-eval",
            query=query,
        )
        return "\\n".join(results)`,
      installCommand: "pip install benchd-harness",
      testCommand: "benchd adapter validate my-agent-memory && benchd run -a my-agent-memory -b smoke-memory-v0",
    },
  },
  graph: {
    v1: {
      track: "graph",
      trackLabel: "Graph / RAG",
      version: "1.0",
      description:
        "Adapter contract for graph-based memory and RAG systems. These systems use knowledge graphs, graph databases, or graph-enhanced retrieval to store and query information.",
      requiredMethods: [
        { name: "setup()", signature: "def setup(self) -> None", description: "Initialize graph database, embeddings, and any required services." },
        { name: "reset()", signature: "def reset(self) -> None", description: "Clear the graph. Must remove all nodes and edges." },
        { name: "teardown()", signature: "def teardown(self) -> None", description: "Close connections, stop services, clean up temporary data." },
        { name: "ingest(turns)", signature: "def ingest(self, turns: List[Dict[str, Any]]) -> None", description: "Extract entities and relationships from conversation turns and add to graph." },
        { name: "recall(query)", signature: "def recall(self, query: str) -> str", description: "Query the graph for relevant information. May use graph traversal, embedding search, or both." },
      ],
      requiredCapabilities: [
        "Entity extraction and relationship mapping",
        "Graph-based or graph-enhanced retrieval",
        "Knowledge scale handling",
        "Session isolation (full graph clear on reset)",
      ],
      benchmarks: [
        { slug: "knowledge-retrieval", name: "Knowledge Retrieval", alignment: "core" },
        { slug: "knowledge-scale", name: "Knowledge Scale", alignment: "core" },
        { slug: "truth-arbitration", name: "Truth Arbitration", alignment: "core" },
        { slug: "budget-curves", name: "Budget Curves", alignment: "core" },
        { slug: "memory-poisoning", name: "Memory Poisoning", alignment: "adjacent" },
        { slug: "reliability", name: "Reliability", alignment: "adjacent" },
      ],
      exampleCode: `"""Example graph memory adapter."""
from typing import Any, Dict, List, Optional
from benchd_harness.adapters.base import BaseAdapter


class MyGraphAdapter(BaseAdapter):

    @property
    def name(self) -> str:
        return "my-graph"

    @property
    def version(self) -> Optional[str]:
        return "1.0.0"

    def setup(self) -> None:
        self._graph = GraphStore(uri="bolt://localhost:7687")

    def reset(self) -> None:
        self._graph.clear_all()

    def teardown(self) -> None:
        self._graph.close()

    def ingest(self, turns: List[Dict[str, Any]]) -> None:
        text = "\\n".join(
            f"[{t['role']}]: {t['content']}" for t in turns
        )
        self._graph.extract_and_store(text)

    def recall(self, query: str) -> str:
        nodes = self._graph.query(query, max_hops=2)
        return "\\n".join(n.text for n in nodes)`,
      installCommand: "pip install benchd-harness",
      testCommand: "benchd adapter validate my-graph && benchd run -a my-graph -b knowledge-retrieval-v0",
    },
  },
};

// ─────────────────────────────────────────────────────────
// Static params
// ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  const params: { track: string; version: string }[] = [];
  for (const [track, versions] of Object.entries(SPECS)) {
    for (const version of Object.keys(versions)) {
      params.push({ track, version });
    }
  }
  return params;
}

export function generateMetadata({ params }: { params: Promise<{ track: string; version: string }> }) {
  return params.then(({ track, version }) => {
    const spec = SPECS[track]?.[version];
    if (!spec) return { title: "Spec Not Found — Bench'd" };
    return {
      title: `${spec.trackLabel} Adapter Spec ${spec.version} — Bench'd`,
      description: spec.description,
    };
  });
}

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────

export default async function AdapterSpecPage({
  params,
}: {
  params: Promise<{ track: string; version: string }>;
}) {
  const { track, version } = await params;
  const spec = SPECS[track]?.[version];
  if (!spec) notFound();

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
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber">
            Adapter Contract
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            v{spec.version}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {spec.trackLabel} Adapter Spec
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          {spec.description}
        </p>
      </div>

      <div className="space-y-12 max-w-3xl">
        {/* Required methods */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-amber" />
            Required methods
          </h2>
          <div className="space-y-3">
            {spec.requiredMethods.map((method) => (
              <div key={method.name} className="border border-border/40 rounded-lg p-4 bg-card/50">
                <code className="font-mono text-sm font-semibold text-foreground">
                  {method.signature}
                </code>
                <p className="mt-1.5 text-sm text-foreground/80">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Required capabilities */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Required capabilities</h2>
          <ul className="space-y-1.5">
            {spec.requiredCapabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-green-500 mt-0.5">-</span>
                {cap}
              </li>
            ))}
          </ul>
        </section>

        {/* Applicable benchmarks */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Applicable benchmarks</h2>
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">Benchmark</th>
                  <th className="text-left px-4 py-2 font-medium">Alignment</th>
                </tr>
              </thead>
              <tbody>
                {spec.benchmarks.map((b) => (
                  <tr key={b.slug} className="border-t border-border/30">
                    <td className="px-4 py-2">
                      <Link
                        href={`/methodology/metrics/${b.slug}`}
                        className="text-amber hover:underline"
                      >
                        {b.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                          b.alignment === "core"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {b.alignment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Example implementation */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3">Example implementation</h2>
          <CodeBlock code={spec.exampleCode} language="python" />
        </section>

        {/* Quick start */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber" />
            Quick start
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Install</p>
              <CodeBlock code={spec.installCommand} language="bash" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Validate &amp; test</p>
              <CodeBlock code={spec.testCommand} language="bash" />
            </div>
          </div>
        </section>

        {/* Stable URL */}
        <section className="border-t border-border/30 pt-8">
          <p className="text-xs text-muted-foreground">
            Stable URL:{" "}
            <code className="font-mono bg-muted/30 px-1 py-0.5 rounded">
              benchd.ai/spec/adapter/{spec.track}/v{spec.version.replace(".", "")}
            </code>
            <br />
            Version: <strong>{spec.version}</strong> | This spec is referenced in adapter manifests and will not change within the same major version.
          </p>
        </section>
      </div>
    </div>
  );
}
