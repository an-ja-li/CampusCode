// ============================================================
// CampusCode — Proposals API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { proposals } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const requestId = searchParams.get('requestId');
  const status = searchParams.get('status');

  let filtered = [...proposals];

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
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    { id: `prop_${Date.now()}`, ...body, status: 'pending' },
    { status: 201 }
  );
}
