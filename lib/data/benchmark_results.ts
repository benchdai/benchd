/**
 * Benchmark results from actual harness runs.
 * Used by system profiles, leaderboard, and homepage.
 *
 * Key: system slug
 * Value: benchmark name → score (0-100) or null (not run)
 */
export const BENCHMARK_RESULTS: Record<string, Record<string, number | null>> = {
  "llamaindex-memory": {
    "LongMemEval": 59.0,
    "LoCoMo": 65.3,
    "Reliability": 56.0,
    "Truth Arbitration": 100.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 95.0,
  },
  "langchain-memory": {
    "LongMemEval": 59.0,
    "LoCoMo": 51.9,
    "Reliability": 52.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 95.0,
  },
  "llm-baseline": {
    "LongMemEval": 57.6,
    "LoCoMo": 61.2,
    "Reliability": 52.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 95.0,
    "Knowledge Scale": 100.0,
  },
  "autogpt-memory": {
    "LongMemEval": 47.4,
    "Reliability": 44.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 100.0,
  },
  "crewai-memory": {
    "LongMemEval": 46.0,
    "Reliability": 52.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 100.0,
  },
  "mem0-oss": {
    "LongMemEval": 32.4,
    "LoCoMo": 0.0,
    "Reliability": 52.0,
    "Truth Arbitration": 40.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
    "Knowledge Retrieval": 100.0,
  },
  "gbrain": {
    "Knowledge Retrieval": 100.0,
    "Knowledge Scale": 100.0,
    "Reliability": 4.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 0.0,
    "Budget Curves": 100.0,
  },
  "letta": {
    "Knowledge Retrieval": 80.0,
    "Truth Arbitration": 80.0,
    "Memory Poisoning": 20.0,
    "Budget Curves": 0.0,
  },
  "graphiti": {
    "Knowledge Retrieval": 80.0,
    "Truth Arbitration": 60.0,
    "Budget Curves": 72.0,
    "Reliability": 48.0,
  },
  "langmem-benchd": {
    "Reliability": 60.0,
  },
  "memoripy": {
    "LongMemEval": 0.0,
    "Reliability": 0.0,
  },
  "cognee": {
    "LongMemEval": 20.0,
    "Reliability": 0.0,
    "Knowledge Retrieval": 0.0,
    "Truth Arbitration": 0.0,
    "Budget Curves": 0.0,
  },
  "quivr": {
    "Knowledge Retrieval": 0.0,
    "Truth Arbitration": 0.0,
    "Budget Curves": 0.0,
    "Reliability": 4.0,
  },
};

/**
 * Compute track index for a system: average of applicable benchmark scores.
 */
export function computeTrackIndex(slug: string, applicableBenchmarks: string[]): number | null {
  const results = BENCHMARK_RESULTS[slug];
  if (!results) return null;

  const scores = applicableBenchmarks
    .map((b) => results[b])
    .filter((v): v is number => v !== null && v !== undefined);

  if (scores.length === 0) return null;

  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}
