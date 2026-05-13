"use client";

import { systems } from "@/lib/data/systems";

interface MemoryMapChartProps {
  compact?: boolean;
  height?: number;
}

export function MemoryMapChart({ compact, height = 260 }: MemoryMapChartProps) {
  // Filter to systems with scores
  const scoredSystems = systems.filter((s) => s.scores !== null);

  // Compute efficiency: inverse of tokensPerCorrect, normalized 0-100
  // Systems without tokensPerCorrect get a default mid-range value
  const dataPoints = scoredSystems.map((s) => {
    const scores = s.scores!;
    const yValue = scores.bmi ?? scores.overallVerified;

    // Efficiency: lower tokensPerCorrect = more efficient
    // Normalize: efficiency = 100 - (tokensPerCorrect / maxTokensPerCorrect) * 100
    const tpc = scores.tokensPerCorrect;
    return {
      name: s.name,
      slug: s.slug,
      y: yValue,
      tokensPerCorrect: tpc ?? null,
      trustTier: s.trustTier,
      githubStars: s.githubStars,
    };
  });

  // Find max tokensPerCorrect for normalization
  const tpcValues = dataPoints
    .map((d) => d.tokensPerCorrect)
    .filter((v): v is number => v !== null);
  const maxTpc = tpcValues.length > 0 ? Math.max(...tpcValues) : 1000;

  const plotData = dataPoints.map((d) => {
    const efficiency =
      d.tokensPerCorrect !== null
        ? Math.max(0, Math.min(100, 100 - (d.tokensPerCorrect / maxTpc) * 100))
        : 50; // default mid-range if no data
    return { ...d, x: efficiency };
  });

  // SVG dimensions
  const padding = { top: 24, right: 20, bottom: 36, left: 40 };
  const width = 600;
  const svgHeight = height;
  const plotW = width - padding.left - padding.right;
  const plotH = svgHeight - padding.top - padding.bottom;

  // Scales
  const xMin = 0;
  const xMax = 100;
  const yMin = 0;
  const yMax = 100;

  const scaleX = (v: number) => padding.left + ((v - xMin) / (xMax - xMin)) * plotW;
  const scaleY = (v: number) => padding.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  // Baseline
  const baselineY = scaleY(57.6);

  // Quadrant midpoints for labels
  const midRight = scaleX(75);
  const midLeft = scaleX(25);
  const midTop = scaleY(80);
  const midBottom = scaleY(30);

  // Dot color by trust tier
  const dotColor = (tier: string) => {
    if (tier === "community-verified" || tier === "vendor-verified") return "var(--amber, #D97706)";
    return "#DC2626"; // self-reported / other
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Memory Performance Map
        </h3>
        <span className="text-[9px] text-muted-foreground">
          {plotData.length} scored systems
        </span>
      </div>
      <p className="text-[9px] text-muted-foreground mb-3">
        BMI vs Efficiency (inverse tokens-per-correct). Amber = independently verified. Red = self-reported.
      </p>

      <svg
        viewBox={`0 0 ${width} ${svgHeight}`}
        className="w-full"
        style={{ maxHeight: svgHeight }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((v) => (
          <line
            key={`xg-${v}`}
            x1={scaleX(v)}
            y1={padding.top}
            x2={scaleX(v)}
            y2={padding.top + plotH}
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        ))}
        {[0, 25, 50, 75, 100].map((v) => (
          <line
            key={`yg-${v}`}
            x1={padding.left}
            y1={scaleY(v)}
            x2={padding.left + plotW}
            y2={scaleY(v)}
            stroke="currentColor"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        ))}

        {/* Baseline horizontal line */}
        <line
          x1={padding.left}
          y1={baselineY}
          x2={padding.left + plotW}
          y2={baselineY}
          stroke="#D97706"
          strokeWidth={1.5}
          strokeDasharray="6 3"
          strokeOpacity={0.5}
        />
        <text
          x={padding.left + plotW + 2}
          y={baselineY + 3}
          fontSize={8}
          fill="#D97706"
          opacity={0.7}
        >
          57.6
        </text>

        {/* Quadrant labels */}
        {!compact && (
          <>
            <text x={midRight} y={midTop} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.15} fontWeight={600}>
              Efficient leaders
            </text>
            <text x={midLeft} y={midTop} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.15} fontWeight={600}>
              Accurate but expensive
            </text>
            <text x={midLeft} y={midBottom} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.15} fontWeight={600}>
              Needs work
            </text>
            <text x={midRight} y={midBottom} textAnchor="middle" fontSize={8} fill="currentColor" opacity={0.15} fontWeight={600}>
              Lightweight but incomplete
            </text>
          </>
        )}

        {/* Axis labels */}
        <text
          x={padding.left + plotW / 2}
          y={svgHeight - 4}
          textAnchor="middle"
          fontSize={9}
          fill="currentColor"
          opacity={0.4}
        >
          Efficiency (lower tokens-per-correct &rarr;)
        </text>
        <text
          x={12}
          y={padding.top + plotH / 2}
          textAnchor="middle"
          fontSize={9}
          fill="currentColor"
          opacity={0.4}
          transform={`rotate(-90, 12, ${padding.top + plotH / 2})`}
        >
          BMI Score
        </text>

        {/* X axis tick labels */}
        {[0, 25, 50, 75, 100].map((v) => (
          <text
            key={`xt-${v}`}
            x={scaleX(v)}
            y={padding.top + plotH + 14}
            textAnchor="middle"
            fontSize={8}
            fill="currentColor"
            opacity={0.3}
          >
            {v}
          </text>
        ))}

        {/* Y axis tick labels */}
        {[0, 25, 50, 75, 100].map((v) => (
          <text
            key={`yt-${v}`}
            x={padding.left - 6}
            y={scaleY(v) + 3}
            textAnchor="end"
            fontSize={8}
            fill="currentColor"
            opacity={0.3}
          >
            {v}
          </text>
        ))}

        {/* Data points */}
        {plotData.map((d) => (
          <circle
            key={d.slug}
            cx={scaleX(d.x)}
            cy={scaleY(d.y)}
            r={5}
            fill={dotColor(d.trustTier)}
            fillOpacity={0.8}
            stroke={dotColor(d.trustTier)}
            strokeWidth={1}
            strokeOpacity={0.3}
          >
            <title>{`${d.name}: BMI ${d.y.toFixed(1)}, Efficiency ${d.x.toFixed(0)}`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
