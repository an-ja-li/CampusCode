// ============================================================
// CampusCode — Database Seed Script
// ============================================================
// Run with: npx prisma db seed
// Populates all mock students, clients, products, requests,
// projects, tasks, proposals, and contracts into PostgreSQL.
// ============================================================

import { PrismaClient, UserRole, StudentLevel, ProjectStatus, TaskStatus, TaskPriority, ProductStatus, SolutionRequestStatus, ProposalStatus, ContractStatus, MilestoneStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CampusCode database seed...");

  // Clear existing records
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.contractMilestone.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.proposalMilestone.deleteMany();
  await prisma.proposal.deleteMany();
  await prisma.solutionRequest.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productReview.deleteMany();
  await prisma.product.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.subTask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMilestone.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.clientProfile.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleared old records.");

  // ── Categories ───────────────────────────────────────────
  const categories = [
    { name: "Full-Stack Templates", slug: "templates", icon: "Layers", productCount: 12, requestCount: 8 },
    { name: "SaaS Starter Kits", slug: "saas", icon: "Rocket", productCount: 9, requestCount: 14 },
    { name: "AI & ML Models", slug: "ai-ml", icon: "Brain", productCount: 15, requestCount: 22 },
    { name: "APIs & Microservices", slug: "apis", icon: "Server", productCount: 8, requestCount: 6 },
    { name: "Mobile Applications", slug: "mobile", icon: "Smartphone", productCount: 11, requestCount: 16 },
    { name: "UI Kits & Components", slug: "ui-kits", icon: "Palette", productCount: 14, requestCount: 5 },
    { name: "Developer Tools", slug: "devtools", icon: "Terminal", productCount: 7, requestCount: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.create({ data: cat });
  }

  // ── Users & Students ─────────────────────────────────────
  const harsh = await prisma.user.create({
    data: {
      name: "Harsh Vardhan",
      email: "harsh@campuscode.dev",
      role: UserRole.STUDENT,
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      studentProfile: {
        create: {
          college: "IIT Bombay",
          degree: "B.Tech Computer Science",
          graduationYear: 2026,
          skills: ["React", "Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "PostgreSQL", "Docker", "Tailwind CSS"],
          github: "https://github.com/harsh",
          linkedin: "https://linkedin.com/in/harsh",
          bio: "Full-stack engineer passionate about building high-performance developer tools and AI products.",
          level: StudentLevel.TOP_DEVELOPER,
          rating: 4.9,
          reviewCount: 34,
          totalSales: 89,
          totalEarnings: 145000,
          completedProjects: 14,
          portfolioUrl: "harsh",
          badges: {
            create: [
              { name: "Top Seller", icon: "Trophy", description: "Earned over ₹1,00,000 in software sales" },
              { name: "Verified Builder", icon: "ShieldCheck", description: "Identity and college enrollment verified" },
              { name: "Speed Demon", icon: "Zap", description: "Delivered 10+ milestone contracts ahead of schedule" },
            ],
          },
        },
      },
    },
  });

  const ananya = await prisma.user.create({
    data: {
      name: "Ananya Sharma",
      email: "ananya@campuscode.dev",
      role: UserRole.STUDENT,
      isVerified: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      studentProfile: {
        create: {
          college: "BITS Pilani",
          degree: "B.E. Computer Science",
          graduationYear: 2025,
          skills: ["Python", "PyTorch", "NLP", "FastAPI", "React", "Hugging Face"],
          github: "https://github.com/ananya",
          bio: "Machine learning enthusiast specializing in NLP, transformers, and automated document analysis.",
          level: StudentLevel.EXPERT,
          rating: 4.85,
          reviewCount: 22,
          totalSales: 45,
          totalEarnings: 82000,
          completedProjects: 9,
          portfolioUrl: "ananya",
        },
      },
    },
  });

  // ── Client ───────────────────────────────────────────────
  const clientTechCorp = await prisma.user.create({
    data: {
      name: "Vikram Malhotra",
      email: "vikram@techstart.io",
      role: UserRole.CLIENT,
      isVerified: true,
      clientProfile: {
        create: {
          organization: "TechStart Solutions",
          website: "https://techstart.io",
          description: "Early-stage venture studio building enterprise automation products.",
          profileType: "startup",
          isVerified: true,
          rating: 4.9,
          reviewCount: 18,
          totalSpent: 240000,
          projectsPosted: 7,
        },
      },
    },
  });

  // ── Projects ─────────────────────────────────────────────
  const proj1 = await prisma.project.create({
    data: {
      name: "AI Resume Screener & Ranking Engine",
      description: "An automated NLP-driven applicant screening tool that extracts skill vectors, evaluates experience fit, and scores resumes.",
      category: "ai-ml",
      status: ProjectStatus.ACTIVE,
      progress: 75,
      ownerId: harsh.id,
      githubRepo: "harsh/ai-resume-screener",
      technologies: ["Next.js", "Python", "FastAPI", "PostgreSQL", "Tailwind CSS"],
      isPublished: true,
      members: {
        create: [
          { userId: harsh.id, role: "Lead Architect" },
          { userId: ananya.id, role: "ML Engineer" },
        ],
      },
      tasks: {
        create: [
          { title: "Implement PDF Parser & OCR Pipeline", status: TaskStatus.DONE, priority: TaskPriority.HIGH, creatorId: harsh.id, assigneeId: ananya.id },
          { title: "Cosine Similarity Scoring Algorithm", status: TaskStatus.DONE, priority: TaskPriority.URGENT, creatorId: harsh.id, assigneeId: ananya.id },
          { title: "Multi-tenant Dashboard UI", status: TaskStatus.IN_PROGRESS, priority: TaskPriority.HIGH, creatorId: harsh.id, assigneeId: harsh.id },
          { title: "Webhook & ATS Integrations", status: TaskStatus.TODO, priority: TaskPriority.MEDIUM, creatorId: harsh.id, assigneeId: harsh.id },
        ],
      },
    },
  });

  // ── Products ─────────────────────────────────────────────
  await prisma.product.create({
    data: {
      name: "NextAuth & Stripe SaaS Boilerplate 2026",
      slug: "nextauth-stripe-saas-boilerplate",
      description: "A battle-tested production starter for Next.js 15 App Router featuring dark mode, multi-role RBAC, Stripe billing, and transactional email setup.",
      shortDescription: "Complete full-stack SaaS boilerplate with authentication, payments, and dashboards.",
      category: "saas",
      price: 999,
      isFree: false,
      status: ProductStatus.PUBLISHED,
      sellerId: harsh.id,
      projectId: proj1.id,
      technologies: ["Next.js 15", "TypeScript", "Tailwind v4", "Prisma", "Stripe"],
      tags: ["saas", "boilerplate", "auth", "billing", "react"],
      features: ["Next.js 15 App Router", "Stripe Checkout & Webhooks", "Prisma ORM with Postgres", "Dark/Light mode themes", "Tailwind CSS v4"],
      requirements: ["Node.js 18+", "PostgreSQL connection string", "Stripe API keys"],
      license: "Commercial",
      demoUrl: "https://saas-demo.campuscode.dev",
      githubUrl: "https://github.com/harsh/saas-boilerplate",
      rating: 4.95,
      reviewCount: 42,
      salesCount: 118,
      downloadCount: 350,
      version: "2.4.0",
    },
  });

  // ── Solution Request ─────────────────────────────────────
  const solReq = await prisma.solutionRequest.create({
    data: {
      title: "Real-time Attendance & Geo-fencing Web App",
      description: "Looking for student builders to create a responsive web portal allowing campus staff to record student attendance via QR codes and GPS geo-fencing.",
      problemStatement: "Manual attendance rolls cause 15-minute delays per lecture. Need an automated, verifiable QR + GPS check-in system.",
      category: "mobile",
      solutionType: "web",
      difficulty: "intermediate",
      status: SolutionRequestStatus.OPEN,
      clientId: clientTechCorp.id,
      budgetMin: 25000,
      budgetMax: 40000,
      isFixedPrice: true,
      preferredTechnologies: ["Next.js", "Node.js", "PostgreSQL", "Leaflet / Mapbox"],
      requiredFeatures: ["QR Scanner check-in", "GPS radius boundary check", "Admin export to CSV/Excel", "Student attendance analytics"],
      expectedDeliverables: ["Frontend & Backend code", "PostgreSQL schema", "Deployment guide to Vercel/Render"],
      proposalCount: 3,
    },
  });

  // ── Proposal & Contract ──────────────────────────────────
  const prop = await prisma.proposal.create({
    data: {
      solutionRequestId: solReq.id,
      studentId: harsh.id,
      content: "I have prior experience developing geolocation and real-time scanning tools. I will build this using Next.js 15 and PostgreSQL with PostGIS for fast coordinate checking.",
      price: 32000,
      estimatedDelivery: 21,
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
      status: ProposalStatus.ACCEPTED,
      milestones: {
        create: [
          { title: "UI Wireframes & Database Schema", description: "Complete responsive layout and PostGIS schema", amount: 8000, durationDays: 5 },
          { title: "QR Code Engine & Geo-location Logic", description: "Scan generation, radius validation, and attendance logs", amount: 14000, durationDays: 10 },
          { title: "Admin Analytics & CSV Export", description: "Classroom reports, absence alerts, and deployment", amount: 10000, durationDays: 6 },
        ],
      },
    },
  });

  await prisma.contract.create({
    data: {
      solutionRequestId: solReq.id,
      proposalId: prop.id,
      studentId: harsh.id,
      clientId: clientTechCorp.id,
      totalAmount: 32000,
      platformFee: 3200,
      studentEarnings: 28800,
      status: ContractStatus.ACTIVE,
      milestones: {
        create: [
          { title: "UI Wireframes & Database Schema", description: "Complete responsive layout and schema", amount: 8000, status: MilestoneStatus.APPROVED, completedAt: new Date() },
          { title: "QR Code Engine & Geo-location Logic", description: "Scan generation, radius validation", amount: 14000, status: MilestoneStatus.IN_PROGRESS },
          { title: "Admin Analytics & CSV Export", description: "Classroom reports, absence alerts, and deployment", amount: 10000, status: MilestoneStatus.PENDING },
        ],
      },
    },
  });

  console.log("✅ CampusCode database seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
