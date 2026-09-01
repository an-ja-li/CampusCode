// ============================================================
// CampusCode — Project Detail API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await db.project.findUnique({
      where: { id },
      include: {
        owner: {
          include: { studentProfile: true },
        },
        members: {
          include: { user: true },
        },
        tasks: {
          include: { subtasks: true, comments: true },
        },
        milestones: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('[API Project Detail Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        name: body.name !== undefined ? body.name : undefined,
        description: body.description !== undefined ? body.description : undefined,
        githubRepo: body.githubRepo !== undefined ? body.githubRepo : undefined,
        category: body.category !== undefined ? body.category : undefined,
        technologies: body.technologies !== undefined ? body.technologies : undefined,
        status: body.status !== undefined ? body.status : undefined,
        progress: body.progress !== undefined ? body.progress : undefined,
        isPublished: body.isPublished !== undefined ? body.isPublished : undefined,
      },
      include: {
        owner: true,
        members: { include: { user: true } },
        tasks: { include: { subtasks: true } },
        milestones: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API Project PATCH Error]:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Verify ownership
    const project = await db.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Project Delete Error]:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
