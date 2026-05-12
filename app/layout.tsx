import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/bench/header";
import { Ticker } from "@/components/bench/ticker";
import { Footer } from "@/components/bench/footer";
import { CommandPalette } from "@/components/bench/command-palette";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Bench'd — The neutral benchmark for AI memory systems",
    template: "%s | Bench'd",
  },
  description:
    "Every score is independently run, cryptographically signed, and verifiable by anyone. Open harness, open methodology, signed receipts.",
  metadataBase: new URL("https://benchd.ai"),
  keywords: [
    "AI memory benchmark",
    "memory systems",
    "LLM memory",
    "AI benchmark",
    "LongMemEval",
    "conversational memory",
    "LlamaIndex",
    "LangChain",
    "Mem0",
    "vector memory",
    "agent memory",
  ],
  authors: [{ name: "Bench'd" }],
  creator: "Bench'd",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://benchd.ai",
    siteName: "Bench'd",
    title: "Bench'd — The scoreboard for AI memory",
    description:
      "Independent, reproducible benchmarks for AI memory systems. Cryptographically signed results. Open methodology.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bench'd — The scoreboard for AI memory",
    description:
      "Independent, reproducible benchmarks for AI memory systems. Cryptographically signed results.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://benchd.ai",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plexMono.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('benchd-theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <Header />
        <Ticker />
        <main className="flex-1">{children}</main>
        <Footer />
        <CommandPalette />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </body>
    </html>
  );
}
