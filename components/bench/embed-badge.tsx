"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface EmbedBadgeProps {
  systemName: string;
  slug: string;
  bmi: number;
}

export function EmbedBadge({ systemName, slug, bmi }: EmbedBadgeProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const markdown = `[![Bench'd Verified: ${bmi.toFixed(1)} BMI](https://img.shields.io/badge/Bench'd_BMI-${bmi.toFixed(1)}-D9982B?style=flat&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0iIzExMSIvPjx0ZXh0IHg9IjgiIHk9IjIyIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0ic2VyaWYiIGZpbGw9IiNmZmYiIGZvbnQtd2VpZ2h0PSI2MDAiPkInPC90ZXh0PjwvcHZnPg==)](https://benchd.ai/system/${slug})`;

  const html = `<a href="https://benchd.ai/system/${slug}"><img src="https://img.shields.io/badge/Bench'd_BMI-${bmi.toFixed(1)}-D9982B?style=flat" alt="Bench'd Verified: ${bmi.toFixed(1)} BMI" /></a>`;

  function handleCopy(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="mt-6 border border-border rounded-xl p-5 bg-card">
      <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        Add badge to your README
      </h3>
      <p className="text-[9px] text-muted-foreground mb-3">
        Show your Bench&apos;d score on your GitHub repo.
      </p>

      {/* Preview */}
      <div className="mb-3 p-3 bg-secondary/50 rounded-lg flex items-center justify-center">
        <img
          src={`https://img.shields.io/badge/Bench'd_BMI-${bmi.toFixed(1)}-D9982B?style=flat`}
          alt={`Bench'd Verified: ${bmi.toFixed(1)} BMI`}
          className="h-5"
        />
      </div>

      <div className="space-y-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-muted-foreground font-medium">Markdown</span>
            <button
              onClick={() => handleCopy(markdown, "md")}
              className="text-[9px] text-muted-foreground hover:text-amber transition-colors flex items-center gap-1"
            >
              {copied === "md" ? <Check className="h-3 w-3 text-verified-green" /> : <Copy className="h-3 w-3" />}
              {copied === "md" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="bg-code-bg rounded p-2 text-[9px] font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {markdown}
          </pre>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] text-muted-foreground font-medium">HTML</span>
            <button
              onClick={() => handleCopy(html, "html")}
              className="text-[9px] text-muted-foreground hover:text-amber transition-colors flex items-center gap-1"
            >
              {copied === "html" ? <Check className="h-3 w-3 text-verified-green" /> : <Copy className="h-3 w-3" />}
              {copied === "html" ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="bg-code-bg rounded p-2 text-[9px] font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {html}
          </pre>
        </div>
      </div>
    </div>
  );
}
