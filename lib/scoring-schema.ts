/**
 * Bench'd Scoring Schema v1.0
 *
 * Every score on the site is a structured object, not a naked number.
 * Merged from Opus (structural context) + GPT (interpretation + status labels).
 *
 * This schema is the decade-proof foundation. New metrics, tracks, and
 * sub-dimensions slot in without changing the UI.
 */

export type ScoreStatus =
  | "measured"           // fully tested, real result
  | "not_claimed"        // outside system's stated purpose
  | "not_applicable"     // metric doesn't apply to this track
  | "not_supported"      // adapter can't expose this capability
  | "pending"            // not yet run
  | "adapter_missing"    // no adapter exists yet
  | "isolation_failed"   // run attempted but environment contaminated
  | "runtime_failed";    // run attempted but system errored

export type CapabilityClaim =
  | "claimed"
  | "claimed_partial"
  | "not_claimed"
  | "unknown";

export type PurposeAlignment =
  | "core"               // this is what the system is built for
  | "adjacent"           // related but not primary
  | "orthogonal"         // not what this system does
  | "not_applicable";    // doesn't make sense for this track

export type InterpretationLabel =
  | "excellent"          // >= 90%
  | "strong"             // >= 70%
  | "average"            // >= 40%
  | "weak"               // > 0% but < 40%, on a claimed capability
  | "capability_limited" // low score driven by unsupported sub-dimensions
  | "not_applicable";    // metric doesn't apply

export interface SubDimension {
  id: string;
  label: string;
  rawValue: number | null;
  maxValue: number;
  status: ScoreStatus;
  explanation?: string;
}

export interface ExpectationProfile {
  trackId: string;
  purposeAlignment: PurposeAlignment;
  trackMean: number | null;
  trackP25: number | null;
  trackP75: number | null;
  sampleSize: number;
}

export interface ScoreInterpretation {
  label: InterpretationLabel;
  summary: string;
}

export interface StructuredScore {
  metricId: string;
  metricVersion: string;
  trackId: string;
  rawValue: number | null;
  status: ScoreStatus;
  capabilityClaim: CapabilityClaim;
  expectationProfile: ExpectationProfile;
  subDimensions: SubDimension[];
  interpretation: ScoreInterpretation;
  methodologyUrl: string;
  receiptUrl?: string;
}

// ─────────────────────────────────────────────────────────
// Purpose alignment table: which metrics matter for which tracks
// ─────────────────────────────────────────────────────────

export const PURPOSE_ALIGNMENT: Record<string, Record<string, PurposeAlignment>> = {
  // Conversational Memory track
  conversational: {
    "Knowledge Retrieval": "adjacent",
    "Knowledge Scale": "orthogonal",
    "LongMemEval": "core",
    "LoCoMo": "core",
    "Truth Arbitration": "core",
    "Memory Poisoning": "core",
    "Budget Curves": "adjacent",
    "Reliability": "core",
  },
  // Knowledge Brain track
  "knowledge-brain": {
    "Knowledge Retrieval": "core",
    "Knowledge Scale": "core",
    "LongMemEval": "orthogonal",
    "LoCoMo": "orthogonal",
    "Truth Arbitration": "core",
    "Memory Poisoning": "adjacent",
    "Budget Curves": "core",
    "Reliability": "adjacent",
  },
  // Graph track
  graph: {
    "Knowledge Retrieval": "core",
    "Knowledge Scale": "core",
    "LongMemEval": "orthogonal",
    "LoCoMo": "orthogonal",
    "Truth Arbitration": "core",
    "Memory Poisoning": "adjacent",
    "Budget Curves": "core",
    "Reliability": "adjacent",
  },
  // Agent Memory track
  "agent-memory": {
    "Knowledge Retrieval": "core",
    "Knowledge Scale": "adjacent",
    "LongMemEval": "adjacent",
    "LoCoMo": "orthogonal",
    "Truth Arbitration": "core",
    "Memory Poisoning": "core",
    "Budget Curves": "core",
    "Reliability": "core",
  },
  // Baseline
  baseline: {
    "Knowledge Retrieval": "core",
    "Knowledge Scale": "core",
    "LongMemEval": "core",
    "LoCoMo": "core",
    "Truth Arbitration": "core",
    "Memory Poisoning": "core",
    "Budget Curves": "core",
    "Reliability": "core",
  },
};

