import { db } from "@/lib/db";
import { createSign } from "crypto";
import type { TaskPriority, TaskStatus } from "@prisma/client";

type CampusTaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
type CampusTaskPriority = "low" | "medium" | "high" | "urgent";

export interface GitHubRepoItem {
  full_name: string;
  name: string;
  html_url: string;
  description?: string;
  private?: boolean;
}

interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  updated_at: string;
  labels: Array<{ name: string }>;
  pull_request?: unknown;
}

const STATUS_PREFIX = "campuscode:status:";
const PRIORITY_PREFIX = "campuscode:priority:";
const ISSUE_PREFIX = "campuscode:issue:";
const taskStatuses: CampusTaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
const taskPriorities: CampusTaskPriority[] = ["low", "medium", "high", "urgent"];

export function githubIssueMarker(issueNumber: number) {
  return `${ISSUE_PREFIX}${issueNumber}`;
}

function token() {
  return process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN || null;
}

const installationTokens = new Map<string, { token: string; expiresAt: number }>();

export async function getInstallationToken(installationId: string) {
  const cached = installationTokens.get(installationId);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!appId || !privateKey) throw new Error("GitHub App is not configured.");

  const now = Math.floor(Date.now() / 1000);
  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const unsigned = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iat: now - 30, exp: now + 540, iss: appId })}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  const appJwt = `${unsigned}.${signer.sign(privateKey, "base64url")}`;
  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${appJwt}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to create a GitHub installation token.");
  const data = await response.json() as { token: string; expires_at: string };
  installationTokens.set(installationId, { token: data.token, expiresAt: new Date(data.expires_at).getTime() });
  return data.token;
}

export async function listInstallationRepositories(installationId: string) {
  const token = await getInstallationToken(installationId);
  const allRepositories: Array<{ full_name: string; html_url: string }> = [];
  let page = 1;
  const maxPages = 5;

  while (page <= maxPages) {
    const response = await fetch(`https://api.github.com/installation/repositories?per_page=100&page=${page}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
      cache: "no-store",
    });
    if (!response.ok) {
      if (page === 1) throw new Error("Unable to load the repositories available to this GitHub installation.");
      break;
    }
    const data = await response.json() as { repositories: Array<{ full_name: string; html_url: string }> };
    if (!data.repositories || data.repositories.length === 0) break;
    allRepositories.push(...data.repositories);
    if (data.repositories.length < 100) break;
    page++;
  }

  return allRepositories;
}

export async function listUserRepositories(userId: string): Promise<GitHubRepoItem[]> {
  const userRows = await db.$queryRawUnsafe<Array<{ githubAccessToken: string | null }>>(
    'SELECT "githubAccessToken" FROM "users" WHERE "id" = $1',
    userId
  );
  const userToken = userRows[0]?.githubAccessToken;
  if (!userToken) return [];

  const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner,collaborator", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${userToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "CampusCode",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    console.warn("[listUserRepositories] Failed to fetch user repos:", response.status);
    return [];
  }

  const data = await response.json() as Array<{ full_name: string; name: string; html_url: string; description?: string; private?: boolean }>;
  return data.map((r) => ({
    full_name: r.full_name,
    name: r.name,
    html_url: r.html_url,
    description: r.description,
    private: r.private,
  }));
}

async function projectGitHubConnection(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      githubRepo: true,
      githubInstallationId: true,
      owner: { select: { id: true } },
    },
  });
  if (!project) return null;

  let ownerAccessToken: string | null = null;
  if (project.owner?.id) {
    const rows = await db.$queryRawUnsafe<Array<{ githubAccessToken: string | null }>>(
      'SELECT "githubAccessToken" FROM "users" WHERE "id" = $1',
      project.owner.id
    );
    ownerAccessToken = rows[0]?.githubAccessToken || null;
  }

  return {
    githubRepo: project.githubRepo,
    githubInstallationId: project.githubInstallationId,
    ownerAccessToken,
  };
}

export function getRepositoryParts(repoUrl: string | null | undefined) {
  if (!repoUrl) return null;
  const clean = repoUrl.trim()
    .replace(/^https?:\/\/github\.com\//i, "")
    .replace(/^git@github\.com:/i, "")
    .replace(/\.git$/i, "")
    .replace(/\/$/, "");
  const [owner, repo] = clean.split("/");
  return owner && repo ? { owner, repo, fullName: `${owner}/${repo}` } : null;
}

async function githubHeaders(connection?: { githubInstallationId?: string | null; ownerAccessToken?: string | null }) {
  let accessToken: string | null = null;
  if (connection?.githubInstallationId) {
    accessToken = await getInstallationToken(connection.githubInstallationId);
  } else if (connection?.ownerAccessToken) {
    accessToken = connection.ownerAccessToken;
  } else {
    accessToken = token();
  }

  if (!accessToken) throw new Error("GitHub sync is not configured. Connect your GitHub account or add GITHUB_TOKEN.");
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${accessToken}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "CampusCode",
  };
}

async function githubRequest<T>(
  path: string,
  init?: RequestInit,
  connection?: { githubInstallationId?: string | null; ownerAccessToken?: string | null }
): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { ...(await githubHeaders(connection)), ...init?.headers },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub request failed (${response.status}): ${detail.slice(0, 180)}`);
  }
  return response.json() as Promise<T>;
}

