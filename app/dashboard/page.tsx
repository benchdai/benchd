import Link from "next/link";
import { Shield, BarChart3, Clock, FileJson, ArrowRight, Lock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard",
  description: "Manage your Bench'd verification, view runs, and track scores.",
};

export default function DashboardPage() {
  // TODO: Add auth check — redirect to /claim if not authenticated
  // For now, show the dashboard layout with a "coming soon" state

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Vendor Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your system verification and benchmark results
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-amber" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber">
              Early Access
            </span>
          </div>
        </div>

        {/* Auth gate */}
        <div className="border border-amber/30 rounded-xl p-8 bg-gradient-to-br from-amber/[0.04] to-transparent mb-8">
          <div className="text-center max-w-md mx-auto">
            <Shield className="h-10 w-10 text-amber mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Vendor verification is launching soon
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              The vendor dashboard lets you claim your system, connect your endpoint,
              request official runs, and track your scores over time. We&apos;re onboarding
              vendors now.
            </p>
            <Link
              href="/claim"
              className="inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
            >
              Request Early Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Preview of what the dashboard will show */}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          What you&apos;ll get
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-amber" />
              <h4 className="text-sm font-semibold">System Profile Management</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>Claim and verify ownership of your system</li>
              <li>Update description, links, and MCP endpoint</li>
              <li>Add vendor notes to your profile page</li>
              <li>Manage your signing keys</li>
            </ul>
          </div>

          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4 text-amber" />
              <h4 className="text-sm font-semibold">Benchmark Results</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>View all runs with detailed score breakdowns</li>
              <li>Per-dimension analysis (recall, temporal, reasoning, reliability)</li>
              <li>Failure trace deep-dives</li>
              <li>Score trend over time</li>
            </ul>
          </div>

          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-amber" />
              <h4 className="text-sm font-semibold">Continuous Monitoring</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>Weekly automated benchmark runs</li>
              <li>Score regression alerts (email + webhook)</li>
              <li>GitHub PR status checks</li>
              <li>Performance comparison vs competitors</li>
            </ul>
          </div>

          <div className="border border-border rounded-xl p-5 bg-card">
            <div className="flex items-center gap-2 mb-3">
              <FileJson className="h-4 w-4 text-amber" />
              <h4 className="text-sm font-semibold">Signed Receipts</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>Cryptographically signed run manifests</li>
              <li>Co-signed with your vendor key + Bench&apos;d key</li>
              <li>Publicly verifiable by anyone</li>
              <li>Embed badge for your README</li>
            </ul>
          </div>
        </div>

        {/* Pricing link */}
        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-amber transition-colors"
          >
            View pricing plans <ArrowRight className="inline h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
