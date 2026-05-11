"use client";

import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, ShieldCheck, Users, Crown } from "lucide-react";
import type { TrustTier } from "@/lib/types";
import { cn } from "@/lib/utils";

const tierConfig: Record<
  TrustTier,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  listed: {
    label: "Listed",
    color: "text-[#6B7280]",
    bgColor: "bg-[#6B7280]/10",
    borderColor: "border-[#6B7280]/30",
    icon: Shield,
  },
  "unclaimed-self-reported": {
    label: "Self-Reported",
    color: "text-[#DC2626]",
    bgColor: "bg-[#DC2626]/10",
    borderColor: "border-[#DC2626]/30",
    icon: AlertTriangle,
  },
  "community-verified": {
    label: "Community-Verified",
    color: "text-[#3B82F6]",
    bgColor: "bg-[#3B82F6]/10",
    borderColor: "border-[#3B82F6]/30",
    icon: Users,
  },
  "vendor-verified": {
    label: "Vendor-Verified",
    color: "text-amber",
    bgColor: "bg-amber/10",
    borderColor: "border-amber/30",
    icon: ShieldCheck,
  },
  "partner-audited": {
    label: "Partner-Audited",
    color: "text-[#7C3AED]",
    bgColor: "bg-[#7C3AED]/10",
    borderColor: "border-[#7C3AED]/30",
    icon: Crown,
  },
};

interface TrustTierBadgeProps {
  tier: TrustTier;
  size?: "sm" | "md";
  className?: string;
}

export function TrustTierBadge({
  tier,
  size = "md",
  className,
}: TrustTierBadgeProps) {
  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 font-medium border",
        config.color,
        config.bgColor,
        config.borderColor,
        size === "sm" ? "text-[10px] px-1.5 py-0" : "text-xs px-2 py-0.5",
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      {config.label}
    </Badge>
  );
}
