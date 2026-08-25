// ============================================================
// CampusCode — Production Health Check Endpoint
// ============================================================
// Endpoint: GET /api/health
// Used by cloud providers (Railway, Render, AWS, Kubernetes, Vercel)
// for automated uptime monitoring and database connectivity verification.
// ============================================================

import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const dbStatus = await checkDatabaseConnection();

  const healthData = {
    status: dbStatus.ok ? 'healthy' : 'degraded',
    app: 'CampusCode',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: dbStatus.ok,
      latencyMs: dbStatus.latencyMs ?? null,
      error: dbStatus.error ?? null,
    },
    system: {
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      nodeVersion: process.version,
    },
    responseTimeMs: Date.now() - startTime,
  };

  const statusCode = dbStatus.ok ? 200 : 503;

  return NextResponse.json(healthData, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
