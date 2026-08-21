// ============================================================
// CampusCode — Solutions API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { solutionRequests } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';

  let filtered = [...solutionRequests];

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
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    { id: `sr_${Date.now()}`, ...body, status: 'open', proposalCount: 0 },
    { status: 201 }
  );
}
