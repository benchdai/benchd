/**
 * Bench'd data index — merges mock data with real harness-generated data.
 *
 * This file is the single import point for all pages.
 * As real benchmark runs replace mock data, this file handles the merge.
 */

import { systems as mockSystems, getSystemBySlug as _getSystemBySlug } from "./systems";
import { runs as mockRuns, getRunById as _getRunById, getRunsBySystemId as _getRunsBySystemId } from "./runs";
import { failures as mockFailures, getFailuresByRunId as _getFailuresByRunId, getFailuresBySystemSlug as _getFailuresBySystemSlug } from "./failures";
import type { System, SystemScores } from "@/lib/types";

// Try to import generated data (may not exist yet)
let generatedRuns: any[] = [];
let generatedFailures: any[] = [];

try {
  const genRuns = require("./generated/generated_runs");
  generatedRuns = genRuns.generatedRuns || [];
} catch {
  // No generated data yet
}

try {
  const genFailures = require("./generated/generated_failures");
  generatedFailures = genFailures.generatedFailures || [];
} catch {
  // No generated data yet
}

/**
 * Real Bench'd-run scores from the harness.
 * These override mock data for systems we've actually tested.
 *
 * System slug → real scores + trust tier upgrade
 */
const BENCHD_VERIFIED_SCORES: Record<string, {
  scores: SystemScores;
  trustTier: "community-verified";
  description?: string;
}> = {
  // LlamaIndex Memory — 59.0% on full 500q LongMemEval
  "llamaindex-memory": {
    trustTier: "community-verified",
    scores: {
      recallVerified: 59.0,
      recallNuance: 59.0,
      temporalVerified: 59.0,
      temporalNuance: 59.0,
      reasoningVerified: 59.0,
      reasoningNuance: 59.0,
      overallVerified: 59.0,
      overallNuance: 59.0,
    },
  },
  // LangChain Memory — 34.0% on 50q sample (full run pending)
  "langchain-memory": {
    trustTier: "community-verified",
    scores: {
      recallVerified: 34.0,
      recallNuance: 34.0,
      temporalVerified: 34.0,
      temporalNuance: 34.0,
      reasoningVerified: 34.0,
      reasoningNuance: 34.0,
      overallVerified: 34.0,
      overallNuance: 34.0,
    },
  },
  // Mem0 OSS — 32.4% on full 500q LongMemEval (their managed platform claims 93.4%)
  "mem0": {
    trustTier: "community-verified",
    scores: {
      recallVerified: 32.4,
      recallNuance: 32.4,
      temporalVerified: 32.4,
      temporalNuance: 32.4,
      reasoningVerified: 32.4,
      reasoningNuance: 32.4,
      overallVerified: 32.4,
      overallNuance: 32.4,
    },
  },
};

/**
 * LLM Baseline — not a memory system, but the critical comparison.
 * Added as a special system to show "raw context window" performance.
 */
const LLM_BASELINE_SYSTEM: System = {
  id: "sys_llm_baseline",
  slug: "llm-baseline",
  name: "LLM Baseline (GPT-4o-mini)",
  vendor: "No memory system",
  description:
    "Raw LLM context window with no memory system. All conversation turns fed directly into the model. This is the baseline every memory system must beat to justify existing.",
  githubUrl: null,
  website: null,
  docsUrl: null,
  license: null,
  mcpEndpoint: null,
  mcpCompatible: false,
  trustTier: "community-verified",
  sourceType: "research",
  systemType: "baseline",
  githubStars: null,
  lastTested: "2026-05-11",
  scores: {
    recallVerified: 57.6,
    recallNuance: 57.6,
    temporalVerified: 57.6,
    temporalNuance: 57.6,
    reasoningVerified: 57.6,
    reasoningNuance: 57.6,
    overallVerified: 57.6,
    overallNuance: 57.6,
  },
  sparklineData: [],
  createdAt: "2026-05-11T00:00:00Z",
  adapterStatus: "native",
};

/**
 * Merged systems list — applies real Bench'd scores where available.
 */
export const systems: System[] = [
  LLM_BASELINE_SYSTEM,
  ...mockSystems.map((sys) => {
    const override = BENCHD_VERIFIED_SCORES[sys.slug];
    if (override) {
      return {
        ...sys,
        scores: override.scores,
        trustTier: override.trustTier,
        lastTested: "2026-05-11",
        sparklineData: [],
      } as System;
    }
    return sys;
  }),
];

export function getSystemBySlug(slug: string): System | undefined {
  return systems.find((s) => s.slug === slug);
}

/** All runs — mock + generated */
export const runs = [...mockRuns, ...generatedRuns];

export function getRunById(id: string) {
  return runs.find((r: any) => r.id === id);
}

export function getRunsBySystemId(systemId: string) {
  return runs.filter((r: any) => r.systemId === systemId);
}

/** All failures — mock + generated */
export const failures = [...mockFailures, ...generatedFailures];

export function getFailuresByRunId(runId: string) {
  return failures.filter((f: any) => f.runId === runId);
}

export function getFailuresBySystemSlug(slug: string) {
  return failures.filter((f: any) => {
    const sys = systems.find((s) => s.slug === slug);
    if (!sys) return false;
    const sysRuns = runs.filter((r: any) => r.systemId === sys.id);
    return sysRuns.some((r: any) => r.id === f.runId);
  });
}
