import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { db } from "@/lib/db";
import { applyGitHubIssue, getRepositoryParts } from "@/lib/github-project-sync";

function hasValidSignature(payload: string, signature: string | null) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(payload).digest("hex")}`;
  const received = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

export async function POST(request: NextRequest) {
  const payload = await request.text();
  if (!hasValidSignature(payload, request.headers.get("x-hub-signature-256"))) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const event = request.headers.get("x-github-event");
  if (event !== "issues") return NextResponse.json({ received: true });

  try {
    const data = JSON.parse(payload) as { repository?: { full_name?: string }; issue?: unknown };
    if (!data.repository?.full_name || !data.issue) return NextResponse.json({ received: true });

    const projects = await db.project.findMany({ where: { githubRepo: { not: null } }, select: { id: true, githubRepo: true } });
    const project = projects.find((candidate) => getRepositoryParts(candidate.githubRepo)?.fullName.toLowerCase() === data.repository?.full_name?.toLowerCase());
    if (!project) return NextResponse.json({ received: true });

    await applyGitHubIssue(project.id, data.issue as Parameters<typeof applyGitHubIssue>[1]);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[GitHub webhook] Failed to apply issue update", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
