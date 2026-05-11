"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { systems, runs } from "@/lib/data/index";
import { benchmarks } from "@/lib/data/benchmarks";
import {
  BarChart3,
  FileText,
  Shield,
  BookOpen,
  Receipt,
  Search,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Bench'd... Systems, Benchmarks, receipts..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => navigate("/")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Homepage
          </CommandItem>
          <CommandItem onSelect={() => navigate("/leaderboard")}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Leaderboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/methodology")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Methodology
          </CommandItem>
          <CommandItem onSelect={() => navigate("/trust")}>
            <Shield className="mr-2 h-4 w-4" />
            Trust & Verification
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Systems">
          {systems.map((system) => (
            <CommandItem
              key={system.id}
              onSelect={() => navigate(`/system/${system.slug}`)}
            >
              <Search className="mr-2 h-4 w-4" />
              {system.name}
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {system.scores ? system.scores.overallVerified.toFixed(1) : "Listed"}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Benchmarks">
          {benchmarks.map((benchmark) => (
            <CommandItem
              key={benchmark.id}
              onSelect={() => navigate(`/benchmark/${benchmark.slug}`)}
            >
              <FileText className="mr-2 h-4 w-4" />
              {benchmark.name} {benchmark.version}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent Receipts">
          {runs.slice(0, 5).map((run) => (
            <CommandItem
              key={run.id}
              onSelect={() => navigate(`/receipt/${run.id}`)}
            >
              <Receipt className="mr-2 h-4 w-4" />
              {run.systemName} — {run.benchmarkName}
              <span className="ml-auto text-xs text-muted-foreground font-mono">
                {run.id.slice(0, 12)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
