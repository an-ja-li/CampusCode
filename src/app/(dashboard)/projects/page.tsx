"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FolderKanban, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { projects } from "@/lib/mock-data";
import { getStatusColor } from "@/lib/utils";

export default function ProjectsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold mb-1">My Projects</h1>
          <p className="text-[var(--muted-foreground)]">Manage your software projects</p>
        </div>
        <Button><Plus className="h-4 w-4" />New Project</Button>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Link href={`/projects/${project.id}`}>
              <Card className="card-hover h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                    {project.contractId && <Badge variant="warning" className="text-[10px]">Contract</Badge>}
                  </div>

                  <h3 className="font-semibold text-base mb-1">{project.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2 mb-3">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[var(--muted-foreground)]">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[var(--muted)]">
                      <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${project.progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.members.length} members
                    </div>
                    {project.deadline && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(project.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
