// ============================================================
// CampusCode — Products API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'newest';
    const isFree = searchParams.get('free');
    const sellerId = searchParams.get('sellerId');

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
    if (sellerId) {
      where.sellerId = sellerId;
    }

    // Build sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { salesCount: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'price_low') orderBy = { price: 'asc' };
    else if (sort === 'price_high') orderBy = { price: 'desc' };

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

    return NextResponse.json({ products: dbProducts, total: dbProducts.length });
  } catch (error) {
    console.error('[API Products Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

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
        sellerId: session.user.id,
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
  } catch (error) {
    console.error('[API Products Create Error]:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
