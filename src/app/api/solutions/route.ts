// ============================================================
// CampusCode — Solutions (Requirements) API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const clientId = searchParams.get('clientId');
    const mine = searchParams.get('mine');

    const where: Prisma.SolutionRequestWhereInput = {};

    if (mine === 'true') {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ requests: [], total: 0 });
      }
      where.clientId = session.user.id;
    } else if (clientId) {
      where.clientId = clientId;
    }

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

    return NextResponse.json({ requests: dbRequests, total: dbRequests.length });
  } catch (error) {
    console.error('[API Solutions Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const newRequest = await db.solutionRequest.create({
      data: {
        title: body.title,
        description: body.description || '',
        problemStatement: body.problemStatement || '',
        category: body.category || 'web',
        solutionType: body.solutionType || 'web',
        difficulty: body.difficulty || 'intermediate',
        status: 'OPEN',
        clientId: session.user.id,
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
  } catch (error) {
    console.error('[API Solutions Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create requirement' }, { status: 500 });
  }
}
