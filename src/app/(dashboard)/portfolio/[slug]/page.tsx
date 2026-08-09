"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, Globe, ExternalLink, Code2, CheckCircle2,
  FolderKanban, Award, MapPin, GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { currentUser, products, projects, reviews } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function PortfolioPage() {
  const user = currentUser;
  const profile = user.studentProfile!;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-[var(--primary)]/20 via-purple-500/20 to-cyan-500/20 rounded-b-2xl" />
        <div className="px-4 sm:px-8 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar name={user.name} size="xl" className="h-24 w-24 text-2xl ring-4 ring-[var(--background)]" />
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.isVerified && (
                  <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>
                )}
              </div>
              <p className="text-[var(--muted-foreground)] mb-2">{profile.bio}</p>
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] flex-wrap">
                <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" />{profile.college}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profile.degree}, {profile.graduationYear}</span>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4" />GitHub</Button>
              <Button size="sm">Contact</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-8 space-y-8">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Projects", value: profile.completedProjects },
            { label: "Total Sales", value: profile.totalSales },
            { label: "Rating", value: profile.rating, suffix: "/ 5" },
            { label: "Earnings", value: formatCurrency(profile.totalEarnings) },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {stat.value}{stat.suffix && <span className="text-sm text-[var(--muted-foreground)]">{stat.suffix}</span>}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-lg font-semibold mb-3">Skills & Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1.5">{skill}</Badge>
            ))}
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold mb-3">Achievements</h2>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--muted)]/50 border border-[var(--border)]">
                <Award className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">{badge.name}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)]">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Products */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <h2 className="text-lg font-semibold mb-3">Published Products</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.filter((p) => p.sellerId === user.id).slice(0, 6).map((product) => (
              <Link key={product.id} href={`/marketplace/${product.id}`}>
                <Card className="card-hover h-full">
                  <CardContent className="p-4">
                    <div className="h-32 rounded-lg bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/50 mb-3 flex items-center justify-center">
                      <Code2 className="h-8 w-8 text-[var(--muted-foreground)]/30" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                      <span className="font-bold text-[var(--primary)]">
                        {product.isFree ? "Free" : formatCurrency(product.price)}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-lg font-semibold mb-3">Reviews</h2>
          <div className="space-y-4">
            {reviews.slice(0, 4).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar name={review.reviewer?.name || "Client"} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{review.reviewer?.name || "Client"}</p>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.round(review.overall) ? "fill-amber-400 text-amber-400" : "text-[var(--border)]"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--muted-foreground)]">{review.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
