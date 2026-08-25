// ============================================================
// CampusCode — Prisma Database Client Singleton
// ============================================================
// Supports both local development and cloud PostgreSQL (Neon, Supabase, Railway).
// Uses global singleton pattern to prevent connection exhaustion in serverless & hot-reload.
// ============================================================

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

/**
 * Check if database is reachable
 */
export async function checkDatabaseConnection(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { ok: true, latencyMs: Date.now() - start };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Database connection failed';
    return { ok: false, error: message };
  }
}

export default db;
