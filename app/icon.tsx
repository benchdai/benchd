import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "#111111",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: "Georgia, serif",
            fontSize: 20,
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          <span style={{ color: "white" }}>B</span>
          <span style={{ color: "#D9982B" }}>&apos;</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 3,
            left: 6,
            right: 6,
            height: 2,
            borderRadius: 1,
            background: "#D9982B",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
