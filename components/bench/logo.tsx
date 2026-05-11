"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const sizes = {
    sm: { box: "w-7 h-7", letter: "text-[14px]", text: "text-xl", underbar: "h-[2px] w-5" },
    md: { box: "w-8 h-8", letter: "text-[16px]", text: "text-2xl", underbar: "h-[2px] w-6" },
    lg: { box: "w-10 h-10", letter: "text-[20px]", text: "text-3xl", underbar: "h-[3px] w-8" },
  };

  const s = sizes[size];

  // Icon mark only (for favicon, small spaces)
  if (variant === "icon") {
    return (
      <div className={cn("flex flex-col items-center shrink-0", className)}>
        <div
          className={cn(
            "inline-flex items-center justify-center rounded-lg bg-charcoal dark:bg-foreground",
            s.box
          )}
        >
          <span className={cn("font-serif font-semibold leading-none text-white dark:text-charcoal", s.letter)}>
            B<span className="text-amber">&apos;</span>
          </span>
        </div>
        <div className={cn("bg-amber rounded-full mt-1", s.underbar)} />
      </div>
    );
  }

  // Full logo: just the wordmark, no icon box
  return (
    <div className={cn("flex items-center", className)}>
      <span className={cn("font-serif font-bold tracking-tight text-foreground leading-none", s.text)}>
        Bench<span className="text-amber">&apos;</span>d
      </span>
    </div>
  );
}

export function LogoTagline({ className }: { className?: string }) {
  return (
    <span className={cn("text-[9px] uppercase tracking-[0.12em] text-stone font-medium", className)}>
      AI Memory Systems Benchmark Authority
    </span>
  );
}
