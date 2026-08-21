// ============================================================
// CampusCode — Contracts API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { contracts } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');

  let filtered = [...contracts];

  if (userId) {
    filtered = filtered.filter((c) => c.studentId === userId || c.clientId === userId);
  }
  if (status) {
    filtered = filtered.filter((c) => c.status === status);
  }

  return NextResponse.json({ contracts: filtered, total: filtered.length });
}
