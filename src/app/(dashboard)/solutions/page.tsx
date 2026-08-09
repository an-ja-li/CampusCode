"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Lightbulb, Plus, Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { solutionRequests } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

export default function SolutionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filtered = solutionRequests.filter((sr) => {
    if (search && !sr.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "all" && sr.category !== category) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "budget_high") return (b.budgetMax || 0) - (a.budgetMax || 0);
    if (sortBy === "proposals") return a.proposalCount - b.proposalCount;
    return 0;
  });

  const categories = ["all", "web", "ai-ml", "mobile", "automation", "data-science"];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold mb-1">Find a Solution</h1>
            <p className="text-[var(--muted-foreground)]">
              Browse requirements and submit proposals to build software solutions
            </p>
          </div>
          <Link href="/solutions/post">
            <Button>
              <Plus className="h-4 w-4" />
              Post a Requirement
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input placeholder="Search requirements..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 rounded-lg border border-[var(--border)] bg-transparent px-3 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="budget_high">Highest Budget</option>
            <option value="proposals">Fewest Proposals</option>
          </select>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                category === cat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
              }`}
            >
              {cat === "all" ? "All" : cat.replace("-", " / ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results */}
      <p className="text-sm text-[var(--muted-foreground)] mb-4">{filtered.length} requirements found</p>

      <div className="space-y-4">
        {filtered.map((req, i) => (
          <motion.div key={req.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}>
            <Link href={`/solutions/${req.id}`}>
              <Card className="card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-base">{req.title}</h3>
                        <Badge variant={req.status === "open" ? "success" : "warning"}>
                          {req.status === "open" ? "Open" : "In Progress"}
                        </Badge>
                        <Badge variant="outline">{req.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{req.description}</p>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {req.preferredTechnologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] flex-wrap">
                        <span className="font-semibold text-sm text-[var(--foreground)]">
                          {req.budgetMin && req.budgetMax ? `${formatCurrency(req.budgetMin)} – ${formatCurrency(req.budgetMax)}` : "Open Budget"}
                        </span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{req.proposalCount} proposals</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Posted {formatRelativeTime(req.createdAt)}</span>
                        {req.client && <span>by {req.client.name}</span>}
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[var(--muted-foreground)] shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <Lightbulb className="h-12 w-12 mx-auto text-[var(--muted-foreground)]/30 mb-4" />
          <h3 className="font-semibold mb-1">No requirements found</h3>
          <p className="text-sm text-[var(--muted-foreground)]">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}
