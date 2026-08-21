// ============================================================
// CampusCode — Projects API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const userId = searchParams.get('userId');

  let filtered = [...projects];

  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }
  if (userId) {
    filtered = filtered.filter((p) => p.ownerId === userId);
  }

  return NextResponse.json({ projects: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    { id: `proj_${Date.now()}`, ...body, status: 'planning', progress: 0 },
    { status: 201 }
  );
}
