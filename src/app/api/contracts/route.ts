// ============================================================
// CampusCode — Contracts API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { Prisma, ContractStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    const where: Prisma.ContractWhereInput = {};

    if (userId) {
      where.OR = [
        { studentId: userId },
        { clientId: userId },
      ];
    }
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as ContractStatus;
    }

    const dbContracts = await db.contract.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          include: { studentProfile: true },
        },
        client: {
          include: { clientProfile: true },
        },
        solutionRequest: true,
        milestones: true,
      },
    });

    return NextResponse.json({ contracts: dbContracts, total: dbContracts.length });
  } catch (error) {
    console.error('[API Contracts Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
