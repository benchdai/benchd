import Link from "next/link";
import { Logo, LogoTagline } from "@/components/bench/logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo size="sm" className="mb-2" />
            <LogoTagline className="mb-3 block" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              The neutral benchmark for AI memory systems. All scores are
              independently run when marked Community-Verified, Vendor-Verified,
              or Partner-Audited. Listed and Self-Reported systems are clearly
              labeled.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Links
            </h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/leaderboard"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/trust"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Trust & Verification
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/benchd-ai/harness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Harness (GitHub)
                </a>
              </li>
              <li>
                <Link
                  href="/opt-out"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Opt-out
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Signing Keys
            </h3>
            <div className="space-y-1">
              <p className="font-mono text-[10px] text-muted-foreground break-all">
                Primary: 7f8a...3d2e
              </p>
              <p className="font-mono text-[10px] text-muted-foreground break-all">
                Secondary: a4c1...8f7b
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            Verification powered by{" "}
            <a
              href="https://verifiedstate.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground underline underline-offset-2"
            >
              VerifiedState
            </a>
          </p>
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Bench&apos;d
          </p>
        </div>
      </div>
    </footer>
  );
}
