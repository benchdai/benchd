"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";

type Variant = "inline" | "card";

export function NewsletterSignup({ variant = "card" }: { variant?: Variant }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const resp = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Signup failed");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Try again.");
    }
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {status === "success" ? (
          <div className="flex items-center gap-1.5 text-xs text-verified-green">
            <CheckCircle className="h-3.5 w-3.5" />
            <span>Subscribed</span>
          </div>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="h-8 px-3 text-xs bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber/50 focus:border-amber/50 w-48"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-8 px-3 text-xs font-medium rounded-md bg-amber text-primary-foreground hover:bg-amber/90 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              {status === "loading" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-3 w-3" />
                </>
              )}
            </button>
          </>
        )}
        {status === "error" && (
          <span className="text-[10px] text-destructive">{errorMsg}</span>
        )}
      </form>
    );
  }

  return (
    <div className="border border-amber/20 rounded-xl p-5 bg-gradient-to-br from-amber/[0.04] to-transparent relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber via-amber/60 to-amber/30 rounded-l-xl" />
      <div className="relative">
        <h3 className="text-sm font-semibold text-foreground">
          Stay in the loop
        </h3>
        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
          New benchmark results, methodology updates, and memory system rankings. No spam.
        </p>

        {status === "success" ? (
          <div className="flex items-center gap-2 mt-4 py-2 text-sm text-verified-green">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">You&apos;re subscribed. We&apos;ll be in touch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="flex-1 min-w-0 h-9 px-3 text-xs bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-amber/50 focus:border-amber/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="h-9 px-4 text-xs font-semibold rounded-lg bg-amber text-primary-foreground hover:bg-amber/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
            >
              {status === "loading" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-[10px] text-destructive mt-1.5">{errorMsg}</p>
        )}
        <p className="text-[9px] text-muted-foreground/60 mt-2">
          Unsubscribe anytime. We respect your inbox.
        </p>
      </div>
    </div>
  );
}