export function statusFromIssue(issue: Pick<GitHubIssue, "state" | "labels">): CampusTaskStatus {
  if (issue.state === "closed") return "done";
  const statusLabel = issue.labels.find((label) => label.name.startsWith(STATUS_PREFIX))?.name;
  const status = statusLabel?.slice(STATUS_PREFIX.length) as CampusTaskStatus | undefined;
  return status && taskStatuses.includes(status) ? status : "todo";
}

export function priorityFromIssue(issue: Pick<GitHubIssue, "labels">): CampusTaskPriority {
  const priorityLabel = issue.labels.find((label) => label.name.startsWith(PRIORITY_PREFIX))?.name;
  const priority = priorityLabel?.slice(PRIORITY_PREFIX.length) as CampusTaskPriority | undefined;
  return priority && taskPriorities.includes(priority) ? priority : "medium";
}

function labelsForTask(labels: string[], status: string, priority?: string) {
  const visibleLabels = labels.filter(
    (label) => !label.startsWith(STATUS_PREFIX) && !label.startsWith(PRIORITY_PREFIX) && !label.startsWith(ISSUE_PREFIX)
  );
  const extraLabels = [`${STATUS_PREFIX}${status.toLowerCase()}`];
  if (priority) {
    extraLabels.push(`${PRIORITY_PREFIX}${priority.toLowerCase()}`);
  }
  return [...visibleLabels, ...extraLabels];
}

export async function pushTaskToGitHub(taskId: string) {
  const task = await db.task.findUnique({
    where: { id: taskId },
  });
  if (!task) throw new Error("Task not found");

  const connection = await projectGitHubConnection(task.projectId);
  const repository = getRepositoryParts(connection?.githubRepo);
  if (!repository) throw new Error("Attach a GitHub repository before syncing tasks.");

  const marker = task.labels.find((label) => label.startsWith(ISSUE_PREFIX));
  const issueNumber = marker ? Number(marker.slice(ISSUE_PREFIX.length)) : null;
  const labels = labelsForTask(task.labels, task.status, task.priority);
  const issuePayload = {
    title: task.title,
    body: task.description || "",
    labels,
    state: task.status === "DONE" ? "closed" : "open",
  };

  let issue: GitHubIssue;
  if (issueNumber) {
    issue = await githubRequest<GitHubIssue>(`/repos/${repository.owner}/${repository.repo}/issues/${issueNumber}`, {
      method: "PATCH",
      body: JSON.stringify(issuePayload),
      headers: { "Content-Type": "application/json" },
    }, connection || undefined);
  } else {
    issue = await githubRequest<GitHubIssue>(`/repos/${repository.owner}/${repository.repo}/issues`, {
      method: "POST",
      body: JSON.stringify(issuePayload),
      headers: { "Content-Type": "application/json" },
    }, connection || undefined);
    await db.task.update({
      where: { id: task.id },
      data: { labels: [...task.labels.filter((label) => !label.startsWith(ISSUE_PREFIX)), githubIssueMarker(issue.number)] },
    });
  }

  return { number: issue.number, url: issue.html_url };
}

export async function closeTaskOnGitHub(taskId: string) {
  try {
    const task = await db.task.findUnique({ where: { id: taskId } });
    if (!task) return null;

    const connection = await projectGitHubConnection(task.projectId);
    const repository = getRepositoryParts(connection?.githubRepo);
    if (!repository) return null;

    const marker = task.labels.find((label) => label.startsWith(ISSUE_PREFIX));
    const issueNumber = marker ? Number(marker.slice(ISSUE_PREFIX.length)) : null;
    if (!issueNumber) return null;

    await githubRequest(`/repos/${repository.owner}/${repository.repo}/issues/${issueNumber}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: "Task was removed in CampusCode workspace." }),
      headers: { "Content-Type": "application/json" },
    }, connection || undefined).catch(() => null);

    return await githubRequest<GitHubIssue>(`/repos/${repository.owner}/${repository.repo}/issues/${issueNumber}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed" }),
      headers: { "Content-Type": "application/json" },
    }, connection || undefined);
  } catch (error) {
    console.warn("[closeTaskOnGitHub] Failed to close GitHub issue:", error);
    return null;
  }
}

