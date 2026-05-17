# Bench'd

The neutral benchmark for AI memory systems. Every score is independently run, cryptographically signed, and verifiable by anyone. Spend attestation powered by [ProofMeter](https://benchd.ai/methodology/receipt-spec) (Patent Pending).

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's Built (v1)

Six launch pages with typed mock data:

| Page | Route | Description |
|------|-------|-------------|
| Homepage | `/` | Hero, latest verified runs feed, top 5 leaderboard, "Why two scores?" explainer |
| Leaderboard | `/leaderboard` | Compact/Detailed views, filters, search, sort, mobile card layout |
| System Profile | `/system/[slug]` | Score cards, Scores/History/Failures/Notes tabs, gap analysis traces |
| Receipt | `/receipt/[run_id]` | Full manifest JSON, Ed25519 signature, verification widget, share button |
| Methodology | `/methodology` | Long-form editorial with sticky TOC, Two-Score Model, Known Controversies |
| Trust | `/trust` | Signing keys, tabbed verification code (bash/Python/JS), key rotation log |

### Global Elements

- Header with nav and `Cmd+K` button
- `Cmd+K` command palette (search systems, benchmarks, receipts, pages)
- Sonner toast notifications for copy/verification actions
- Footer with signing key fingerprints and VerifiedState credit

## Deferred

### v1.5 (4-8 weeks post-launch)
- `/benchmark/[slug]` — Benchmark detail pages
- `/compare/[slug-a]-vs-[slug-b]` — Auto-generated comparison pages
- `/run` — Run benchmark page (BYOK + rate-limited)

### v2 (when traffic justifies)
- `/submit` — Submit new system
- `/claim/[system]` — Vendor claim flow (DNS TXT, GitHub, OAuth)
- `/opt-out` — Vendor opt-out form
- `/spec` — Adapter specification

## Mock Data

All data lives in `lib/data/` with TypeScript types in `lib/types.ts`:

| File | Contents |
|------|----------|
| `lib/data/systems.ts` | 8 seeded systems (Mem0, Letta, Zep, MemPalace, Mastra, ByteRover, OMEGA, MemMachine) |
| `lib/data/benchmarks.ts` | 3 benchmarks (LongMemEval, LoCoMo, PersonaMem v2) |
| `lib/data/runs.ts` | 16 sample runs with full manifests and fake Ed25519 signatures |
| `lib/data/failures.ts` | 40+ failure traces with conversation histories, queries, expected answers |

Each file exports typed arrays and lookup helpers (e.g., `getSystemBySlug`, `getRunById`).

## Swapping Mock Data for Supabase

Every component receives data as typed props. To connect Supabase:

1. Install `@supabase/supabase-js` and `@supabase/ssr`
2. Create `lib/supabase.ts` with your client
3. Replace the mock data imports in each page's server component:
   ```diff
   - import { systems } from "@/lib/data/systems";
   + import { createClient } from "@/lib/supabase";
   + const supabase = createClient();
   + const { data: systems } = await supabase.from("systems").select("*");
   ```
4. Component props stay the same — no component changes needed
5. Types in `lib/types.ts` map directly to the database schema in the master brief

## Design System

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Primary/Amber | `#FFB800` | Verified scores, CTAs, active states, Vendor-Verified tier |
| Verified Green | `#00C87A` | Cryptographic verification success only |
| Listed | `#6B7280` | Listed tier badge |
| Self-Reported | `#DC2626` | Unclaimed Self-Reported tier badge |
| Community | `#3B82F6` | Community-Verified tier badge |
| Partner | `#7C3AED` | Partner-Audited tier badge |

### Fonts
| Font | CSS Variable | Usage |
|------|-------------|-------|
| Inter | `--font-sans` | UI chrome, headings, labels |
| Merriweather | `--font-serif` | Editorial/methodology body copy |
| JetBrains Mono | `--font-mono` | Scores, IDs, manifests, code, timestamps |

### Key Components
| Component | Path | Usage |
|-----------|------|-------|
| `TrustTierBadge` | `components/bench/trust-tier-badge.tsx` | Trust tier with icon + color |
| `ScorePair` / `ScoreCard` | `components/bench/score-pair.tsx` | Verified + Nuance score display |
| `Sparkline` | `components/bench/sparkline.tsx` | SVG sparkline for score trends |
| `CodeBlock` | `components/bench/code-block.tsx` | Monospace code with copy/download |
| `FailureRow` | `components/bench/failure-row.tsx` | Expandable failure trace row |
| `CommandPalette` | `components/bench/command-palette.tsx` | Cmd+K search overlay |

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui (new-york style)
- pnpm
