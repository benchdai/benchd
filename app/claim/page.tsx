"use client";

import { ShieldCheck, Plug, Play, Mail } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ShieldCheck,
    title: "Verify ownership",
    description:
      "Prove you represent the vendor via DNS TXT record, a GitHub file in your official repo, or OAuth through your official email domain.",
  },
  {
    number: 2,
    icon: Plug,
    title: "Connect your endpoint",
    description:
      "Provide an MCP or REST API endpoint so the Bench'd harness can run evaluations directly against your system.",
  },
  {
    number: 3,
    icon: Play,
    title: "Request an official Bench'd run",
    description:
      "Once verified, request a signed benchmark run. Results are published with a cryptographic receipt — identical to every other system on the leaderboard.",
  },
];

export default function ClaimPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      {/* Page header */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-amber mb-2">
          Vendor Verification
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-serif">
          Claim Your System
        </h1>
        <p className="mt-4 text-muted-foreground text-base leading-relaxed font-serif max-w-lg mx-auto">
          Connect your official endpoint and verify your results against the
          public harness.
        </p>
      </div>

      {/* Steps */}
      <div className="max-w-2xl mx-auto space-y-6 mb-16">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-lg border border-border bg-card shadow-sm overflow-hidden"
          >
            <div className="flex items-start gap-4 p-5">
              <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-amber/10 text-amber font-bold text-sm">
                {step.number}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="h-4 w-4 text-amber" />
                  <h2 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h2>
                </div>
                <p className="font-serif text-[15px] leading-relaxed text-foreground/85">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Request access form */}
      <div className="max-w-md mx-auto">
        <div className="rounded-lg border border-border bg-card shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-amber" />
            <h3 className="text-sm font-semibold text-foreground">
              Request Early Access
            </h3>
          </div>
          <p className="font-serif text-sm text-muted-foreground mb-4">
            Enter your work email and we'll reach out when vendor verification
            opens.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2"
          >
            <input
              type="email"
              placeholder="you@vendor.com"
              className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
            />
            <button
              type="submit"
              className="h-9 px-4 text-sm font-medium rounded-md bg-amber text-primary-foreground hover:bg-amber/90 transition-colors"
            >
              Request Access
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 font-serif">
          Bench'd is in early access. We'll notify you when vendor verification
          is available.
        </p>
      </div>
    </div>
  );
}
