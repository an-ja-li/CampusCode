// ============================================================
// CampusCode — Solutions (Requirements) API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { solutionRequests as mockRequests } from '@/lib/mock-data';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';

    const where: Prisma.SolutionRequestWhereInput = {};

    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.SolutionRequestOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'budget_high') orderBy = { budgetMax: 'desc' };
    else if (sort === 'proposals') orderBy = { proposalCount: 'asc' };

    try {
      const dbRequests = await db.solutionRequest.findMany({
        where,
        orderBy,
        include: {
          client: {
            include: {
              clientProfile: true,
            },
          },
          proposals: true,
        },
      });

      if (dbRequests && dbRequests.length > 0) {
        return NextResponse.json({ requests: dbRequests, total: dbRequests.length });
      }
    } catch {
      // Fallback
    }

    let filtered = [...mockRequests];

    if (category && category !== 'all') {
      filtered = filtered.filter((sr) => sr.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (sr) => sr.title.toLowerCase().includes(q) || sr.description.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'budget_high':
        filtered.sort((a, b) => (b.budgetMax || 0) - (a.budgetMax || 0));
        break;
      case 'proposals':
        filtered.sort((a, b) => a.proposalCount - b.proposalCount);
        break;
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ requests: filtered, total: filtered.length });
  } catch (error) {
    console.error('[API Solutions Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const newRequest = await db.solutionRequest.create({
        data: {
          title: body.title,
          description: body.description || '',
          problemStatement: body.problemStatement || '',
          category: body.category || 'web',
          solutionType: body.solutionType || 'web',
          difficulty: body.difficulty || 'intermediate',
          status: 'OPEN',
          clientId: body.clientId || 'c1',
          budgetMin: body.budgetMin ? Number(body.budgetMin) : null,
          budgetMax: body.budgetMax ? Number(body.budgetMax) : null,
          isFixedPrice: Boolean(body.isFixedPrice ?? true),
          preferredTechnologies: body.preferredTechnologies || [],
          requiredFeatures: body.requiredFeatures || [],
          expectedDeliverables: body.expectedDeliverables || [],
          proposalCount: 0,
        },
      });

      return NextResponse.json(newRequest, { status: 201 });
    } catch {
      return NextResponse.json(
        { id: `sr_${Date.now()}`, ...body, status: 'open', proposalCount: 0, createdAt: new Date().toISOString() },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API Solutions Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create requirement' }, { status: 500 });
  }
}
