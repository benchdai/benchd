"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "why-benchmarks", label: "Why These Benchmarks" },
  { id: "how-we-score", label: "How We Score" },
  { id: "two-score-model", label: "The Two-Score Model" },
  { id: "categories", label: "System Categories" },
  { id: "judge-protocol", label: "Judge Protocol" },
  { id: "versioning", label: "Versioning Policy" },
  { id: "signing", label: "How Signing Works" },
  { id: "verify-receipt", label: "Verify a Receipt Yourself" },
  { id: "controversies", label: "Known Controversies" },
  { id: "faq", label: "FAQ" },
];

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first section that is intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            // Prefer the one closest to the top
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Mobile: collapsible */}
      <div className="lg:hidden mb-8">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border bg-card text-sm font-medium text-foreground"
        >
          <span>Table of Contents</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              mobileOpen && "rotate-180"
            )}
          />
        </button>
        {mobileOpen && (
          <nav className="mt-2 rounded-lg border border-border bg-card p-3 space-y-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => handleClick(s.id)}
                className={cn(
                  "block w-full text-left px-3 py-1.5 rounded text-sm transition-colors",
                  activeId === s.id
                    ? "text-amber bg-amber/10 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <nav className="sticky top-24 space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-3">
            On this page
          </p>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleClick(s.id)}
              className={cn(
                "block w-full text-left px-3 py-1.5 rounded text-[13px] transition-all",
                activeId === s.id
                  ? "text-amber bg-amber/10 font-medium border-l-2 border-amber"
                  : "text-muted-foreground hover:text-foreground border-l-2 border-transparent"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
