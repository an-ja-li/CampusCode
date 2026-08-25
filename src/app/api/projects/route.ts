// ============================================================
// CampusCode — Projects API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { projects as mockProjects } from '@/lib/mock-data';
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

    try {
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

      if (dbProjects && dbProjects.length > 0) {
        return NextResponse.json({ projects: dbProjects, total: dbProjects.length });
      }
    } catch {
      // Fallback
    }

    let filtered = [...mockProjects];
    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (userId) {
      filtered = filtered.filter((p) => p.ownerId === userId);
    }

    return NextResponse.json({ projects: filtered, total: filtered.length });
  } catch (error) {
    console.error('[API Projects Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const newProject = await db.project.create({
        data: {
          name: body.name,
          description: body.description || '',
          category: body.category || 'general',
          status: 'PLANNING',
          progress: 0,
          ownerId: body.ownerId || 'u1',
          githubRepo: body.githubRepo || null,
          technologies: body.technologies || [],
          isPublished: false,
        },
      });

      return NextResponse.json(newProject, { status: 201 });
    } catch {
      return NextResponse.json(
        { id: `proj_${Date.now()}`, ...body, status: 'planning', progress: 0, createdAt: new Date().toISOString() },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API Projects Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
