"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Command } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/bench/theme-toggle";
import { Logo, LogoTagline } from "@/components/bench/logo";

const navItems = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/methodology", label: "Methodology" },
  { href: "/trust", label: "Trust" },
  { href: "/run", label: "Run" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Logo size="md" />
            </Link>
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-md transition-colors",
                    pathname === item.href
                      ? "text-amber font-medium bg-amber/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "k", metaKey: true })
                );
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-muted-foreground border border-border rounded-md hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </button>
            <Link
              href="/claim"
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
            >
              Claim
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
