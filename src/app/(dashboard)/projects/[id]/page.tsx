"use client";

import { use, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Clock, Users, CheckCircle2, GitBranch, Package,
  Settings, FileText, Activity, LayoutList, Columns3, Target,
  UserPlus, ExternalLink, Plus, GripVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { projects, projectTasks } from "@/lib/mock-data";
import { getStatusColor, getPriorityColor, formatDate } from "@/lib/utils";
import { KANBAN_COLUMNS } from "@/lib/constants";
import type { TaskStatus } from "@/types";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const project = projects.find((p) => p.id === id);
  const [activeTab, setActiveTab] = useState("overview");

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Project not found</h1>
        <Link href="/projects"><Button variant="outline" className="mt-4">Back</Button></Link>
      </div>
    );
  }

  const tasks = project.id === "proj1" ? projectTasks : [];

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutList },
    { id: "kanban", label: "Kanban", icon: Columns3 },
    { id: "tasks", label: "Tasks", icon: CheckCircle2 },
    { id: "milestones", label: "Milestones", icon: Target },
    { id: "team", label: "Team", icon: Users },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
            <p className="text-[var(--muted-foreground)] text-sm">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            {!project.isPublished && (
              <Link href="/sell">
                <Button variant="outline" size="sm"><Package className="h-4 w-4" />Publish as Product</Button>
              </Link>
            )}
            <Button variant="outline" size="sm"><Settings className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-[var(--muted-foreground)]">Overall Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--muted)]">
            <div className="h-full rounded-full bg-[var(--primary)] transition-all" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--border)] mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Tasks", value: tasks.length },
                { label: "Completed", value: tasks.filter((t) => t.status === "done").length },
                { label: "In Progress", value: tasks.filter((t) => t.status === "in_progress").length },
                { label: "Team Members", value: project.members.length },
              ].map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Tasks */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Recent Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
                      <Badge className={`${getStatusColor(task.status)} text-[10px] shrink-0`}>{task.status.replace("_", " ")}</Badge>
                      <span className="text-sm flex-1 truncate">{task.title}</span>
                      <span className={`text-xs ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Info */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold text-sm mb-3">Project Info</h3>
                {project.deadline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Deadline</span>
                    <span className="font-medium">{formatDate(project.deadline)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Category</span>
                  <span className="font-medium">{project.category}</span>
                </div>
                {project.client && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Client</span>
                    <span className="font-medium">{project.client.name}</span>
                  </div>
                )}
                {project.githubRepo && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">GitHub</span>
                    <a href="#" className="font-medium text-[var(--primary)] flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> Repository
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Team</h3>
                  <Button variant="ghost" size="sm" className="h-7 text-xs"><UserPlus className="h-3 w-3" /></Button>
                </div>
                <div className="space-y-2">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex items-center gap-2.5">
                      <Avatar name={member.user?.name || project.owner?.name || "User"} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.user?.name || project.owner?.name}</p>
                        <p className="text-xs text-[var(--muted-foreground)] capitalize">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === "kanban" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {KANBAN_COLUMNS.map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column.id as TaskStatus);
              return (
                <div key={column.id} className="flex-shrink-0 w-72">
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{column.title}</h3>
                    <span className="text-xs text-[var(--muted-foreground)] ml-auto">{columnTasks.length}</span>
                  </div>
                  <div className="space-y-2.5 kanban-column min-h-[400px] p-2 rounded-xl bg-[var(--muted)]/50">
                    {columnTasks.map((task) => (
                      <div key={task.id} className="kanban-card p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
                          <GripVertical className="h-4 w-4 text-[var(--muted-foreground)] shrink-0" />
                        </div>
                        {task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {task.labels.map((label) => (
                              <Badge key={label} variant="secondary" className="text-[10px]">{label}</Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                          <span className={getPriorityColor(task.priority)}>{task.priority}</span>
                          {task.assigneeId && (
                            <Avatar name={task.assignee?.name || "User"} size="sm" className="h-5 w-5 text-[8px]" />
                          )}
                        </div>
                        {task.subtasks.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-[var(--border)]">
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                    <button className="w-full p-2 rounded-lg border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors cursor-pointer flex items-center justify-center gap-1">
                      <Plus className="h-3 w-3" /> Add task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {activeTab === "tasks" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--border)]">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-[var(--muted)]/50 transition-colors">
                    <Badge className={`${getStatusColor(task.status)} text-[10px] shrink-0 min-w-20 justify-center`}>
                      {task.status.replace("_", " ")}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{task.title}</h4>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">{task.description}</p>
                    </div>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)} shrink-0`}>{task.priority}</span>
                    {task.dueDate && (
                      <span className="text-xs text-[var(--muted-foreground)] shrink-0 hidden sm:block">
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                    {task.assigneeId && (
                      <Avatar name={task.assignee?.name || "User"} size="sm" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "milestones" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-[var(--muted-foreground)]/30 mb-4" />
            <h3 className="font-semibold mb-1">No milestones yet</h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">Create milestones to track project progress</p>
            <Button><Plus className="h-4 w-4" />Add Milestone</Button>
          </div>
        </motion.div>
      )}

      {activeTab === "team" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-5 text-center">
                  <Avatar name={member.user?.name || project.owner?.name || "User"} size="lg" className="mx-auto mb-3" />
                  <h3 className="font-semibold text-sm">{member.user?.name || project.owner?.name}</h3>
                  <p className="text-xs text-[var(--muted-foreground)] capitalize mb-2">{member.role}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">Joined {formatDate(member.joinedAt)}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-dashed">
              <CardContent className="p-5 text-center flex flex-col items-center justify-center h-full">
                <UserPlus className="h-8 w-8 text-[var(--muted-foreground)]/30 mb-2" />
                <Button variant="outline" size="sm"><Plus className="h-4 w-4" />Invite Member</Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === "activity" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card>
            <CardContent className="p-5">
              <div className="space-y-4">
                {[
                  { action: "created task", detail: "Performance optimization", time: "2 hours ago" },
                  { action: "completed task", detail: "Design resume upload UI", time: "1 day ago" },
                  { action: "pushed to", detail: "main branch (3 commits)", time: "2 days ago" },
                  { action: "added member", detail: "Priya Sharma", time: "1 week ago" },
                  { action: "created project", detail: project.name, time: "7 months ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-[var(--primary)] shrink-0" />
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{project.owner?.name}</span>{" "}
                        <span className="text-[var(--muted-foreground)]">{item.action}</span>{" "}
                        <span className="font-medium">{item.detail}</span>
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
