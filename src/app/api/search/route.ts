// ============================================================
// CampusCode — Global Search API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as mockProducts, solutionRequests as mockRequests, students as mockStudents, projects as mockProjects } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase()?.trim();
    const type = searchParams.get('type'); // product, solution, student, project

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const results: { id: string; type: string; title: string; subtitle: string; url: string }[] = [];

    try {
      if (!type || type === 'product') {
        const dbProducts = await db.product.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 6,
        });

        dbProducts.forEach((p) => {
          results.push({
            id: p.id,
            type: 'product',
            title: p.name,
            subtitle: `${p.category} • ${p.isFree ? 'Free' : `₹${p.price}`}`,
            url: `/marketplace/${p.id}`,
          });
        });
      }

      if (!type || type === 'solution') {
        const dbRequests = await db.solutionRequest.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 6,
        });

        dbRequests.forEach((sr) => {
          results.push({
            id: sr.id,
            type: 'solution',
            title: sr.title,
            subtitle: `${sr.category} • ${sr.proposalCount} proposals`,
            url: `/solutions/${sr.id}`,
          });
        });
      }

      if (!type || type === 'student') {
        const dbUsers = await db.user.findMany({
          where: {
            role: 'STUDENT',
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: { studentProfile: true },
          take: 6,
        });

        dbUsers.forEach((s) => {
          results.push({
            id: s.id,
            type: 'student',
            title: s.name,
            subtitle: s.studentProfile?.college || 'Student Developer',
            url: `/portfolio/${s.studentProfile?.portfolioUrl || s.id}`,
          });
        });
      }

      if (!type || type === 'project') {
        const dbProjects = await db.project.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          },
          take: 6,
        });

        dbProjects.forEach((p) => {
          results.push({
            id: p.id,
            type: 'project',
            title: p.name,
            subtitle: `${p.status} • ${p.progress}%`,
            url: `/projects/${p.id}`,
          });
        });
      }

      if (results.length > 0) {
        return NextResponse.json({ results: results.slice(0, 20), total: results.length });
      }
    } catch {
      // Fallback
    }

    // Fallback when database is empty
    if (!type || type === 'product') {
      mockProducts.forEach((p) => {
        if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
          results.push({
            id: p.id,
            type: 'product',
            title: p.name,
            subtitle: `${p.category} • ${p.isFree ? 'Free' : `₹${p.price}`}`,
            url: `/marketplace/${p.id}`,
          });
        }
      });
    }

    if (!type || type === 'solution') {
      mockRequests.forEach((sr) => {
        if (sr.title.toLowerCase().includes(query) || sr.description.toLowerCase().includes(query)) {
          results.push({
            id: sr.id,
            type: 'solution',
            title: sr.title,
            subtitle: `${sr.category} • ${sr.proposalCount} proposals`,
            url: `/solutions/${sr.id}`,
          });
        }
      });
    }

    if (!type || type === 'student') {
      mockStudents.forEach((s) => {
        if (s.name.toLowerCase().includes(query) || s.studentProfile?.skills.some((sk) => sk.toLowerCase().includes(query))) {
          results.push({
            id: s.id,
            type: 'student',
            title: s.name,
            subtitle: s.studentProfile?.college || s.role,
            url: `/portfolio/${s.studentProfile?.portfolioUrl || s.id}`,
          });
        }
      });
    }

    if (!type || type === 'project') {
      mockProjects.forEach((p) => {
        if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
          results.push({
            id: p.id,
            type: 'project',
            title: p.name,
            subtitle: `${p.status} • ${p.progress}%`,
            url: `/projects/${p.id}`,
          });
        }
      });
    }

    return NextResponse.json({ results: results.slice(0, 20), total: results.length });
  } catch (error) {
    console.error('[API Search Error]:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
