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
      "Our first benchmark results are in. A plain GPT-4o-mini with no memory layer scores 57.6% — higher than LangChain (34.0%) and Mem0 OSS (32.4%). Only LlamaIndex (59.0%) beats the baseline.",
    date: "2026-05-11",
    author: "Bench'd",
    tags: ["benchmark", "results", "LongMemEval"],
    readingTime: "6 min read",
  },
];
