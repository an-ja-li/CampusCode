import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createGitHubConnectState } from "@/lib/github-connect-state";

export async function GET(request: NextRequest) {
  const session = await auth();
  const projectId = new URL(request.url).searchParams.get("projectId");
  const appSlug = process.env.GITHUB_APP_SLUG;
  if (!session?.user?.id) return NextResponse.redirect(new URL("/login", request.url));
  if (!projectId || !appSlug) return NextResponse.redirect(new URL(`/projects/${projectId || ""}?github=unavailable`, request.url));

  const project = await db.project.findUnique({ where: { id: projectId }, select: { ownerId: true } });
  if (!project || project.ownerId !== session.user.id) return NextResponse.redirect(new URL("/projects?github=forbidden", request.url));

  const state = createGitHubConnectState(projectId, session.user.id);
  return NextResponse.redirect(`https://github.com/apps/${appSlug}/installations/new?state=${encodeURIComponent(state)}`);
}
