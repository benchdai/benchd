import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Six Memory Systems, One Benchmark — Bench'd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RESULTS = [
  { name: "LlamaIndex", score: 59.0 },
  { name: "LangChain", score: 59.0 },
  { name: "LLM Baseline", score: 57.6 },
  { name: "AutoGPT", score: 47.4 },
  { name: "Mem0 OSS", score: 32.4 },
  { name: "Cognee", score: 20.0 },
  { name: "Graphiti", score: 0.0 },
];

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#111111",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            left: -50,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,152,43,0.1) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(to right, transparent, #D9982B, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "50px 80px",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 24, height: 3, borderRadius: 2, background: "#D9982B" }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#D9982B" }}>
              Bench&apos;d Results
            </span>
          </div>

          <div style={{ fontSize: 38, fontWeight: 700, fontFamily: "Georgia, serif", color: "white", lineHeight: 1.15, maxWidth: 600 }}>
            Six Memory Systems, One Benchmark
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 32 }}>
            {RESULTS.map((r) => (
              <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.6)", width: 100 }}>{r.name}</span>
                <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.05)", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${Math.max(r.score, 0.5)}%`,
                      background: r.score >= 57.6 ? "rgba(217,152,43,0.6)" : r.score > 0 ? "rgba(217,152,43,0.25)" : "rgba(220,38,38,0.3)",
                      borderRadius: 3,
                    }}
                  />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, fontFamily: "monospace", color: r.score >= 57.6 ? "#D9982B" : r.score > 0 ? "rgba(255,255,255,0.5)" : "#DC2626", width: 50, textAlign: "right" as const }}>
                  {r.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 80px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>benchd.ai</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>LongMemEval v1.0 · 500 questions · Independent results</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
