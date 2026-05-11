import type { Benchmark } from "@/lib/types";

export const benchmarks: Benchmark[] = [
  {
    id: "bench_longmemeval",
    slug: "longmemeval",
    name: "LongMemEval",
    version: "1.0",
    paperUrl: "https://arxiv.org/abs/2407.15460",
    description:
      "Comprehensive benchmark for evaluating long-term memory in conversational AI. Tests memory recall, temporal reasoning, and knowledge update across extended multi-session dialogues with up to 500 conversation turns.",
    subTests: [
      {
        slug: "single-session-recall",
        name: "Single-Session Recall",
        dimension: "recall",
        scoringMethod: "exact",
        maxScore: 100,
      },
      {
        slug: "cross-session-recall",
        name: "Cross-Session Recall",
        dimension: "recall",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "temporal-ordering",
        name: "Temporal Event Ordering",
        dimension: "temporal",
        scoringMethod: "exact",
        maxScore: 100,
      },
      {
        slug: "temporal-duration",
        name: "Temporal Duration Reasoning",
        dimension: "temporal",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "knowledge-update",
        name: "Knowledge Update Detection",
        dimension: "reasoning",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "multi-hop-reasoning",
        name: "Multi-Hop Memory Reasoning",
        dimension: "reasoning",
        scoringMethod: "llm",
        maxScore: 100,
      },
    ],
    judgeProtocol: {
      model: "claude-sonnet-4-20250514",
      temperature: 0.0,
      promptVersion: "longmemeval-judge-v1.2",
    },
    createdAt: "2025-07-01T00:00:00Z",
  },
  {
    id: "bench_locomo",
    slug: "locomo",
    name: "LoCoMo",
    version: "1.0",
    paperUrl: "https://arxiv.org/abs/2402.14257",
    description:
      "Long Conversational Memory benchmark focusing on naturalistic dialogue. Evaluates memory systems on their ability to retain and retrieve facts from extended conversations that simulate months of real-world interaction.",
    subTests: [
      {
        slug: "factual-qa",
        name: "Factual Question Answering",
        dimension: "recall",
        scoringMethod: "exact",
        maxScore: 100,
      },
      {
        slug: "entity-tracking",
        name: "Entity State Tracking",
        dimension: "recall",
        scoringMethod: "regex",
        maxScore: 100,
      },
      {
        slug: "event-sequencing",
        name: "Event Sequencing",
        dimension: "temporal",
        scoringMethod: "exact",
        maxScore: 100,
      },
      {
        slug: "recency-bias",
        name: "Recency Bias Detection",
        dimension: "temporal",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "causal-reasoning",
        name: "Causal Chain Reasoning",
        dimension: "reasoning",
        scoringMethod: "llm",
        maxScore: 100,
      },
    ],
    judgeProtocol: {
      model: "claude-sonnet-4-20250514",
      temperature: 0.0,
      promptVersion: "locomo-judge-v1.0",
    },
    createdAt: "2025-08-15T00:00:00Z",
  },
  {
    id: "bench_personamem",
    slug: "personamem",
    name: "PersonaMem",
    version: "2.0",
    paperUrl: null,
    description:
      "Evaluates memory systems on maintaining consistent user personas across sessions. Tests preference retention, contradiction detection, and persona drift over simulated weeks of interaction with diverse user profiles.",
    subTests: [
      {
        slug: "preference-recall",
        name: "User Preference Recall",
        dimension: "recall",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "preference-update",
        name: "Preference Update Handling",
        dimension: "recall",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "temporal-preference-shift",
        name: "Temporal Preference Shift",
        dimension: "temporal",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "contradiction-detection",
        name: "Contradiction Detection",
        dimension: "reasoning",
        scoringMethod: "llm",
        maxScore: 100,
      },
      {
        slug: "persona-synthesis",
        name: "Persona Synthesis",
        dimension: "reasoning",
        scoringMethod: "llm",
        maxScore: 100,
      },
    ],
    judgeProtocol: {
      model: "gpt-4o-2025-03-26",
      temperature: 0.0,
      promptVersion: "personamem-judge-v2.1",
    },
    createdAt: "2026-01-20T00:00:00Z",
  },
];

export function getBenchmarkBySlug(slug: string): Benchmark | undefined {
  return benchmarks.find((b) => b.slug === slug);
}
