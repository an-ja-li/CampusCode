// ============================================================
// CampusCode — Projects API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { Prisma, ProjectStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    const where: Prisma.ProjectWhereInput = {};

    if (status && status !== 'all') {
      where.status = status.toUpperCase() as ProjectStatus;
    }
    if (userId) {
      where.ownerId = userId;
    }

    const dbProjects = await db.project.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        milestones: true,
      },
    });

    return NextResponse.json({ projects: dbProjects, total: dbProjects.length });
  } catch (error) {
    console.error('[API Projects Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const newProject = await db.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category || 'general',
        status: 'PLANNING',
        progress: 0,
        ownerId: session.user.id,
        githubRepo: body.githubRepo || null,
        technologies: body.technologies || [],
        isPublished: false,
      },
      include: {
        members: {
          include: { user: true },
        },
        tasks: true,
        milestones: true,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[API Projects Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
