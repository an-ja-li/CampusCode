import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Engineering Blog | CampusCode",
  description: "Insights, tutorials, and success stories from student software developers and tech founders on CampusCode.",
};

const blogPosts = [
  {
    slug: "how-i-made-50k-selling-my-college-project",
    title: "How I Made ₹50,000 in My 3rd Year Selling My Next.js SaaS Capstone",
    excerpt: "Turning a semester final project into a recurring revenue software product on CampusCode marketplace.",
    author: "Rahul Sharma",
    college: "IIT Bombay",
    category: "Creator Story",
    readTime: "4 min read",
    date: "Aug 28, 2026",
  },
  {
    slug: "guide-to-milestone-escrow-contracts",
    title: "The Comprehensive Guide to Escrow Contracts for Freelance Developers",
    excerpt: "How milestone-based software contracts protect both clients and student engineers against payment defaults.",
    author: "CampusCode Engineering",
    college: "Platform Team",
    category: "Engineering",
    readTime: "6 min read",
    date: "Aug 20, 2026",
  },
  {
    slug: "optimizing-nextjs-15-applications",
    title: "10 Architectural Tips for High-Performance Next.js 15 Applications",
    excerpt: "Best practices for server components, streaming, metadata optimization, and Tailwind CSS v4 in production.",
    author: "Ananya Iyer",
    college: "BITS Pilani",
    category: "Tutorial",
    readTime: "7 min read",
    date: "Aug 14, 2026",
  },
  {
    slug: "how-ai-matching-connects-clients",
    title: "Behind the Scenes: How CampusCode AI Matches Developers with Requirements",
    excerpt: "A deep dive into our vector similarity ranking and requirement spec decomposition pipeline.",
    author: "CampusCode AI Research",
    college: "Core Team",
    category: "AI & Tech",
    readTime: "5 min read",
    date: "Aug 05, 2026",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
              Developer Journal
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-extrabold">CampusCode Blog & Tutorials</h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-1">
              Engineering guides, creator monetization case studies, and student developer stories.
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Home
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="border-[var(--border)] hover:border-[var(--primary)]/40 transition-all shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {post.readTime}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold hover:text-[var(--primary)] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                  <div>
                    <span className="font-semibold text-[var(--foreground)] block">{post.author}</span>
                    <span>{post.college} • {post.date}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs text-[var(--primary)]">
                    Read Article <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
