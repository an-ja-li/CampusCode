import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { listInstallationRepositories, listUserRepositories } from "@/lib/github-project-sync";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const { fullName } = await request.json();
  const project = await db.project.findUnique({
    where: { id },
    select: { ownerId: true, githubInstallationId: true },
  });
  if (!project || project.ownerId !== session.user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Support clearing/unlinking repository
  if (!fullName) {
    await db.project.update({
      where: { id },
      data: { githubRepo: null },
    });
    return NextResponse.json({ githubRepo: null });
  }

  const installationId = project.githubInstallationId;

  try {
    if (installationId) {
      const repositories = await listInstallationRepositories(installationId);
      if (!repositories.some((repository) => repository.full_name.toLowerCase() === fullName.toLowerCase())) {
        return NextResponse.json({ error: "That repository is not part of this GitHub installation." }, { status: 422 });
      }
    } else {
      const userRepositories = await listUserRepositories(session.user.id);
      if (userRepositories.length > 0 && !userRepositories.some((r) => r.full_name.toLowerCase() === fullName.toLowerCase())) {
        return NextResponse.json({ error: "You do not have access to that GitHub repository." }, { status: 422 });
      }
    }

    await db.project.update({
      where: { id },
      data: { githubRepo: fullName },
    });
    return NextResponse.json({ githubRepo: fullName });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not select repository" }, { status: 422 });
  }
}
