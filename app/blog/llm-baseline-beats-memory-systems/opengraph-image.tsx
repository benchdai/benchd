import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "A Raw LLM Beats Most Memory Systems on LongMemEval — Bench'd";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RESULTS = [
  { name: "LlamaIndex", score: 59.0 },
  { name: "LLM Baseline", score: 57.6 },
  { name: "LangChain", score: 34.0 },
  { name: "Mem0 OSS", score: 32.4 },
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
        {/* Amber gradient */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,152,43,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
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

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "60px 80px",
            flex: 1,
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <div style={{ width: 24, height: 3, borderRadius: 2, background: "#D9982B" }} />
            <span
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
                color: "#D9982B",
              }}
            >
              Bench&apos;d Blog
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              color: "white",
              lineHeight: 1.15,
              maxWidth: 700,
            }}
          >
            A Raw LLM Beats Most Memory Systems on LongMemEval
          </div>

          {/* Bar chart */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginTop: 40,
            }}
          >
            {RESULTS.map((r) => (
              <div
                key={r.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    width: 130,
                  }}
                >
                  {r.name}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 28,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 4,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      height: "100%",
                      width: `${r.score}%`,
                      background: r.name === "LLM Baseline"
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(217,152,43,0.5)",
                      borderRadius: 4,
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: r.name === "LLM Baseline" ? "white" : "#D9982B",
                    width: 60,
                    textAlign: "right" as const,
                  }}
                >
                  {r.score.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 80px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.3)" }}>benchd.ai</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>LongMemEval v1.0 · 500 questions · GPT-4o-mini</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
