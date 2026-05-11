"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showCopy?: boolean;
  showDownload?: boolean;
  downloadFilename?: string;
  maxHeight?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language,
  title,
  showCopy = true,
  showDownload = false,
  downloadFilename = "download.txt",
  maxHeight = "400px",
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${downloadFilename}`);
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-code-bg overflow-hidden",
        className
      )}
    >
      {(title || showCopy || showDownload) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-code-bg-deep">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-xs font-mono text-muted-foreground">
                {title}
              </span>
            )}
            {language && (
              <span className="text-[10px] font-mono text-muted-foreground/60 uppercase">
                {language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}
            {showCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-verified-green" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}
      <div
        className="overflow-auto p-4"
        style={{ maxHeight }}
      >
        <pre className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
