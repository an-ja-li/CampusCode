// ============================================================
// CampusCode — Products API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products as mockProducts } from '@/lib/mock-data';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const isFree = searchParams.get('free');

    // Build database where clause
    const where: Prisma.ProductWhereInput = {};

    if (category && category !== 'all') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (isFree === 'true') {
      where.isFree = true;
    } else if (isFree === 'false') {
      where.isFree = false;
    }

    // Build sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { salesCount: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'price_low') orderBy = { price: 'asc' };
    else if (sort === 'price_high') orderBy = { price: 'desc' };

    try {
      const dbProducts = await db.product.findMany({
        where,
        orderBy,
        include: {
          seller: {
            include: {
              studentProfile: true,
            },
          },
        },
      });

      if (dbProducts && dbProducts.length > 0) {
        return NextResponse.json({ products: dbProducts, total: dbProducts.length });
      }
    } catch {
      // Fallback if DB is not initialized yet in development
    }

    // Fallback in development when database is empty
    let filtered = [...mockProducts];
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

    return NextResponse.json({ products: filtered, total: filtered.length });
  } catch (error) {
    console.error('[API Products Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      const newProduct = await db.product.create({
        data: {
          name: body.name,
          slug: body.slug || `${body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
          description: body.description || '',
          shortDescription: body.shortDescription || '',
          category: body.category || 'templates',
          price: Number(body.price) || 0,
          isFree: Boolean(body.isFree),
          status: 'PENDING_REVIEW',
          sellerId: body.sellerId || 'u1',
          technologies: body.technologies || [],
          tags: body.tags || [],
          features: body.features || [],
          requirements: body.requirements || [],
          license: body.license || 'Commercial',
          demoUrl: body.demoUrl || null,
          githubUrl: body.githubUrl || null,
          version: body.version || '1.0.0',
        },
      });

      return NextResponse.json(newProduct, { status: 201 });
    } catch {
      // Fallback response if DB offline
      return NextResponse.json(
        { id: `prod_${Date.now()}`, ...body, status: 'pending_review', createdAt: new Date().toISOString() },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[API Products Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
