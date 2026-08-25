// ============================================================
// CampusCode — Test Health Endpoint DB Connectivity
// ============================================================

import { checkDatabaseConnection } from "../src/lib/db";

async function test() {
  console.log("🩺 Testing checkDatabaseConnection()...");
  const res = await checkDatabaseConnection();
  console.log("Health Check Result:", res);
  if (res.ok) {
    console.log(`✅ Health check passed! Database latency: ${res.latencyMs}ms`);
  } else {
    console.error("❌ Health check failed:", res.error);
    process.exit(1);
  }
}

test();
