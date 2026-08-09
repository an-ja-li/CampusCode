"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FolderKanban, Package, Send, FileCheck, DollarSign, TrendingUp,
  ArrowRight, Star, Clock, Zap, ChevronRight, ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { projects, solutionRequests, earningsData, currentUser, aiMatchScores } from "@/lib/mock-data";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const user = currentUser;
  const profile = user.studentProfile!;

  const stats = [
    { label: "Active Projects", value: projects.filter((p) => p.status === "active").length, icon: FolderKanban, color: "text-blue-500 bg-blue-100 dark:bg-blue-900/30" },
    { label: "Published Products", value: profile.totalSales > 50 ? 12 : 5, icon: Package, color: "text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30" },
    { label: "Applications", value: 3, icon: Send, color: "text-purple-500 bg-purple-100 dark:bg-purple-900/30" },
    { label: "Active Contracts", value: 1, icon: FileCheck, color: "text-amber-500 bg-amber-100 dark:bg-amber-900/30" },
    { label: "Total Sales", value: profile.totalSales, icon: DollarSign, color: "text-cyan-500 bg-cyan-100 dark:bg-cyan-900/30" },
    { label: "Total Earnings", value: formatCurrency(profile.totalEarnings), icon: TrendingUp, color: "text-rose-500 bg-rose-100 dark:bg-rose-900/30", isString: true },
  ];

  const activeProjects = projects.filter((p) => p.status === "active");

  const matchedRequests = solutionRequests
    .filter((sr) => sr.status === "open")
    .slice(0, 3)
    .map((sr) => ({
      ...sr,
      matchScore: aiMatchScores[sr.id]?.score || Math.floor(Math.random() * 30 + 60),
      matchingSkills: aiMatchScores[sr.id]?.matchingSkills || sr.preferredTechnologies.slice(0, 2),
    }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp} transition={{ delay: 0 }}>
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user.name.split(" ")[0]} 👋
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Here&apos;s what&apos;s happening with your projects and marketplace.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card key={stat.label} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.isString ? stat.value : stat.value}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Current Work */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Current Work</CardTitle>
                <Link href="/projects">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{project.name}</h3>
                        <Badge variant={project.contractId ? "warning" : "secondary"} className="shrink-0 text-[10px]">
                          {project.contractId ? "Contract" : "Personal"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
                        {project.deadline && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Due {new Date(project.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                        )}
                        {project.client && (
                          <span>Client: {project.client.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{project.progress}%</p>
                      <div className="w-20 h-1.5 rounded-full bg-[var(--muted)] mt-1">
                        <div
                          className="h-full rounded-full bg-[var(--primary)] transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Create New Project", href: "/projects", icon: FolderKanban },
                { label: "Publish to Marketplace", href: "/sell", icon: Package },
                { label: "Browse Opportunities", href: "/solutions", icon: Zap },
                { label: "View Earnings", href: "/earnings", icon: DollarSign },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--muted)] transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                      <action.icon className="h-4 w-4 text-[var(--primary)]" />
                    </div>
                    <span className="text-sm font-medium flex-1">{action.label}</span>
                    <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Monthly Earnings</CardTitle>
                <Link href="/earnings">
                  <Button variant="ghost" size="sm" className="text-xs">View details</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={earningsData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" tickFormatter={(v) => `₹${v / 1000}K`} />
                    <Tooltip
                      formatter={(value: any) => [formatCurrency(Number(value) || 0), "Earnings"]}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                        fontSize: "0.875rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#earningsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended Opportunities */}
        <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  Recommended for You
                </CardTitle>
                <Link href="/solutions">
                  <Button variant="ghost" size="sm" className="text-xs">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {matchedRequests.map((req) => (
                <Link key={req.id} href={`/solutions/${req.id}`}>
                  <div className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm leading-tight">{req.title}</h3>
                      <Badge variant="default" className="shrink-0 text-[10px] bg-emerald-500">
                        {req.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-xs text-[var(--muted-foreground)]">
                      <span className="font-medium text-[var(--foreground)]">
                        {req.budgetMin && req.budgetMax
                          ? `${formatCurrency(req.budgetMin)} – ${formatCurrency(req.budgetMax)}`
                          : "Open"}
                      </span>
                      <span>•</span>
                      <span>{req.proposalCount} proposals</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {req.matchingSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px]">✓ {skill}</Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
