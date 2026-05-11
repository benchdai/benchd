-- Systems indexed by Bench'd
CREATE TABLE systems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  vendor TEXT,
  description TEXT,
  github_url TEXT,
  website TEXT,
  docs_url TEXT,
  license TEXT,
  mcp_endpoint TEXT,
  mcp_compatible BOOLEAN DEFAULT false,
  trust_tier TEXT NOT NULL DEFAULT 'listed',
  source_type TEXT NOT NULL DEFAULT 'oss',
  github_stars INTEGER,
  last_tested TIMESTAMPTZ,
  scores JSONB,  -- null for listed systems
  sparkline_data JSONB DEFAULT '[]',
  adapter_status TEXT DEFAULT 'none',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Benchmark definitions
CREATE TABLE benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  description TEXT,
  paper_url TEXT,
  question_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Individual benchmark runs
CREATE TABLE runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id TEXT UNIQUE NOT NULL,
  system_id UUID REFERENCES systems(id),
  benchmark_id UUID REFERENCES benchmarks(id),
  harness_version TEXT,
  judge_model TEXT,
  judge_temperature REAL DEFAULT 0.0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'running',
  scores JSONB,
  summary JSONB,
  efficiency JSONB,
  retrieval JSONB,
  faithfulness JSONB,
  manifest_hash TEXT,
  signature TEXT,
  signing_key_fingerprint TEXT,
  signed_at TIMESTAMPTZ,
  signing_mode TEXT DEFAULT 'local',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Per-question failure traces
CREATE TABLE traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id TEXT REFERENCES runs(run_id),
  trace_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  dimension TEXT,
  query TEXT,
  raw_recall TEXT,
  generated_answer TEXT,
  response TEXT,
  expected_answer TEXT,
  scored_correct BOOLEAN,
  scoring_method TEXT,
  score REAL,
  max_score REAL,
  judge_reasoning TEXT,
  status TEXT,
  latency_ms REAL,
  recall_tokens INTEGER,
  ingest_tokens INTEGER,
  retrieval_hit BOOLEAN DEFAULT false,
  partial_hit BOOLEAN DEFAULT false,
  word_overlap REAL,
  answer_density REAL,
  compression_ratio REAL,
  grounded BOOLEAN DEFAULT false,
  hallucination_risk REAL,
  abstained BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE traces ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON systems FOR SELECT USING (true);
CREATE POLICY "Public read" ON benchmarks FOR SELECT USING (true);
CREATE POLICY "Public read" ON runs FOR SELECT USING (true);
CREATE POLICY "Public read" ON traces FOR SELECT USING (true);
