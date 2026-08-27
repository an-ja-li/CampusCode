// ============================================================
// CampusCode — Solution Request Detail API Route
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

    const solutionReq = await db.solutionRequest.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            clientProfile: true,
          },
        },
        proposals: {
          include: {
            student: {
              include: { studentProfile: true },
            },
            milestones: true,
          },
        },
        contracts: true,
      },
    });

    if (!solutionReq) {
      return NextResponse.json({ error: 'Solution request not found' }, { status: 404 });
    }

    return NextResponse.json(solutionReq);
  } catch (error) {
    console.error('[API Solution Detail GET Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch requirement' }, { status: 500 });
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
    const req = await db.solutionRequest.findUnique({
      where: { id },
      select: { clientId: true },
    });

    if (!req) {
      return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
    }

    if (req.clientId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.solutionRequest.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API Solution Delete Error]:', error);
    return NextResponse.json({ error: 'Failed to delete requirement' }, { status: 500 });
  }
}
