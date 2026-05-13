export type TrustTier =
  | "listed"
  | "unclaimed-self-reported"
  | "community-verified"
  | "vendor-verified"
  | "partner-audited";

export type SourceType =
  | "oss"
  | "open-core"
  | "source-available"
  | "closed"
  | "framework"
  | "research";

export interface System {
  id: string;
  slug: string;
  name: string;
  vendor: string;
  description: string;
  githubUrl: string | null;
  website: string | null;
  docsUrl: string | null;
  license: string | null;
  mcpEndpoint: string | null;
  mcpCompatible: boolean;
  trustTier: TrustTier;
  sourceType: SourceType;
  githubStars: number | null;
  lastTested: string; // ISO date
  scores: SystemScores | null; // null for listed systems with no Bench'd scores
  sparklineData: number[];
  createdAt: string;
  adapterStatus?: "native" | "community" | "none";
}

export interface SystemScores {
  recallVerified: number;
  recallNuance: number;
  temporalVerified: number;
  temporalNuance: number;
  reasoningVerified: number;
  reasoningNuance: number;
  overallVerified: number;
  overallNuance: number;
  // Efficiency metrics (from harness runs)
  avgLatencyMs?: number;
  tokensPerCorrect?: number;
  avgRecallTokens?: number;
  // BMI = Bench'd Memory Index (weighted composite)
  bmi?: number;
}

export interface Benchmark {
  id: string;
  slug: string;
  name: string;
  version: string;
  paperUrl: string | null;
  description: string;
  subTests: SubTest[];
  judgeProtocol: JudgeProtocol;
  createdAt: string;
}

export interface SubTest {
  slug: string;
  name: string;
  dimension: "recall" | "temporal" | "reasoning";
  scoringMethod: "exact" | "regex" | "llm";
  maxScore: number;
}

export interface JudgeProtocol {
  model: string;
  temperature: number;
  promptVersion: string;
}

export interface Run {
  id: string;
  systemId: string;
  systemName: string;
  benchmarkId: string;
  benchmarkName: string;
  harnessVersion: string;
  judgeModel: string;
  startedAt: string;
  completedAt: string;
  status: "completed" | "failed" | "running";
  verifiedOverall: number;
  nuanceOverall: number;
  signedReceiptUrl: string;
  merkleRoot: string;
  signature: string;
  manifest: RunManifest;
}

export interface RunManifest {
  version: string;
  runId: string;
  systemId: string;
  systemName: string;
  benchmarkId: string;
  benchmarkName: string;
  benchmarkVersion: string;
  harnessVersion: string;
  judgeModel: string;
  judgeTemperature: number;
  startedAt: string;
  completedAt: string;
  scores: {
    verified: {
      recall: number;
      temporal: number;
      reasoning: number;
      overall: number;
    };
    nuance: {
      recall: number;
      temporal: number;
      reasoning: number;
      overall: number;
    };
  };
  questionCount: number;
  passCount: number;
  failCount: number;
  merkleRoot: string;
}

export interface FailureTrace {
  id: string;
  runId: string;
  questionId: string;
  questionNumber: number;
  questionSummary: string;
  ingestHistory: ConversationTurn[];
  query: string;
  response: string;
  expectedAnswer: string;
  scoredCorrect: boolean;
  scoringMethod: "exact" | "regex" | "llm";
  judgeReasoning: string | null;
  traceId: string;
}

export interface ConversationTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface SigningKey {
  fingerprint: string;
  publicKey: string;
  algorithm: string;
  createdAt: string;
  status: "active" | "rotated" | "revoked";
  rotatedAt?: string;
}
