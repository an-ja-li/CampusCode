// ============================================================
// CampusCode — Proposals API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { proposals as mockProposals } from '@/lib/mock-data';
import type { Prisma, ProposalStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const requestId = searchParams.get('requestId');
    const status = searchParams.get('status');

    const where: Prisma.ProposalWhereInput = {};

    if (userId) where.studentId = userId;
    if (requestId) where.solutionRequestId = requestId;
    if (status && status !== 'all') where.status = status.toUpperCase() as ProposalStatus;

    try {
      const dbProposals = await db.proposal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            include: {
              studentProfile: true,
            },
          },
          solutionRequest: true,
          milestones: true,
        },
      });

      if (dbProposals && dbProposals.length > 0) {
        return NextResponse.json({ proposals: dbProposals, total: dbProposals.length });
      }
    } catch {
      // Fallback
    }

    let filtered = [...mockProposals];

    if (userId) {
      filtered = filtered.filter((p) => p.studentId === userId);
    }
    if (requestId) {
      filtered = filtered.filter((p) => p.solutionRequestId === requestId);
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    return NextResponse.json({ proposals: filtered, total: filtered.length });
  } catch (error) {
    console.error('[API Proposals Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const newProposal = await db.proposal.create({
        data: {
          solutionRequestId: body.solutionRequestId,
          studentId: body.studentId || 'u1',
          content: body.content,
          price: Number(body.price),
          estimatedDelivery: Number(body.estimatedDelivery) || 14,
          technologies: body.technologies || [],
          status: 'PENDING',
          milestones: body.milestones
            ? {
                create: body.milestones.map((m: { title: string; description?: string; amount: number; durationDays?: number }) => ({
                  title: m.title,
                  description: m.description || '',
                  amount: Number(m.amount),
                  durationDays: Number(m.durationDays) || 5,
                })),
              }
            : undefined,
        },
        include: {
          milestones: true,
        },
      });

      // Increment proposalCount on solution request
      await db.solutionRequest.update({
        where: { id: body.solutionRequestId },
        data: { proposalCount: { increment: 1 } },
      }).catch(() => {});

      return NextResponse.json(newProposal, { status: 201 });
    } catch {
      return NextResponse.json(
        { id: `prop_${Date.now()}`, ...body, status: 'pending', createdAt: new Date().toISOString() },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API Proposals Create Error]:', error);
    return NextResponse.json({ error: 'Failed to submit proposal' }, { status: 500 });
  }
}