export async function applyGitHubIssue(projectId: string, issue: GitHubIssue) {
  if (issue.pull_request) return null;
  const marker = githubIssueMarker(issue.number);
  const status = statusFromIssue(issue);
  const priority = priorityFromIssue(issue);
  const labels = issue.labels
    .map((label) => label.name)
    .filter((label) => !label.startsWith(ISSUE_PREFIX) && !label.startsWith(STATUS_PREFIX) && !label.startsWith(PRIORITY_PREFIX));
  const project = await db.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project) return null;

  const existing = await db.task.findFirst({ where: { projectId, labels: { has: marker } } });
  if (existing) {
    return db.task.update({
      where: { id: existing.id },
      data: {
        title: issue.title,
        description: issue.body || "",
        status: status.toUpperCase() as TaskStatus,
        priority: priority.toUpperCase() as TaskPriority,
        labels: [...labels, marker],
      },
    });
  }

  return db.task.create({
    data: {
      projectId,
      title: issue.title,
      description: issue.body || "",
      status: status.toUpperCase() as TaskStatus,
      priority: priority.toUpperCase() as TaskPriority,
      labels: [...labels, marker],
      creatorId: project.ownerId,
    },
  });
}

export async function pullProjectIssuesFromGitHub(projectId: string) {
  const connection = await projectGitHubConnection(projectId);
  const repository = getRepositoryParts(connection?.githubRepo);
  if (!repository) throw new Error("Attach a GitHub repository before syncing tasks.");

  const allIssues: GitHubIssue[] = [];
  let page = 1;
  const maxPages = 5;

  while (page <= maxPages) {
    const pageIssues = await githubRequest<GitHubIssue[]>(
      `/repos/${repository.owner}/${repository.repo}/issues?state=all&per_page=100&page=${page}`,
      undefined,
      connection || undefined
    );
    if (!pageIssues || pageIssues.length === 0) break;
    allIssues.push(...pageIssues);
    if (pageIssues.length < 100) break;
    page++;
  }

  const validIssues = allIssues.filter((issue) => !issue.pull_request);
  const synced = await Promise.all(validIssues.map((issue) => applyGitHubIssue(projectId, issue)));
  const tasks = await db.task.findMany({ where: { projectId } });
  const progress = tasks.length ? Math.round((tasks.filter((task) => task.status === "DONE").length / tasks.length) * 100) : 0;
  await db.project.update({ where: { id: projectId }, data: { progress } });
  return { synced: synced.filter(Boolean).length, issueCount: validIssues.length };
}

export async function syncKanbanLogToRepo(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: {
        include: { assignee: { select: { name: true, email: true } }, subtasks: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
  if (!project) throw new Error("Project not found");

  const connection = await projectGitHubConnection(projectId);
  const repository = getRepositoryParts(connection?.githubRepo);
  if (!repository) throw new Error("Attach a GitHub repository before syncing Kanban log.");

  const kanbanLog = {
    projectName: project.name,
    projectId: project.id,
    lastSyncedAt: new Date().toISOString(),
    progress: project.progress,
    totalTasks: project.tasks.length,
    columns: {
      backlog: project.tasks.filter((t) => t.status === "BACKLOG").map(formatTaskForLog),
      todo: project.tasks.filter((t) => t.status === "TODO").map(formatTaskForLog),
      in_progress: project.tasks.filter((t) => t.status === "IN_PROGRESS").map(formatTaskForLog),
      review: project.tasks.filter((t) => t.status === "REVIEW").map(formatTaskForLog),
      done: project.tasks.filter((t) => t.status === "DONE").map(formatTaskForLog),
    },
  };

  const fileContent = JSON.stringify(kanbanLog, null, 2);
  const encodedContent = Buffer.from(fileContent).toString("base64");
  const filePath = "kanban-log.json";

  // Check if file already exists to get SHA
  let fileSha: string | undefined = undefined;
  try {
    const existingFile = await githubRequest<{ sha: string }>(
      `/repos/${repository.owner}/${repository.repo}/contents/${filePath}`,
      undefined,
      connection || undefined
    );
    fileSha = existingFile.sha;
  } catch {
    // File does not exist yet; will create new
  }

  const putResponse = await githubRequest<{ content: { html_url: string }; commit: { sha: string } }>(
    `/repos/${repository.owner}/${repository.repo}/contents/${filePath}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: `chore(campuscode): update kanban sync log [${new Date().toISOString().split("T")[0]}]`,
        content: encodedContent,
        sha: fileSha,
      }),
      headers: { "Content-Type": "application/json" },
    },
    connection || undefined
  );

  return {
    success: true,
    fileUrl: putResponse.content?.html_url,
    commitSha: putResponse.commit?.sha,
    lastSyncedAt: kanbanLog.lastSyncedAt,
  };
}

function formatTaskForLog(task: {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  labels: string[];
  assignee?: { name: string; email: string } | null;
  subtasks?: Array<{ title: string; completed: boolean }>;
}) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    labels: task.labels.filter((l) => !l.startsWith("campuscode:")),
    assignee: task.assignee?.name || null,
    subtasks: (task.subtasks || []).map((s) => ({ title: s.title, completed: s.completed })),
  };
}
