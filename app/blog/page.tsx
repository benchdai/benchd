import Link from "next/link";
import { posts } from "@/lib/data/posts";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Benchmark findings, methodology updates, and analysis from Bench'd.",
};

export default function BlogIndex() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2.5 mb-4">
          <BookOpen className="h-5 w-5 text-amber" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Blog</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-10">
          Benchmark findings, methodology deep-dives, and analysis of how AI memory systems actually perform.
        </p>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-border rounded-xl p-6 bg-card card-sm hover:border-amber/30 transition-colors relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-amber/0 group-hover:bg-amber/40 rounded-l-xl transition-colors" />
                <div className="flex items-center gap-3 mb-2">
                  <time className="text-[10px] font-mono text-muted-foreground">{post.date}</time>
                  <span className="text-[10px] text-muted-foreground">{post.readingTime}</span>
                  <div className="flex gap-1.5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="font-serif text-lg font-semibold text-foreground group-hover:text-amber transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {post.description}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-[11px] text-amber font-medium">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
