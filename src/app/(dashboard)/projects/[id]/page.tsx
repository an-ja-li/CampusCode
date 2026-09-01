"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CheckCircle2, Plus, Loader2, X,
  Trash2, PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea, Label } from "@/components/ui/input";
import { getStatusColor, getPriorityColor } from "@/lib/utils";
import { KANBAN_COLUMNS } from "@/lib/constants";
import type { Project, Task, TaskStatus, TaskPriority } from "@/types";

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals States
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<Task | null>(null);

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus>("todo");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>("medium");
  const [newTaskLabels, setNewTaskLabels] = useState("frontend, feature");
  const [newTaskSubtasks, setNewTaskSubtasks] = useState("");

  // Load Project and Tasks
  useEffect(() => {
    let cancelled = false;

    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data && !data.error) {
            setProject(data);
            setTasks(data.tasks || []);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("[ProjectDetail] Error fetching project:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Handle Task Status Change
  const handleTaskStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
      setSelectedTaskForModal((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }

    try {
      await fetch(`/api/projects/${id}/tasks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update task status:", err);
    }
  };

  // Handle Create Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const labelArray = newTaskLabels
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);

    const subtaskArray = newTaskSubtasks
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title, i) => ({ id: `st_${Date.now()}_${i}`, title, completed: false }));

    const newTaskItem: Task = {
      id: `task_${Date.now()}`,
      projectId: id,
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      status: newTaskStatus,
      priority: newTaskPriority,
      labels: labelArray.length > 0 ? labelArray : ["feature"],
      subtasks: subtaskArray,
      comments: [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTaskItem, ...prev]);
    setIsAddTaskOpen(false);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskSubtasks("");

    try {
      await fetch(`/api/projects/${id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskItem),
      });
    } catch (err) {
      console.error("Failed to create task via API:", err);
    }
  };

  // Toggle Subtask
  const handleToggleSubtask = (taskId: string, subtaskIndex: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = [...t.subtasks];
        if (updatedSubtasks[subtaskIndex]) {
          updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            completed: !updatedSubtasks[subtaskIndex].completed,
          };
        }
        return { ...t, subtasks: updatedSubtasks };
      })
    );

    if (selectedTaskForModal && selectedTaskForModal.id === taskId) {
      setSelectedTaskForModal((prev) => {
        if (!prev) return prev;
        const updated = [...prev.subtasks];
        if (updated[subtaskIndex]) {
          updated[subtaskIndex] = {
            ...updated[subtaskIndex],
            completed: !updated[subtaskIndex].completed,
          };
        }
        return { ...prev, subtasks: updated };
      });
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTaskForModal(null);

    try {
      await fetch(`/api/projects/${id}/tasks?taskId=${taskId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 space-y-4">
        <h1 className="text-xl font-bold">Project not found</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          The project you are looking for might have been deleted or does not exist.
        </p>
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Projects
      </Link>

      {/* Main Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
              <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
            {project.description && (
              <p className="text-[var(--muted-foreground)] text-sm max-w-3xl">{project.description}</p>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs font-normal">{tech}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Add Task Action */}
          <Button
            size="sm"
            className="gap-1.5 text-xs font-semibold cursor-pointer shadow-md"
            onClick={() => {
              setNewTaskStatus("todo");
              setIsAddTaskOpen(true);
            }}
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2">
        <p className="text-xs text-[var(--muted-foreground)]">
          Drag or switch task columns directly using the status dropdown on each card
        </p>

        <div className="flex gap-4 overflow-x-auto pb-4 items-start scrollbar-none">
          {KANBAN_COLUMNS.map((column) => {
            const colStatus = column.id as TaskStatus;
            const columnTasks = tasks.filter((t) => t.status === colStatus);

            return (
              <div key={column.id} className="flex-shrink-0 w-80 rounded-2xl bg-[var(--muted)]/40 border border-[var(--border)] p-3 space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-xs uppercase tracking-wider">{column.title}</h3>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5">
                    {columnTasks.length}
                  </Badge>
                </div>

                {/* Tasks list in column */}
                <div className="space-y-2.5 min-h-[380px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTaskForModal(task)}
                      className="group p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] shadow-sm hover:border-[var(--primary)]/50 hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold leading-tight group-hover:text-[var(--primary)] transition-colors">
                          {task.title}
                        </h4>
                        <span className={`text-[10px] uppercase font-bold shrink-0 ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {task.labels && task.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-[10px] font-normal">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Subtasks Progress */}
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks
                          </span>
                          <span className="font-medium">
                            {Math.round((task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100)}%
                          </span>
                        </div>
                      )}

                      {/* Move Status Selector */}
                      <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] text-[var(--muted-foreground)] uppercase">Move:</span>
                        <select
                          value={task.status}
                          onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskStatus)}
                          className="text-[11px] bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] rounded px-2 py-0.5 custom-select cursor-pointer"
                        >
                          {KANBAN_COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {/* Quick Add Button on Column */}
                  <button
                    onClick={() => {
                      setNewTaskStatus(colStatus);
                      setIsAddTaskOpen(true);
                    }}
                    className="w-full p-2.5 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] hover:border-[var(--primary)] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add {column.title} task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* MODAL 1: ADD TASK MODAL                                      */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="text-lg font-bold">Add Project Task</h3>
                <button onClick={() => setIsAddTaskOpen(false)} className="p-1 rounded hover:bg-[var(--muted)] cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Task Title *</Label>
                  <Input
                    placeholder="e.g. Implement User Authentication Flow"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Status Column</Label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value as TaskStatus)}
                      className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs custom-select"
                    >
                      {KANBAN_COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Priority</Label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                      className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs custom-select"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-1 block">Description (optional)</Label>
                  <Textarea
                    rows={3}
                    placeholder="Provide acceptance criteria, details, or API requirements..."
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-1 block">Labels (comma-separated)</Label>
                  <Input
                    placeholder="frontend, api, bug, database"
                    value={newTaskLabels}
                    onChange={(e) => setNewTaskLabels(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold mb-1 block">Subtasks (one per line)</Label>
                  <Textarea
                    rows={2}
                    placeholder="Schema setup&#10;Frontend UI connection&#10;Unit test"
                    value={newTaskSubtasks}
                    onChange={(e) => setNewTaskSubtasks(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-[var(--border)]">
                  <Button type="button" variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="gap-1 cursor-pointer">
                    <Plus className="h-4 w-4" /> Create Task
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL 2: TASK DETAIL & SUBTASKS MODAL                        */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedTaskForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className={getStatusColor(selectedTaskForModal.status)}>
                      {selectedTaskForModal.status.replace("_", " ")}
                    </Badge>
                    <span className={`text-xs font-bold ${getPriorityColor(selectedTaskForModal.priority)}`}>
                      {selectedTaskForModal.priority} priority
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{selectedTaskForModal.title}</h3>
                </div>
                <button onClick={() => setSelectedTaskForModal(null)} className="p-1 rounded hover:bg-[var(--muted)] cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {selectedTaskForModal.description && (
                <div className="p-3 rounded-lg bg-[var(--muted)]/40 text-xs text-[var(--muted-foreground)] leading-relaxed whitespace-pre-line">
                  {selectedTaskForModal.description}
                </div>
              )}

              {/* Status Change Selector */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Change Task Column</Label>
                <select
                  value={selectedTaskForModal.status}
                  onChange={(e) => handleTaskStatusChange(selectedTaskForModal.id, e.target.value as TaskStatus)}
                  className="w-full h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-xs custom-select"
                >
                  {KANBAN_COLUMNS.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Subtasks Checkbox List */}
              {selectedTaskForModal.subtasks && selectedTaskForModal.subtasks.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Subtasks Checklist ({selectedTaskForModal.subtasks.filter((s) => s.completed).length}/{selectedTaskForModal.subtasks.length})
                  </p>
                  <div className="space-y-1.5">
                    {selectedTaskForModal.subtasks.map((st, idx) => (
                      <label
                        key={st.id || idx}
                        className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--muted)] cursor-pointer text-xs transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => handleToggleSubtask(selectedTaskForModal.id, idx)}
                          className="h-4 w-4 rounded accent-[var(--primary)]"
                        />
                        <span className={st.completed ? "line-through text-[var(--muted-foreground)]" : "font-medium"}>
                          {st.title}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTask(selectedTaskForModal.id)}
                  className="gap-1.5 cursor-pointer text-xs"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete Task
                </Button>
                <Button size="sm" onClick={() => setSelectedTaskForModal(null)} className="cursor-pointer text-xs">
                  Done
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
