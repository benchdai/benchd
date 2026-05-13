"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, Shield, Zap, Building2 } from "lucide-react";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 299,
    yearlyPrice: 2999,
    period: "mo",
    icon: Shield,
    description: "One benchmark run per month against your production system",
    cta: "Get Started",
    ctaLink: "/claim",
    highlight: false,
    features: [
      "1 full benchmark run per month",
      "LongMemEval + LOCOMO + Reliability suite",
      "Cryptographically signed receipt",
      "Detailed failure analysis report",
      "\"Vendor-Verified\" badge on leaderboard",
      "Per-dimension score breakdown",
      "Efficiency metrics (latency, tokens, cost)",
      "Results published within 48 hours",
    ],
  },
  {
    name: "Continuous",
    monthlyPrice: 699,
    yearlyPrice: 6999,
    period: "mo",
    icon: Zap,
    description: "Weekly automated runs with regression monitoring",
    cta: "Start Monitoring",
    ctaLink: "/claim",
    highlight: true,
    features: [
      "Everything in Starter",
      "Weekly automated benchmark runs",
      "Score regression alerts (email + webhook)",
      "Performance-over-time dashboard",
      "GitHub PR status checks (Bench'd CI)",
      "README embed badge with live score",
      "Vendor dashboard with historical data",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: 3999.99,
    yearlyPrice: 39999,
    period: "mo",
    icon: Building2,
    description: "Custom benchmarks and dedicated engineering support",
    cta: "Contact Us",
    ctaLink: "mailto:hello@benchd.ai?subject=Enterprise%20Plan",
    highlight: false,
    features: [
      "Everything in Continuous",
      "Custom benchmark suites for your use case",
      "Dedicated adapter engineering",
      "Priority scheduling (same-day runs)",
      "Co-branded benchmark reports",
      "\"Partner-Audited\" badge (highest trust tier)",
      "Multi-system support (test your full stack)",
      "Dedicated account manager",
      "Custom SLA",
    ],
  },
];

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price % 1 === 0
      ? `$${price.toLocaleString("en-US")}`
      : `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  }
  return `$${price}`;
}

function yearlySavings(monthly: number, yearly: number): string {
  const saved = monthly * 12 - yearly;
  return `$${saved.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
          Pricing
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mt-3">
          Independent verification<br />your customers can trust
        </h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          Self-reported scores get flagged. Bench&apos;d-verified scores get trusted.
          Every run is cryptographically signed and publicly verifiable.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <button
          onClick={() => setBilling("monthly")}
          className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
            billing === "monthly"
              ? "bg-amber/10 text-amber border border-amber/30 font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`px-4 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 ${
            billing === "yearly"
              ? "bg-amber/10 text-amber border border-amber/30 font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Yearly
          <span className="text-[9px] font-semibold bg-verified-green/10 text-verified-green px-1.5 py-0.5 rounded-full">
            Save ~17%
          </span>
        </button>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const period = billing === "monthly" ? "/mo" : "/yr";
          const savings = billing === "yearly" ? yearlySavings(plan.monthlyPrice, plan.yearlyPrice) : null;

          return (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-amber/40 bg-gradient-to-b from-amber/[0.04] to-transparent ring-1 ring-amber/20 relative"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[9px] font-semibold uppercase tracking-wider bg-amber text-primary-foreground px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4.5 w-4.5 ${plan.highlight ? "text-amber" : "text-muted-foreground"}`} />
                <h2 className="text-sm font-semibold text-foreground">{plan.name}</h2>
              </div>

              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-mono text-4xl font-bold text-foreground tabular-nums">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-muted-foreground">{period}</span>
              </div>

              {savings && (
                <span className="text-[10px] text-verified-green font-medium mb-3">
                  Save {savings}/yr
                </span>
              )}
              {!savings && <div className="mb-3" />}

              <p className="text-xs text-muted-foreground mb-6">{plan.description}</p>

              <Link
                href={plan.ctaLink}
                className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  plan.highlight
                    ? "bg-amber text-primary-foreground hover:bg-amber/90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
              >
                {plan.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <div className="mt-6 pt-6 border-t border-border space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-xs">
                    <Check className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${plan.highlight ? "text-amber" : "text-muted-foreground"}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-16">
        <h2 className="font-serif text-xl font-semibold text-center mb-8">
          Common Questions
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "What's the difference between community-verified and vendor-verified?",
              a: "Community-verified means we ran your open-source code ourselves. Vendor-verified means you connected your production endpoint and we ran against it — co-signed with both your key and ours. Vendor-verified scores reflect your actual production system, not just the OSS version.",
            },
            {
              q: "What benchmarks do you run?",
              a: "The full suite includes LongMemEval (500 questions — recall, temporal, reasoning), LOCOMO (1,540 questions — multi-session memory), and the Bench'd Reliability benchmark (25 adversarial trap questions — hallucination, stale memory, entity confusion, deletion compliance).",
            },
            {
              q: "How long does a run take?",
              a: "A full benchmark suite takes 30-90 minutes depending on your system's latency. Results are published within 48 hours of completion.",
            },
            {
              q: "Can I dispute a score?",
              a: "Yes. Every run produces a signed receipt with every input, output, and judge reasoning. If you believe a score is unfair, we review the traces together.",
            },
            {
              q: "What if my system scores below the LLM baseline?",
              a: "That's a real result and it will be published. The LLM baseline (57.6%) represents what you'd get with no memory system at all. We include detailed failure traces to help you diagnose why.",
            },
            {
              q: "Do you offer custom benchmarks?",
              a: "Yes, on the Enterprise plan. We'll design benchmark questions for your specific use case — customer support memory, coding agent context, sales pipeline recall, etc.",
            },
          ].map((item) => (
            <details key={item.q} className="border border-border rounded-lg bg-card group">
              <summary className="px-4 py-3 text-sm font-semibold text-foreground cursor-pointer hover:text-amber transition-colors list-none flex items-center justify-between">
                {item.q}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-open:rotate-90 transition-transform shrink-0 ml-2" />
              </summary>
              <p className="px-4 pb-3 text-xs text-muted-foreground leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-14">
        <p className="text-xs text-muted-foreground mb-3">
          Not sure which plan is right? We&apos;re happy to help.
        </p>
        <a
          href="mailto:hello@benchd.ai?subject=Pricing%20Question"
          className="text-sm text-amber hover:text-amber/80 font-medium"
        >
          hello@benchd.ai
        </a>
      </div>
    </div>
  );
}
