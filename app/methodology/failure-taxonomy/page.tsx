import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Failure Taxonomy v1.0 — Bench'd",
  description:
    "Standardized reason codes for every benchmark failure. Used in signed manifests to classify why a system failed a specific question.",
};

interface FailureCodeDef {
  code: string;
  category: string;
  description: string;
  example: string;
}

const FAILURE_CODES: FailureCodeDef[] = [
  // Retrieval
  { code: "RETRIEVAL_MISS", category: "Retrieval", description: "System returned no relevant context for the query.", example: "Query asks about a meeting date; system returns unrelated content." },
  { code: "RETRIEVAL_IRRELEVANT", category: "Retrieval", description: "System returned context, but none of it is relevant to the question.", example: "Query asks about dietary preferences; system returns work schedule." },
  { code: "OVER_RETRIEVAL", category: "Retrieval", description: "System returned too much context, diluting the relevant information.", example: "System dumps entire conversation history instead of targeted recall." },
  // Temporal
  { code: "STALE_MEMORY", category: "Temporal", description: "System returned outdated information that was later corrected.", example: "User updated their address; system returns the old one." },
  { code: "TEMPORAL_CONFUSION", category: "Temporal", description: "System confused the temporal ordering of events.", example: "Events A then B occurred; system says B happened before A." },
  { code: "TEMPORAL_MISSING", category: "Temporal", description: "System cannot recall when something happened.", example: "Query asks 'when did X happen?'; system has no temporal context." },
  // Entity / Fact
  { code: "WRONG_ENTITY", category: "Entity", description: "System confused two different entities mentioned in the conversation.", example: "Alice likes coffee, Bob likes tea; system says Alice likes tea." },
  { code: "WRONG_FACT", category: "Entity", description: "System returned a fact that contradicts stored information.", example: "Stored: budget is $5000; returned: budget is $3000." },
  { code: "PARTIAL_ANSWER", category: "Entity", description: "System returned some but not all of the expected information.", example: "Expected 3 items; system returned 2." },
  // Hallucination
  { code: "HALLUCINATION", category: "Hallucination", description: "System generated information not grounded in any stored memory.", example: "System invents a meeting that never occurred." },
  { code: "UNSUPPORTED_CLAIM", category: "Hallucination", description: "System made a claim that cannot be traced to stored context.", example: "System says 'as we discussed last week' when no such discussion exists." },
  // Memory management
  { code: "DELETION_FAILURE", category: "Memory Mgmt", description: "System did not honor an explicit delete or forget request.", example: "User says 'forget my phone number'; system still returns it." },
  { code: "MISSING_PROVENANCE", category: "Memory Mgmt", description: "System cannot identify the source of a stored fact.", example: "System returns a fact but cannot say when or how it was learned." },
  { code: "CROSS_CONTAMINATION", category: "Memory Mgmt", description: "Information from one context leaked into another.", example: "User A's data appears in User B's memory space." },
  // Multi-agent
  { code: "CROSS_AGENT_LEAK", category: "Multi-Agent", description: "Information leaked between agents that should have isolated memory.", example: "Agent 1's private context appears in Agent 2's responses." },
  { code: "HANDOFF_LOSS", category: "Multi-Agent", description: "Information was lost during agent-to-agent handoff.", example: "User provides info to Agent 1; Agent 2 has no knowledge of it." },
  { code: "CONFLICT_UNRESOLVED", category: "Multi-Agent", description: "Conflicting information from multiple sources was not resolved.", example: "Two agents provide different answers; system doesn't choose." },
  // System
  { code: "EMPTY_RECALL", category: "System", description: "System returned an empty response.", example: "Recall returns '' or null." },
  { code: "RECALL_ERROR", category: "System", description: "System raised an error during recall.", example: "ConnectionError, TimeoutError, or internal exception." },
  { code: "TIMEOUT", category: "System", description: "System did not respond within the allowed time.", example: "Recall took >30s and was killed." },
  { code: "FORMAT_MISMATCH", category: "System", description: "System response was in an unexpected format.", example: "Expected text; got JSON or binary data." },
  // Judge
  { code: "JUDGE_DISAGREEMENT", category: "Judge", description: "The LLM judge scored differently than the deterministic scorer.", example: "Deterministic says FAIL; LLM judge says correct (or vice versa)." },
  { code: "ABSTENTION_WRONG", category: "Judge", description: "System abstained but the answer was retrievable.", example: "System says 'I don't know' when the answer is in its memory." },
];

const CATEGORIES = [...new Set(FAILURE_CODES.map((f) => f.category))];

export default function FailureTaxonomyPage() {
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
          Failure Taxonomy v1.0
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Failure Taxonomy
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif">
          Every failed benchmark question is classified with a standardized reason code.
          These codes appear in signed manifests and failure traces, enabling systematic
          analysis of <em>why</em> systems fail, not just <em>that</em> they fail.
        </p>
      </div>

      {/* Category sections */}
      <div className="space-y-10 max-w-3xl">
        {CATEGORIES.map((category) => {
          const codes = FAILURE_CODES.filter((f) => f.category === category);
          return (
            <section key={category}>
              <h2 className="text-lg font-bold text-foreground mb-4">{category}</h2>
              <div className="space-y-3">
                {codes.map((code) => (
                  <div
                    key={code.code}
                    className="border border-border/40 rounded-lg p-4 bg-card/50"
                  >
                    <div className="flex items-start gap-3">
                      <code className="font-mono text-xs font-semibold bg-muted/50 px-2 py-1 rounded whitespace-nowrap text-foreground">
                        {code.code}
                      </code>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/90">{code.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Example: {code.example}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Version info */}
        <section className="border-t border-border/30 pt-8">
          <h2 className="text-lg font-bold text-foreground mb-3">Versioning</h2>
          <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
            The failure taxonomy is versioned alongside the harness. When new failure
            codes are added, the taxonomy version is bumped and all new manifests
            reference the updated version. Existing manifests retain their original
            classification.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            Current version: <strong>1.0</strong> | {FAILURE_CODES.length} codes |{" "}
            {CATEGORIES.length} categories
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Stable URL:{" "}
            <code className="font-mono bg-muted/30 px-1 py-0.5 rounded">
              benchd.ai/methodology/failure-taxonomy
            </code>
          </p>
        </section>
      </div>
    </div>
  );
}
