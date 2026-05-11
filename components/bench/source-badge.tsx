"use client";

import { Badge } from "@/components/ui/badge";
import type { SourceType } from "@/lib/types";
import { cn } from "@/lib/utils";

const sourceConfig: Record<
  SourceType,
  { label: string; className: string }
> = {
  oss: {
    label: "OSS",
    className: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
  },
  "open-core": {
    label: "Open Core",
    className: "text-sky-400 border-sky-400/30 bg-sky-400/10",
  },
  "source-available": {
    label: "Source Available",
    className: "text-violet-400 border-violet-400/30 bg-violet-400/10",
  },
  closed: {
    label: "Closed",
    className: "text-zinc-400 border-zinc-400/30 bg-zinc-400/10",
  },
  framework: {
    label: "Framework",
    className: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  },
  research: {
    label: "Research",
    className: "text-pink-400 border-pink-400/30 bg-pink-400/10",
  },
};

interface SourceBadgeProps {
  source: SourceType;
  size?: "sm" | "md";
  className?: string;
}

export function SourceBadge({ source, size = "sm", className }: SourceBadgeProps) {
  const config = sourceConfig[source];
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        size === "sm" ? "text-[9px] px-1.5 py-0" : "text-[10px] px-2 py-0.5",
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
