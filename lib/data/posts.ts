export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
}

export const posts: BlogPost[] = [
  {
    slug: "llm-baseline-beats-memory-systems",
    title: "A Raw LLM Beats Most Memory Systems on LongMemEval",
    description:
      "Our first benchmark results are in across 6 systems tested. A plain GPT-4o-mini with no memory layer scores 57.6% — higher than LangChain (34.0%) and Mem0 OSS (32.4%). Only LlamaIndex (59.0%) beats the baseline. AutoGPT Memory lands at 47.4%.",
    date: "2026-05-11",
    author: "Bench'd",
    tags: ["benchmark", "results", "LongMemEval"],
    readingTime: "6 min read",
  },
  {
    slug: "six-systems-one-benchmark",
    title: "Six Memory Systems, One Benchmark: What We Learned",
    description:
      "We ran LlamaIndex, LangChain, AutoGPT, Mem0, Cognee, and Graphiti through 500 questions. Three tiers emerged — and most systems can't beat a plain LLM.",
    date: "2026-05-12",
    author: "Bench'd",
    tags: ["benchmark", "results", "comparison"],
    readingTime: "8 min read",
  },
];
