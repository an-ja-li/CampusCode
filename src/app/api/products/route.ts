// ============================================================
// CampusCode — Products API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const isFree = searchParams.get('free');

  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  if (isFree === 'true') {
    filtered = filtered.filter((p) => p.isFree);
  } else if (isFree === 'false') {
    filtered = filtered.filter((p) => !p.isFree);
  }

  switch (sort) {
    case 'popular':
      filtered.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'price_low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    default:
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json({ products: filtered, total: filtered.length });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // TODO: Validate with Zod, save to database
  return NextResponse.json(
    { id: `prod_${Date.now()}`, ...body, status: 'pending_review' },
    { status: 201 }
  );
}
