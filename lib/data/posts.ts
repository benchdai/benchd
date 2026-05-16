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
  {
    slug: "reliability-benchmark",
    title: "We Built 25 Trap Questions to Test If AI Memory Systems Hallucinate",
    description:
      "Our new Reliability benchmark plants adversarial traps: hallucination questions, changed facts, similar entities, deletion requests. The LLM baseline scores 0% on hallucination.",
    date: "2026-05-13",
    author: "Bench'd",
    tags: ["benchmark", "reliability", "adversarial"],
    readingTime: "7 min read",
  },
  {
    slug: "benchd-protocol-v01",
    title: "Bench'd Evaluation Protocol v0.1: How We Make Memory Benchmarks Fair",
    description:
      "Why we wrote a formal protocol, the adapter contract, model locking, trust tiers, the BMI formula, and versioning rules. Never rewrite history.",
    date: "2026-05-14",
    author: "Bench'd",
    tags: ["protocol", "methodology", "fairness"],
    readingTime: "9 min read",
  },
  {
    slug: "poisoning-resistance",
    title: "Zero Memory Systems Resist Injection Attacks — Except One",
    description:
      "We built 5 adversarial injection tests. Every system fell for them except Letta, which blocked 1 out of 5. Here's what that means for production agents.",
    date: "2026-05-16",
    author: "Bench'd",
    tags: ["security", "poisoning", "adversarial"],
    readingTime: "5 min read",
  },
  {
    slug: "knowledge-brain-track",
    title: "We Stopped Comparing Filing Cabinets to Chatbots",
    description:
      "gbrain scores 100% when tested on what it's built for. Here's why we created separate tracks for Knowledge Brains vs Conversational Memory.",
    date: "2026-05-16",
    author: "Bench'd",
    tags: ["tracks", "knowledge-brain", "methodology"],
    readingTime: "6 min read",
  },
];
