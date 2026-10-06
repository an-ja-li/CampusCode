import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listInstallationRepositories, listUserRepositories } from "@/lib/github-project-sync";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id }, select: { ownerId: true } });
  if (!project || project.ownerId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const projectWithInstallation = await db.project.findUnique({
    where: { id },
    select: { githubInstallationId: true },
  });
  const installationId = projectWithInstallation?.githubInstallationId;

  try {
    if (installationId) {
      const repos = await listInstallationRepositories(installationId);
      return NextResponse.json({ connected: true, repositories: repos, authType: "app" });
    }

    // Fall back to User's OAuth repositories
    const userRepos = await listUserRepositories(session.user.id);
    if (userRepos.length > 0) {
      return NextResponse.json({ connected: true, repositories: userRepos, authType: "oauth" });
    }

    return NextResponse.json({ connected: false, repositories: [] });
  } catch (error) {
    return NextResponse.json({
      connected: false,
      repositories: [],
      error: error instanceof Error ? error.message : "Could not load repositories",
    }, { status: 422 });
  }
}
