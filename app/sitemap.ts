import type { MetadataRoute } from "next";
import { systems } from "@/lib/data/systems";
import { posts } from "@/lib/data/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://benchd.ai";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/methodology`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/methodology/failure-taxonomy`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/methodology/trust-tiers`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/methodology/receipt-spec`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/methodology/trust-boundaries`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/trust`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/docs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/run`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/claim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/compare`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/benchmarks`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  // Metric methodology pages
  const metricSlugs = [
    "knowledge-retrieval", "knowledge-scale", "longmemeval", "locomo",
    "truth-arbitration", "memory-poisoning", "budget-curves", "reliability",
  ];
  const metricPages = metricSlugs.map((slug) => ({
    url: `${baseUrl}/methodology/metrics/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Adapter spec pages
  const specPages = [
    "conversational", "knowledge-brain", "agent-memory", "graph",
  ].map((track) => ({
    url: `${baseUrl}/spec/adapter/${track}/v1`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const systemPages = systems.map((s) => ({
    url: `${baseUrl}/system/${s.slug}`,
    lastModified: new Date(s.lastTested || s.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const blogPages = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...metricPages, ...specPages, ...systemPages, ...blogPages];
}
