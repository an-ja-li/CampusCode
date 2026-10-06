import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { pullProjectIssuesFromGitHub } from "@/lib/github-project-sync";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const project = await db.project.findUnique({ where: { id }, select: { ownerId: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
  if (project.ownerId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await pullProjectIssuesFromGitHub(id);
    const updatedProject = await db.project.findUnique({
      where: { id },
      include: { tasks: { include: { subtasks: true, comments: true } } },
    });
    return NextResponse.json({ ...result, project: updatedProject });
  } catch (error) {
    const message = error instanceof Error ? error.message : "GitHub sync failed";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
