import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bench'd — The neutral benchmark for AI memory systems";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
        {/* Amber gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -50,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,152,43,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            right: -50,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(217,152,43,0.1) 0%, transparent 70%)",
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
            justifyContent: "center",
            padding: "80px 80px",
            flex: 1,
          }}
        >
          {/* Brand pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 32,
                height: 4,
                borderRadius: 2,
                background: "#D9982B",
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                color: "#D9982B",
              }}
            >
              Independent Benchmark Authority
            </span>
          </div>

          {/* Logo wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontSize: 72,
              fontWeight: 700,
              fontFamily: "Georgia, serif",
              color: "white",
              lineHeight: 1.1,
            }}
          >
            Bench
            <span style={{ color: "#D9982B" }}>&apos;</span>d
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.6)",
              marginTop: 16,
              lineHeight: 1.4,
              maxWidth: 600,
            }}
          >
            The scoreboard for AI memory.
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 48,
              marginTop: 48,
            }}
          >
            {[
              { value: "36", label: "Systems Indexed" },
              { value: "4", label: "Independently Scored" },
              { value: "13", label: "Signed Manifests" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 800,
                    color: "#D9982B",
                    fontFamily: "monospace",
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.1em",
                    fontWeight: 600,
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 80px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            benchd.ai
          </span>
          <span
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Every score cryptographically signed & verifiable
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
