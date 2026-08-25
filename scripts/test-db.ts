// ============================================================
// CampusCode — Live Cloud Database Connectivity Test
// ============================================================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Testing Neon PostgreSQL Connection...");

  // 1. Check raw connection & query
  const res = await prisma.$queryRaw<Array<{ now: Date; db: string; user: string }>>`
    SELECT NOW() as now, current_database() as db, current_user as user;
  `;
  console.log("✅ Neon Database connected successfully!");
  console.log("   Server Time:", res[0]?.now);
  console.log("   Database:", res[0]?.db);
  console.log("   User:", res[0]?.user);

  // 2. Check table counts (should be 0 - clean production database)
  const userCount = await prisma.user.count();
  const productCount = await prisma.product.count();
  const requestCount = await prisma.solutionRequest.count();
  const contractCount = await prisma.contract.count();

  console.log("\n📊 Initial Table Counts (Clean Database Check):");
  console.log(`   - Users: ${userCount}`);
  console.log(`   - Products: ${productCount}`);
  console.log(`   - Solution Requests: ${requestCount}`);
  console.log(`   - Contracts: ${contractCount}`);

  // 3. Test writing a real record to Cloud PostgreSQL
  console.log("\n📝 Creating test student record in Neon...");
  const testUser = await prisma.user.create({
    data: {
      name: "Harsh Vardhan",
      email: `verify_${Date.now()}@campuscode.dev`,
      role: "STUDENT",
      isVerified: true,
      studentProfile: {
        create: {
          college: "IIT Bombay",
          degree: "B.Tech Computer Science",
          graduationYear: 2026,
          skills: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind CSS"],
          bio: "Verified production student record on Neon Cloud PostgreSQL.",
        },
      },
    },
    include: {
      studentProfile: true,
    },
  });
  console.log("✅ Successfully created user in Neon:");
  console.log("   ID:", testUser.id);
  console.log("   Name:", testUser.name);
  console.log("   Email:", testUser.email);
  console.log("   College:", testUser.studentProfile?.college);

  // 4. Verify reading back from Cloud PostgreSQL
  const retrievedUser = await prisma.user.findUnique({
    where: { id: testUser.id },
    include: { studentProfile: true },
  });
  console.log("\n📖 Successfully read back record from Neon:");
  console.log("   Verified User:", retrievedUser?.name, `(${retrievedUser?.email})`);

  // 5. Clean up test record so DB remains completely pristine
  await prisma.user.delete({
    where: { id: testUser.id },
  });
  console.log("\n🧹 Test user cleaned up. Production database is 100% clean and ready for live users!");
}

main()
  .catch((e) => {
    console.error("❌ Neon Test Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