// ─────────────────────────────────────────────────────────
// Reliability sub-dimensions
// ─────────────────────────────────────────────────────────

export const RELIABILITY_SUB_DIMENSIONS: Record<string, SubDimension[]> = {
  "gbrain": [
    { id: "stale", label: "Stale Memory Handling", rawValue: 71, maxValue: 100, status: "measured" },
    { id: "entity", label: "Entity Separation", rawValue: 67, maxValue: 100, status: "measured" },
    { id: "hallucination", label: "Hallucination Resistance", rawValue: 0, maxValue: 100, status: "not_claimed", explanation: "Search-first system returns results instead of abstaining" },
    { id: "deletion", label: "Deletion Compliance", rawValue: 0, maxValue: 100, status: "not_supported", explanation: "No delete-on-query API" },
  ],
  "graphiti": [
    { id: "stale", label: "Stale Memory Handling", rawValue: 57, maxValue: 100, status: "measured" },
    { id: "entity", label: "Entity Separation", rawValue: 67, maxValue: 100, status: "measured" },
    { id: "hallucination", label: "Hallucination Resistance", rawValue: 29, maxValue: 100, status: "measured" },
    { id: "deletion", label: "Deletion Compliance", rawValue: 40, maxValue: 100, status: "measured" },
  ],
  "llamaindex-memory": [
    { id: "stale", label: "Stale Memory Handling", rawValue: 100, maxValue: 100, status: "measured" },
    { id: "entity", label: "Entity Separation", rawValue: 100, maxValue: 100, status: "measured" },
    { id: "hallucination", label: "Hallucination Resistance", rawValue: 29, maxValue: 100, status: "measured" },
    { id: "deletion", label: "Deletion Compliance", rawValue: 0, maxValue: 100, status: "measured", explanation: "Does not honor explicit forget requests" },
  ],
  "llm-baseline": [
    { id: "stale", label: "Stale Memory Handling", rawValue: 100, maxValue: 100, status: "measured" },
    { id: "entity", label: "Entity Separation", rawValue: 100, maxValue: 100, status: "measured" },
    { id: "hallucination", label: "Hallucination Resistance", rawValue: 0, maxValue: 100, status: "not_supported", explanation: "Full context window always finds something to say" },
    { id: "deletion", label: "Deletion Compliance", rawValue: 0, maxValue: 100, status: "not_supported", explanation: "Cannot forget — full context always present" },
  ],
};

// ─────────────────────────────────────────────────────────
// Compute interpretation from raw data
// ─────────────────────────────────────────────────────────

export function computeInterpretation(
  rawValue: number | null,
  capabilityClaim: CapabilityClaim,
  subDimensions: SubDimension[],
): ScoreInterpretation {
  if (rawValue === null) {
    return { label: "not_applicable", summary: "Not yet tested." };
  }

  // Check if low score is driven by unsupported sub-dimensions
  const unsupportedDims = subDimensions.filter(
    (d) => d.status === "not_supported" || d.status === "not_claimed"
  );
  const measuredDims = subDimensions.filter((d) => d.status === "measured");
  const measuredAvg = measuredDims.length > 0
    ? measuredDims.reduce((a, d) => a + (d.rawValue ?? 0), 0) / measuredDims.length
    : 0;

  if (rawValue < 40 && unsupportedDims.length > 0 && measuredAvg > 40) {
    const unsupportedNames = unsupportedDims.map((d) => d.label).join(", ");
    return {
      label: "capability_limited",
      summary: `Low overall score driven by unsupported capabilities (${unsupportedNames}). Measured dimensions average ${Math.round(measuredAvg)}%.`,
    };
  }

  if (rawValue >= 90) return { label: "excellent", summary: "Exceptional performance across all tested dimensions." };
  if (rawValue >= 70) return { label: "strong", summary: "Strong performance on most dimensions." };
  if (rawValue >= 40) return { label: "average", summary: "Moderate performance with room for improvement." };
  if (rawValue > 0) return { label: "weak", summary: "Below average. Review failure traces for specific issues." };
  return { label: "weak", summary: "System did not pass any test items in this benchmark." };
}
