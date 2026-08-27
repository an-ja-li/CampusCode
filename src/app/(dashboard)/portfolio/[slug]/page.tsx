"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star, ExternalLink, CheckCircle2,
  FolderKanban, MapPin, GraduationCap, Package,
  MessageSquare, ArrowLeft, Mail, Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { students as fallbackStudents, products as fallbackProducts, projects as fallbackProjects } from "@/lib/mock-data";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/lib/user-store";
import type { User, Product, Project } from "@/types";

export default function PortfolioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const { projects: userProjects, stats: userStats } = useUserData();

  const [dbStudent, setDbStudent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const cleanSlug = decodeURIComponent(slug).toLowerCase().trim();

  // Check if viewing own profile
  const isOwnProfile =
    Boolean(user) &&
    (cleanSlug === "me" ||
      cleanSlug === user?.id.toLowerCase() ||
      cleanSlug === (user?.studentProfile?.portfolioUrl?.toLowerCase() || "") ||
      cleanSlug === `@${(user?.studentProfile?.portfolioUrl?.toLowerCase() || "").replace(/^@/, "")}` ||
      cleanSlug === (user?.name?.toLowerCase().replace(/\s+/g, "") || "") ||
      cleanSlug === `@${(user?.name?.toLowerCase().replace(/\s+/g, "") || "")}`);

  useEffect(() => {
    let cancelled = false;

    if (isOwnProfile) {
      setLoading(false);
      return;
    }

    async function fetchDeveloperProfile() {
      try {
        const res = await fetch(`/api/users/${encodeURIComponent(cleanSlug)}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data) {
            setDbStudent(data);
            return;
          }
        }
      } catch (err) {
        console.error("[Portfolio] Error fetching developer:", err);
      }

      // Fallback to seeded directory
      const fallback = fallbackStudents.find((s) => {
        const pUrl = (s.studentProfile?.portfolioUrl || "").toLowerCase().replace(/^@/, "");
        const sName = s.name.toLowerCase().replace(/\s+/g, "");
        const target = cleanSlug.replace(/^@/, "");
        return s.id.toLowerCase() === target || pUrl === target || sName === target;
      });

      if (!cancelled) {
        setDbStudent(fallback || null);
      }
    }

    fetchDeveloperProfile().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [cleanSlug, isOwnProfile]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!isOwnProfile && !dbStudent) {
    return (
      <div className="p-12 text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Developer Not Found</h1>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          We couldn&apos;t find a student portfolio for &ldquo;{slug}&rdquo;.
        </p>
        <Link href="/marketplace">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  // Determine display values
  const student = isOwnProfile ? user : dbStudent;
  const profile = student?.studentProfile;
  const displayName = student?.name || "Student Developer";
  const college = profile?.college || "Engineering College";
  const degree = profile?.degree || "Computer Science";
  const gradYear = profile?.graduationYear || 2026;
  const bio = profile?.bio || "Building modern full-stack software and developer tools.";
  const skills = profile?.skills || ["React", "TypeScript", "Next.js"];

  // Products & Projects
  const studentProducts: Product[] = isOwnProfile
    ? []
    : (dbStudent as unknown as { products?: Product[] })?.products ||
      fallbackProducts.filter((p) => p.sellerId === dbStudent?.id);

  const studentProjects: Project[] = isOwnProfile
    ? userProjects
    : (dbStudent as unknown as { ownedProjects?: Project[] })?.ownedProjects ||
      fallbackProjects.filter((p) => p.ownerId === dbStudent?.id);

  const stats = isOwnProfile
    ? {
        projectsCount: userStats.activeProjectsCount,
        salesCount: userStats.totalSales,
        rating: profile?.rating || 5.0,
        earnings: userStats.totalEarnings,
      }
    : {
        projectsCount: profile?.completedProjects || studentProjects.length,
        salesCount: profile?.totalSales || 0,
        rating: profile?.rating || 4.9,
        earnings: profile?.totalEarnings || 0,
      };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-[var(--primary)]/20 via-purple-500/20 to-cyan-500/20 rounded-b-2xl" />
        <div className="px-4 sm:px-8 -mt-12">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar name={displayName} size="xl" className="h-24 w-24 text-2xl ring-4 ring-[var(--background)]" />
            <div className="flex-1 pt-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold">{displayName}</h1>
                {student?.isVerified && (
                  <Badge variant="success"><CheckCircle2 className="h-3 w-3 mr-1" />Verified Student</Badge>
                )}
                {profile?.level && (
                  <Badge variant="outline" className="capitalize text-xs">
                    {profile.level}
                  </Badge>
                )}
              </div>
              <p className="text-[var(--muted-foreground)] mb-2">{bio}</p>
              <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)] flex-wrap">
                <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" />{college}</span>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{degree}, {gradYear}</span>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex gap-2 shrink-0 flex-wrap">
              {profile?.github && (
                <a
                  href={profile.github.startsWith("http") ? profile.github : `https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1.5" />GitHub</Button>
                </a>
              )}

              {isOwnProfile ? (
                <Link href="/settings">
                  <Button size="sm">Edit Profile</Button>
                </Link>
              ) : (
                <Link href="/messages">
                  <Button size="sm" className="gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-8 space-y-8">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Completed Projects", value: stats.projectsCount },
            { label: "Total Sales", value: stats.salesCount },
            { label: "Rating", value: stats.rating, suffix: "/ 5" },
            { label: isOwnProfile ? "Your Earnings" : "Verified Revenue", value: formatCurrency(stats.earnings) },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">
                  {stat.value}{stat.suffix && <span className="text-sm font-normal text-[var(--muted-foreground)]">{stat.suffix}</span>}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Skills */}
        <div>
          <h2 className="text-lg font-bold mb-3">Skills & Technologies</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm">{skill}</Badge>
            ))}
          </div>
        </div>

        {/* Marketplace Products */}
        {studentProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-3">Published Products ({studentProducts.length})</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {studentProducts.map((prod) => (
                <Card key={prod.id} className="hover:border-[var(--primary)]/40 transition-all">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-base">{prod.name}</h3>
                      <Badge variant="outline" className="font-semibold">
                        {prod.isFree ? "Free" : formatCurrency(prod.price)}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3 line-clamp-2">{prod.shortDescription || prod.description}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating} ({prod.salesCount} sales)</span>
                      </div>
                      <Link href={`/marketplace/${prod.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs gap-1">
                          View Details <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        <div>
          <h2 className="text-lg font-bold mb-3">Featured Projects</h2>
          {studentProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {studentProjects.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">{p.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">{p.description || "No description provided."}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.technologies.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">No active projects listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
