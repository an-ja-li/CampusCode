import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readGitHubConnectState } from "@/lib/github-connect-state";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const state = readGitHubConnectState(url.searchParams.get("state"));
  const installationId = url.searchParams.get("installation_id");
  if (!state || !installationId) return NextResponse.redirect(new URL("/projects?github=connection-failed", request.url));

  const project = await db.project.findUnique({ where: { id: state.projectId }, select: { ownerId: true } });
  if (!project || project.ownerId !== state.userId) return NextResponse.redirect(new URL("/projects?github=connection-failed", request.url));

  await db.project.update({
    where: { id: state.projectId },
    data: { githubInstallationId: installationId },
  });
  return NextResponse.redirect(new URL(`/projects/${state.projectId}?github=connected`, request.url));
}
