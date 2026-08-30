// ============================================================
// CampusCode — Single Contract API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const contract = await db.contract.findUnique({
      where: { id },
      include: {
        student: {
          include: { studentProfile: true },
        },
        client: {
          include: { clientProfile: true },
        },
        solutionRequest: true,
        milestones: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error('[API Single Contract Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 });
  }
}
