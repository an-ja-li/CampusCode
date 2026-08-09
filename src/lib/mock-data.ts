// ============================================================
// CampusCode — Comprehensive Mock Data
// ============================================================

import type {
  User, Product, SolutionRequest, Proposal, Contract,
  Project, Task, Conversation, Message, Notification,
  Review, Transaction, Wallet, PlatformStats, AdminMetrics,
  Category, Badge, AIMatchScore
} from '@/types';

// ── Users (Students) ───────────────────────────────────────

export const students: User[] = [
  {
    id: 'u1',
    name: 'Harsh Vardhan',
    email: 'harsh@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-03-15',
    updatedAt: '2026-08-01',
    studentProfile: {
      id: 'sp1', userId: 'u1', college: 'NIT Trichy', degree: 'B.Tech CSE',
      graduationYear: 2026, skills: ['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'PostgreSQL', 'Machine Learning'],
      github: 'harshvardhan', linkedin: 'harshvardhan', bio: 'Full-stack developer passionate about building products that solve real problems. Open source contributor.',
      level: 'expert', rating: 4.9, reviewCount: 47, totalSales: 87, totalEarnings: 124500, completedProjects: 12, portfolioUrl: '@harsh',
      badges: [
        { id: 'b1', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-03-20' },
        { id: 'b2', name: '10 Projects Completed', icon: '🏆', description: 'Completed 10+ projects', earnedAt: '2026-01-15' },
        { id: 'b3', name: '5-Star Developer', icon: '⭐', description: 'Maintained 5-star rating', earnedAt: '2025-11-01' },
        { id: 'b4', name: 'Fast Delivery', icon: '⚡', description: 'Consistently delivers on time', earnedAt: '2025-09-10' },
      ],
    },
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-05-10',
    updatedAt: '2026-07-28',
    studentProfile: {
      id: 'sp2', userId: 'u2', college: 'IIT Delhi', degree: 'B.Tech AI & ML',
      graduationYear: 2027, skills: ['Python', 'TensorFlow', 'PyTorch', 'React', 'FastAPI', 'scikit-learn', 'OpenCV'],
      github: 'priyasharma', linkedin: 'priyasharma', bio: 'AI/ML enthusiast building intelligent solutions. Research intern at Google AI.',
      level: 'builder', rating: 4.8, reviewCount: 32, totalSales: 54, totalEarnings: 89000, completedProjects: 8, portfolioUrl: '@priya',
      badges: [
        { id: 'b5', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-05-15' },
        { id: 'b6', name: '100 Sales', icon: '💰', description: 'Reached 100 sales', earnedAt: '2026-05-01' },
      ],
    },
  },
  {
    id: 'u3',
    name: 'Rahul Mehta',
    email: 'rahul@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-01-20',
    updatedAt: '2026-08-05',
    studentProfile: {
      id: 'sp3', userId: 'u3', college: 'BITS Pilani', degree: 'M.Tech Software Eng.',
      graduationYear: 2026, skills: ['Java', 'Spring Boot', 'React', 'Angular', 'PostgreSQL', 'Docker', 'Kubernetes'],
      github: 'rahulmehta', linkedin: 'rahulmehta', bio: 'Backend specialist. Building scalable systems. Ex-intern at Amazon.',
      level: 'expert', rating: 4.7, reviewCount: 38, totalSales: 45, totalEarnings: 156000, completedProjects: 15, portfolioUrl: '@rahul',
      badges: [
        { id: 'b7', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-01-25' },
        { id: 'b8', name: 'Top Developer', icon: '👑', description: 'Top 1% developer', earnedAt: '2026-06-01' },
      ],
    },
  },
  {
    id: 'u4',
    name: 'Ananya Gupta',
    email: 'ananya@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-06-01',
    updatedAt: '2026-07-15',
    studentProfile: {
      id: 'sp4', userId: 'u4', college: 'VIT Vellore', degree: 'B.Tech CSE',
      graduationYear: 2027, skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Node.js', 'MongoDB'],
      github: 'ananyagupta', linkedin: 'ananyagupta', bio: 'Mobile app developer. Built 10+ production apps. Flutter community contributor.',
      level: 'builder', rating: 4.6, reviewCount: 21, totalSales: 38, totalEarnings: 67000, completedProjects: 6, portfolioUrl: '@ananya',
      badges: [
        { id: 'b9', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-06-05' },
      ],
    },
  },
  {
    id: 'u5',
    name: 'Arjun Patel',
    email: 'arjun@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-04-12',
    updatedAt: '2026-08-02',
    studentProfile: {
      id: 'sp5', userId: 'u5', college: 'IIIT Hyderabad', degree: 'B.Tech IT',
      graduationYear: 2026, skills: ['Python', 'Django', 'React', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
      github: 'arjunpatel', linkedin: 'arjunpatel', bio: 'Full-stack developer specializing in Python ecosystems. DevOps enthusiast.',
      level: 'contributor', rating: 4.5, reviewCount: 15, totalSales: 22, totalEarnings: 42000, completedProjects: 4, portfolioUrl: '@arjun',
      badges: [
        { id: 'b10', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-04-15' },
      ],
    },
  },
  {
    id: 'u6',
    name: 'Sneha Reddy',
    email: 'sneha@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-07-20',
    updatedAt: '2026-07-30',
    studentProfile: {
      id: 'sp6', userId: 'u6', college: 'NIT Warangal', degree: 'B.Tech CSE',
      graduationYear: 2027, skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma', 'Node.js'],
      github: 'snehareddy', linkedin: 'snehareddy', bio: 'Frontend engineer & UI designer. Creating pixel-perfect interfaces with modern web tech.',
      level: 'builder', rating: 4.8, reviewCount: 28, totalSales: 63, totalEarnings: 78000, completedProjects: 7, portfolioUrl: '@sneha',
      badges: [
        { id: 'b11', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-07-25' },
        { id: 'b12', name: 'Open Source Contributor', icon: '🌟', description: 'Active open source contributor', earnedAt: '2026-02-01' },
      ],
    },
  },
  {
    id: 'u7',
    name: 'Vikram Singh',
    email: 'vikram@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: false,
    createdAt: '2026-01-10',
    updatedAt: '2026-08-01',
    studentProfile: {
      id: 'sp7', userId: 'u7', college: 'DTU Delhi', degree: 'B.Tech ECE',
      graduationYear: 2028, skills: ['Python', 'C++', 'Arduino', 'Raspberry Pi', 'IoT', 'TensorFlow Lite'],
      github: 'vikramsingh', linkedin: 'vikramsingh', bio: 'IoT and embedded systems developer. Building the future of connected devices.',
      level: 'beginner', rating: 4.2, reviewCount: 5, totalSales: 8, totalEarnings: 12000, completedProjects: 2, portfolioUrl: '@vikram',
      badges: [],
    },
  },
  {
    id: 'u8',
    name: 'Kavya Nair',
    email: 'kavya@campuscode.com',
    avatar: '',
    role: 'student',
    isVerified: true,
    createdAt: '2025-08-15',
    updatedAt: '2026-07-25',
    studentProfile: {
      id: 'sp8', userId: 'u8', college: 'IIT Bombay', degree: 'M.Tech Data Science',
      graduationYear: 2026, skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'scikit-learn', 'Pandas', 'Spark'],
      github: 'kavyanair', linkedin: 'kavyanair', bio: 'Data scientist building analytics platforms and ML pipelines. Kaggle Master.',
      level: 'expert', rating: 4.9, reviewCount: 41, totalSales: 71, totalEarnings: 198000, completedProjects: 14, portfolioUrl: '@kavya',
      badges: [
        { id: 'b13', name: 'Verified Student', icon: '✓', description: 'Identity verified', earnedAt: '2025-08-20' },
        { id: 'b14', name: 'Top Developer', icon: '👑', description: 'Top 1% developer', earnedAt: '2026-04-01' },
        { id: 'b15', name: '10 Projects Completed', icon: '🏆', description: 'Completed 10+ projects', earnedAt: '2026-03-15' },
      ],
    },
  },
];

// ── Users (Clients) ────────────────────────────────────────

export const clients: User[] = [
  {
    id: 'c1',
    name: 'TechStart Solutions',
    email: 'contact@techstart.in',
    avatar: '',
    role: 'client',
    isVerified: true,
    createdAt: '2025-06-01',
    updatedAt: '2026-08-01',
    clientProfile: {
      id: 'cp1', userId: 'c1', organization: 'TechStart Solutions', website: 'https://techstart.in',
      description: 'Early-stage startup building HR tech solutions.', profileType: 'Startup',
      isVerified: true, rating: 4.7, reviewCount: 12, totalSpent: 185000, projectsPosted: 8,
    },
  },
  {
    id: 'c2',
    name: 'GreenLeaf Organics',
    email: 'hello@greenleaf.com',
    avatar: '',
    role: 'client',
    isVerified: true,
    createdAt: '2025-09-15',
    updatedAt: '2026-07-20',
    clientProfile: {
      id: 'cp2', userId: 'c2', organization: 'GreenLeaf Organics', website: 'https://greenleaf.com',
      description: 'Organic food delivery startup looking for tech solutions.', profileType: 'Small Business',
      isVerified: true, rating: 4.5, reviewCount: 6, totalSpent: 95000, projectsPosted: 4,
    },
  },
  {
    id: 'c3',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh@medclinic.in',
    avatar: '',
    role: 'client',
    isVerified: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-08-03',
    clientProfile: {
      id: 'cp3', userId: 'c3', organization: 'MedClinic', website: '',
      description: 'Medical clinic looking for appointment and patient management software.', profileType: 'Healthcare',
      isVerified: true, rating: 4.8, reviewCount: 3, totalSpent: 45000, projectsPosted: 2,
    },
  },
  {
    id: 'c4',
    name: 'Campus Events Co.',
    email: 'events@campusevents.org',
    avatar: '',
    role: 'client',
    isVerified: false,
    createdAt: '2026-03-01',
    updatedAt: '2026-07-30',
    clientProfile: {
      id: 'cp4', userId: 'c4', organization: 'Campus Events Co.', website: 'https://campusevents.org',
      description: 'Student organization managing inter-college events and hackathons.', profileType: 'Organization',
      isVerified: false, rating: 4.3, reviewCount: 2, totalSpent: 30000, projectsPosted: 3,
    },
  },
];

export const allUsers: User[] = [...students, ...clients];

// ── Products ───────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 'p1', name: 'AI Resume Analyzer', description: 'AI-powered resume analysis and scoring system with NLP.',
    longDescription: 'A comprehensive AI-powered resume analysis platform that uses Natural Language Processing to parse, analyze, and score resumes against job descriptions. Features include keyword extraction, skill matching, ATS compatibility scoring, and detailed improvement suggestions. Built with a modern React frontend and FastAPI backend with ML models.',
    category: 'ai-ml', tags: ['AI', 'NLP', 'Resume', 'HR Tech'], technologies: ['React', 'Python', 'FastAPI', 'TensorFlow', 'PostgreSQL'],
    price: 499, isFree: false, status: 'published', sellerId: 'u1', seller: students[0],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/resume-analyzer',
    features: ['Resume parsing with NLP', 'Job description matching', 'ATS score calculation', 'Skill gap analysis', 'Improvement suggestions', 'Batch processing', 'Export reports', 'REST API'],
    requirements: ['Python 3.9+', 'Node.js 18+', 'PostgreSQL 14+'], installationGuide: '1. Clone the repository\n2. Install Python dependencies: pip install -r requirements.txt\n3. Install Node dependencies: npm install\n4. Set up PostgreSQL database\n5. Run migrations\n6. Start the server: npm run dev',
    documentation: 'Full API documentation available at /docs endpoint. Includes Swagger UI for interactive testing.',
    version: '2.1.0', changelog: [
      { version: '2.1.0', date: '2026-07-15', changes: ['Added batch processing', 'Improved NLP accuracy', 'Bug fixes'] },
      { version: '2.0.0', date: '2026-05-01', changes: ['Complete UI redesign', 'Added skill gap analysis', 'New API endpoints'] },
      { version: '1.0.0', date: '2026-01-15', changes: ['Initial release'] },
    ],
    reviews: [], rating: 4.8, reviewCount: 124, salesCount: 124, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'Deployment Guide', 'API Documentation', 'Future Updates'],
    qualityScore: { documentation: 92, codeQuality: 87, demoAvailability: 100, readme: 95, testing: 72, overall: 89 },
    githubRepo: 'harshvardhan/ai-resume-analyzer', createdAt: '2026-01-15', updatedAt: '2026-07-15',
  },
  {
    id: 'p2', name: 'College ERP System', description: 'Complete college management system with student, faculty, and admin modules.',
    longDescription: 'A full-featured Enterprise Resource Planning system designed for educational institutions. Includes modules for student management, faculty management, course scheduling, attendance tracking, grade management, fee management, library management, and comprehensive reporting dashboards.',
    category: 'web', tags: ['ERP', 'Education', 'Management', 'Full Stack'], technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redis'],
    price: 1999, isFree: false, status: 'published', sellerId: 'u3', seller: students[2],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/college-erp',
    features: ['Student management', 'Faculty management', 'Course scheduling', 'Attendance tracking', 'Grade management', 'Fee management', 'Library module', 'Report generation', 'Role-based access', 'Email notifications'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+', 'Redis 7+'],
    installationGuide: '1. Clone repo\n2. npm install\n3. Configure .env\n4. Run migrations\n5. Seed data\n6. npm run dev',
    documentation: 'Comprehensive docs included with API reference, user manual, and admin guide.',
    version: '3.0.0', changelog: [
      { version: '3.0.0', date: '2026-06-01', changes: ['Added library module', 'New dashboard', 'Performance improvements'] },
    ],
    reviews: [], rating: 4.6, reviewCount: 67, salesCount: 67, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'Deployment Guide', 'Admin Manual', 'Future Updates'],
    qualityScore: { documentation: 88, codeQuality: 85, demoAvailability: 100, readme: 90, testing: 78, overall: 88 },
    createdAt: '2025-08-01', updatedAt: '2026-06-01',
  },
  {
    id: 'p3', name: 'E-Commerce Starter Kit', description: 'Production-ready e-commerce template with payment integration.',
    longDescription: 'A complete e-commerce solution with product catalog, cart, checkout, payment gateway integration (Razorpay/Stripe), order management, inventory tracking, admin dashboard, and customer management. Mobile-responsive design with modern UI.',
    category: 'templates', tags: ['E-Commerce', 'Template', 'Starter Kit', 'Payment'], technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Razorpay'],
    price: 799, isFree: false, status: 'published', sellerId: 'u6', seller: students[5],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/ecommerce-kit',
    features: ['Product catalog', 'Shopping cart', 'Secure checkout', 'Payment integration', 'Order management', 'Inventory tracking', 'Admin dashboard', 'Customer accounts', 'Search & filters', 'Responsive design'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+'],
    installationGuide: '1. npx create-next-app --example ecommerce-kit\n2. Configure .env\n3. npx prisma migrate dev\n4. npm run dev',
    documentation: 'Detailed setup guide, customization docs, and API reference included.',
    version: '1.5.0', changelog: [],
    reviews: [], rating: 4.7, reviewCount: 89, salesCount: 89, license: 'MIT',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'Deployment Guide', 'Customization Guide'],
    qualityScore: { documentation: 95, codeQuality: 91, demoAvailability: 100, readme: 98, testing: 82, overall: 93 },
    createdAt: '2025-11-01', updatedAt: '2026-07-01',
  },
  {
    id: 'p4', name: 'Smart Expense Tracker', description: 'AI-powered personal finance tracker with budget insights.',
    longDescription: 'An intelligent expense tracking application that uses AI to categorize expenses, predict spending patterns, and provide personalized budget recommendations. Features include receipt scanning with OCR, multi-currency support, recurring expense tracking, and detailed analytics.',
    category: 'mobile', tags: ['Finance', 'AI', 'Mobile', 'Analytics'], technologies: ['Flutter', 'Dart', 'Firebase', 'TensorFlow Lite', 'Node.js'],
    price: 599, isFree: false, status: 'published', sellerId: 'u4', seller: students[3],
    screenshots: [], demoUrl: '',
    features: ['Receipt scanning (OCR)', 'Auto-categorization', 'Budget tracking', 'Spending analytics', 'Multi-currency', 'Recurring expenses', 'Export reports', 'Push notifications'],
    requirements: ['Flutter 3.10+', 'Firebase project'],
    installationGuide: '1. flutter pub get\n2. Configure Firebase\n3. flutter run',
    documentation: 'Setup guide and architecture docs included.',
    version: '2.0.0', changelog: [],
    reviews: [], rating: 4.5, reviewCount: 42, salesCount: 42, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Firebase Config Guide', 'Play Store Assets'],
    qualityScore: { documentation: 80, codeQuality: 84, demoAvailability: 50, readme: 88, testing: 65, overall: 73 },
    createdAt: '2026-02-01', updatedAt: '2026-06-15',
  },
  {
    id: 'p5', name: 'Face Recognition Attendance', description: 'Real-time face recognition based attendance system.',
    longDescription: 'An automated attendance system using deep learning-based face recognition. Supports real-time detection through webcam, batch photo processing, anti-spoofing measures, and integration with existing student databases. Includes admin dashboard for attendance reports.',
    category: 'ai-ml', tags: ['Face Recognition', 'Attendance', 'Computer Vision', 'Deep Learning'], technologies: ['Python', 'OpenCV', 'TensorFlow', 'Flask', 'React', 'SQLite'],
    price: 699, isFree: false, status: 'published', sellerId: 'u2', seller: students[1],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/face-attendance',
    features: ['Real-time face detection', 'Face recognition', 'Anti-spoofing', 'Attendance reports', 'Student database', 'Multi-camera support', 'Export to CSV/Excel', 'Admin dashboard'],
    requirements: ['Python 3.9+', 'Webcam', 'CUDA GPU (recommended)'],
    installationGuide: '1. pip install -r requirements.txt\n2. python setup_db.py\n3. python app.py',
    documentation: 'Includes model training guide and API docs.',
    version: '1.3.0', changelog: [],
    reviews: [], rating: 4.4, reviewCount: 56, salesCount: 56, license: 'Educational',
    includes: ['Source Code', 'Pre-trained Models', 'Documentation', 'Training Guide', 'Database Schema'],
    qualityScore: { documentation: 78, codeQuality: 82, demoAvailability: 100, readme: 85, testing: 60, overall: 81 },
    createdAt: '2025-09-01', updatedAt: '2026-04-15',
  },
  {
    id: 'p6', name: 'React Admin Dashboard', description: 'Premium admin dashboard template with 50+ components.',
    longDescription: 'A feature-rich admin dashboard template built with React, TypeScript, and Tailwind CSS. Includes 50+ pre-built components, 10+ page templates, dark/light mode, responsive design, chart integrations, form components, and table management.',
    category: 'ui-kits', tags: ['Dashboard', 'Admin', 'Template', 'UI Kit'], technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'React Hook Form'],
    price: 0, isFree: true, status: 'published', sellerId: 'u6', seller: students[5],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/admin-dashboard',
    features: ['50+ components', '10+ page templates', 'Dark/Light mode', 'Responsive design', 'Chart integrations', 'Form components', 'Data tables', 'Authentication pages'],
    requirements: ['Node.js 18+'],
    installationGuide: '1. npm install\n2. npm run dev',
    documentation: 'Storybook documentation included.',
    version: '4.0.0', changelog: [],
    reviews: [], rating: 4.9, reviewCount: 234, salesCount: 1247, license: 'MIT',
    includes: ['Source Code', 'Documentation', 'Storybook', 'Figma File'],
    qualityScore: { documentation: 98, codeQuality: 95, demoAvailability: 100, readme: 100, testing: 88, overall: 96 },
    createdAt: '2025-06-01', updatedAt: '2026-07-20',
  },
  {
    id: 'p7', name: 'Job Portal Platform', description: 'Full-featured job portal with AI matching and analytics.',
    longDescription: 'A comprehensive job portal platform connecting employers with job seekers. Features AI-powered job matching, advanced search, resume builder, company profiles, application tracking, interview scheduling, and analytics dashboards for both employers and candidates.',
    category: 'web', tags: ['Job Portal', 'HR', 'Full Stack', 'AI'], technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'ElasticSearch'],
    price: 1499, isFree: false, status: 'published', sellerId: 'u1', seller: students[0],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/job-portal',
    features: ['AI job matching', 'Advanced search', 'Resume builder', 'Company profiles', 'Application tracking', 'Interview scheduling', 'Analytics dashboard', 'Email notifications'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+', 'Redis 7+'],
    installationGuide: '1. npm install\n2. Configure .env\n3. npx prisma migrate dev\n4. npm run seed\n5. npm run dev',
    documentation: 'Full API docs and user guides included.',
    version: '2.0.0', changelog: [],
    reviews: [], rating: 4.6, reviewCount: 45, salesCount: 45, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'Deployment Guide', 'API Documentation'],
    qualityScore: { documentation: 85, codeQuality: 88, demoAvailability: 100, readme: 92, testing: 75, overall: 88 },
    createdAt: '2025-10-01', updatedAt: '2026-05-15',
  },
  {
    id: 'p8', name: 'Real-time Chat Application', description: 'Scalable real-time chat with WebSocket, groups, and file sharing.',
    longDescription: 'A modern real-time chat application built with WebSocket technology. Supports one-on-one messaging, group chats, file sharing, typing indicators, read receipts, message reactions, and push notifications. Includes admin panel for user management.',
    category: 'web', tags: ['Chat', 'Real-time', 'WebSocket', 'Messaging'], technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Redis'],
    price: 399, isFree: false, status: 'published', sellerId: 'u5', seller: students[4],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/chat-app',
    features: ['Real-time messaging', 'Group chats', 'File sharing', 'Typing indicators', 'Read receipts', 'Message reactions', 'Push notifications', 'User management'],
    requirements: ['Node.js 18+', 'MongoDB 6+', 'Redis 7+'],
    installationGuide: '1. npm install\n2. Configure .env\n3. npm run dev',
    documentation: 'WebSocket API docs and architecture guide included.',
    version: '1.2.0', changelog: [],
    reviews: [], rating: 4.3, reviewCount: 31, salesCount: 31, license: 'MIT',
    includes: ['Source Code', 'Documentation', 'Deployment Guide'],
    qualityScore: { documentation: 75, codeQuality: 80, demoAvailability: 100, readme: 82, testing: 58, overall: 79 },
    createdAt: '2026-01-15', updatedAt: '2026-06-01',
  },
  {
    id: 'p9', name: 'Inventory Management System', description: 'Complete inventory management with barcode scanning and analytics.',
    longDescription: 'A comprehensive inventory management system for small to medium businesses. Features include barcode scanning, stock tracking, purchase orders, supplier management, low stock alerts, sales tracking, and detailed analytics with exportable reports.',
    category: 'web', tags: ['Inventory', 'Business', 'Management', 'Analytics'], technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Chart.js'],
    price: 899, isFree: false, status: 'published', sellerId: 'u3', seller: students[2],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/inventory',
    features: ['Barcode scanning', 'Stock tracking', 'Purchase orders', 'Supplier management', 'Low stock alerts', 'Sales tracking', 'Analytics dashboard', 'Export reports'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+'],
    installationGuide: '1. npm install\n2. Configure database\n3. npm run migrate\n4. npm run dev',
    documentation: 'User manual and API documentation included.',
    version: '1.0.0', changelog: [],
    reviews: [], rating: 4.5, reviewCount: 28, salesCount: 28, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'User Manual'],
    qualityScore: { documentation: 82, codeQuality: 83, demoAvailability: 100, readme: 88, testing: 70, overall: 85 },
    createdAt: '2026-03-01', updatedAt: '2026-07-01',
  },
  {
    id: 'p10', name: 'ML Disease Prediction Dashboard', description: 'Machine learning dashboard for disease prediction with medical data.',
    longDescription: 'A machine learning-powered health analytics dashboard that predicts disease risk based on patient data. Includes models for diabetes, heart disease, and liver disease prediction with interactive visualizations, model explanations (SHAP), and downloadable reports.',
    category: 'ai-ml', tags: ['Healthcare', 'ML', 'Dashboard', 'Prediction'], technologies: ['Python', 'scikit-learn', 'Streamlit', 'Pandas', 'Plotly'],
    price: 0, isFree: true, status: 'published', sellerId: 'u8', seller: students[7],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/disease-prediction',
    features: ['Diabetes prediction', 'Heart disease prediction', 'Liver disease prediction', 'Interactive charts', 'Model explanations (SHAP)', 'Patient data input', 'Report generation', 'Model comparison'],
    requirements: ['Python 3.9+'],
    installationGuide: '1. pip install -r requirements.txt\n2. streamlit run app.py',
    documentation: 'Includes model documentation, dataset descriptions, and research references.',
    version: '1.5.0', changelog: [],
    reviews: [], rating: 4.7, reviewCount: 93, salesCount: 456, license: 'Educational',
    includes: ['Source Code', 'Pre-trained Models', 'Datasets', 'Documentation', 'Research References'],
    qualityScore: { documentation: 94, codeQuality: 90, demoAvailability: 100, readme: 96, testing: 85, overall: 93 },
    createdAt: '2025-12-01', updatedAt: '2026-07-10',
  },
  {
    id: 'p11', name: 'SaaS Boilerplate', description: 'Production-ready SaaS starter with auth, billing, and teams.',
    longDescription: 'Everything you need to launch a SaaS product. Includes authentication (OAuth, magic links), subscription billing (Stripe/Razorpay), team management, role-based access control, admin dashboard, email templates, and API with rate limiting.',
    category: 'saas', tags: ['SaaS', 'Boilerplate', 'Starter', 'Production'], technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Stripe'],
    price: 2499, isFree: false, status: 'published', sellerId: 'u1', seller: students[0],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/saas-boilerplate',
    features: ['Authentication (OAuth, magic links)', 'Subscription billing', 'Team management', 'RBAC', 'Admin dashboard', 'Email templates', 'API with rate limiting', 'Webhooks'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+'],
    installationGuide: '1. npx create-next-app --example saas-boilerplate\n2. Configure .env\n3. npx prisma migrate dev\n4. npm run dev',
    documentation: 'Extensive documentation with architecture guide, customization guide, and deployment instructions.',
    version: '1.0.0', changelog: [],
    reviews: [], rating: 4.9, reviewCount: 37, salesCount: 37, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Database Schema', 'Deployment Guide', 'Email Templates', '6 Months Updates'],
    qualityScore: { documentation: 97, codeQuality: 94, demoAvailability: 100, readme: 98, testing: 90, overall: 96 },
    createdAt: '2026-04-01', updatedAt: '2026-07-20',
  },
  {
    id: 'p12', name: 'REST API Toolkit', description: 'Comprehensive REST API toolkit with auth, validation, and docs.',
    longDescription: 'A production-ready REST API toolkit that includes authentication, request validation, rate limiting, logging, error handling, automated API documentation (Swagger), testing utilities, and database migrations. Perfect starting point for any backend project.',
    category: 'api', tags: ['API', 'Backend', 'Toolkit', 'REST'], technologies: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Jest', 'Swagger'],
    price: 299, isFree: false, status: 'published', sellerId: 'u5', seller: students[4],
    screenshots: [], demoUrl: '',
    features: ['JWT authentication', 'Request validation (Zod)', 'Rate limiting', 'Structured logging', 'Error handling', 'Swagger docs', 'Testing utilities', 'Database migrations'],
    requirements: ['Node.js 18+', 'PostgreSQL 14+'],
    installationGuide: '1. npm install\n2. Configure .env\n3. npm run migrate\n4. npm run dev',
    documentation: 'Auto-generated Swagger docs at /api-docs.',
    version: '2.3.0', changelog: [],
    reviews: [], rating: 4.4, reviewCount: 52, salesCount: 52, license: 'MIT',
    includes: ['Source Code', 'Documentation', 'Test Suite', 'Postman Collection'],
    qualityScore: { documentation: 88, codeQuality: 92, demoAvailability: 50, readme: 94, testing: 95, overall: 84 },
    createdAt: '2025-07-01', updatedAt: '2026-05-01',
  },
  {
    id: 'p13', name: 'Data Analytics Dashboard', description: 'Interactive analytics dashboard with real-time data visualization.',
    longDescription: 'A powerful data analytics dashboard with interactive charts, real-time data updates, custom report builder, data export, and multi-tenant support. Built for businesses that need to visualize and analyze large datasets.',
    category: 'data-science', tags: ['Analytics', 'Dashboard', 'Visualization', 'Data'], technologies: ['React', 'D3.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    price: 1299, isFree: false, status: 'published', sellerId: 'u8', seller: students[7],
    screenshots: [], demoUrl: 'https://demo.campuscode.com/analytics-dashboard',
    features: ['Interactive charts', 'Real-time updates', 'Custom report builder', 'Data export', 'Multi-tenant', 'Role-based access', 'Scheduled reports', 'API access'],
    requirements: ['Node.js 18+', 'Python 3.9+', 'PostgreSQL 14+'],
    installationGuide: '1. Install dependencies\n2. Configure database\n3. Run migrations\n4. npm run dev',
    documentation: 'Includes architecture docs and customization guide.',
    version: '2.0.0', changelog: [],
    reviews: [], rating: 4.8, reviewCount: 38, salesCount: 38, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Sample Datasets', 'Deployment Guide'],
    qualityScore: { documentation: 90, codeQuality: 89, demoAvailability: 100, readme: 92, testing: 80, overall: 90 },
    createdAt: '2025-11-15', updatedAt: '2026-06-15',
  },
  {
    id: 'p14', name: 'Flutter UI Kit', description: '100+ pre-built Flutter widgets and screens for mobile apps.',
    longDescription: 'A comprehensive Flutter UI kit with 100+ pre-built widgets, 20+ complete screens, custom themes, and responsive layouts. Includes authentication flows, profile screens, settings, onboarding, and e-commerce components.',
    category: 'ui-kits', tags: ['Flutter', 'UI Kit', 'Mobile', 'Widgets'], technologies: ['Flutter', 'Dart', 'Material Design'],
    price: 449, isFree: false, status: 'published', sellerId: 'u4', seller: students[3],
    screenshots: [], demoUrl: '',
    features: ['100+ widgets', '20+ screens', 'Custom themes', 'Responsive layouts', 'Auth flows', 'Profile screens', 'Onboarding', 'E-commerce components'],
    requirements: ['Flutter 3.10+'],
    installationGuide: '1. flutter pub get\n2. flutter run',
    documentation: 'Widget catalog and usage guide included.',
    version: '3.0.0', changelog: [],
    reviews: [], rating: 4.6, reviewCount: 71, salesCount: 71, license: 'Commercial',
    includes: ['Source Code', 'Documentation', 'Widget Catalog'],
    qualityScore: { documentation: 85, codeQuality: 87, demoAvailability: 50, readme: 90, testing: 70, overall: 76 },
    createdAt: '2025-08-15', updatedAt: '2026-04-01',
  },
  {
    id: 'p15', name: 'DevOps Pipeline Templates', description: 'Production CI/CD pipeline templates for popular platforms.',
    longDescription: 'A collection of production-tested CI/CD pipeline templates for GitHub Actions, GitLab CI, Jenkins, and AWS CodePipeline. Includes templates for Node.js, Python, Java, Go, Docker, Kubernetes deployments, and monitoring setups.',
    category: 'devops', tags: ['DevOps', 'CI/CD', 'Pipeline', 'Docker'], technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Terraform'],
    price: 0, isFree: true, status: 'published', sellerId: 'u3', seller: students[2],
    screenshots: [], demoUrl: '',
    features: ['GitHub Actions templates', 'GitLab CI templates', 'Docker configs', 'Kubernetes manifests', 'Terraform modules', 'Monitoring setup', 'Security scanning', 'Multi-environment'],
    requirements: ['Docker', 'Basic CI/CD knowledge'],
    installationGuide: 'Copy the template to your project and customize the configuration.',
    documentation: 'Each template includes inline documentation and a setup guide.',
    version: '1.0.0', changelog: [],
    reviews: [], rating: 4.8, reviewCount: 156, salesCount: 892, license: 'MIT',
    includes: ['Pipeline Templates', 'Documentation', 'Best Practices Guide'],
    qualityScore: { documentation: 93, codeQuality: 95, demoAvailability: 0, readme: 97, testing: 90, overall: 75 },
    createdAt: '2025-05-01', updatedAt: '2026-07-01',
  },
];

// ── Solution Requests ──────────────────────────────────────

export const solutionRequests: SolutionRequest[] = [
  {
    id: 'sr1', title: 'AI-Powered Resume Screening System',
    description: 'Need a system that automatically screens resumes against job descriptions using AI/ML.',
    problemStatement: 'We receive 500+ resumes per job posting and manually screening them takes 2-3 days. We need an automated system that can parse resumes, match them against job descriptions, and rank candidates based on relevance.',
    solutionType: 'ai_ml', requiredFeatures: ['Resume upload & parsing', 'Job description matching', 'Candidate ranking', 'Skills extraction', 'Dashboard with analytics', 'Export reports to CSV/Excel'],
    preferredTechnologies: ['Python', 'FastAPI', 'React', 'PostgreSQL'], integrations: ['Email notifications', 'Google Sheets export'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Deployed application', 'Documentation', 'API docs', 'Training data setup'],
    budgetRange: '10000-25000', budgetMin: 15000, budgetMax: 25000, isFixedPrice: false,
    deadline: '2026-09-15', priority: 'high', attachments: [],
    status: 'open', clientId: 'c1', client: clients[0],
    proposals: [], proposalCount: 8, category: 'ai-ml', difficulty: 'advanced', isRemote: true,
    createdAt: '2026-08-06T10:00:00Z', updatedAt: '2026-08-06T10:00:00Z',
  },
  {
    id: 'sr2', title: 'Restaurant Online Ordering System',
    description: 'Build a complete online ordering system for a restaurant chain with delivery tracking.',
    problemStatement: 'We run 5 restaurants and want to offer online ordering with real-time order tracking, delivery management, and kitchen display system. Need both customer app and admin panel.',
    solutionType: 'web', requiredFeatures: ['Menu management', 'Online ordering', 'Payment gateway', 'Real-time order tracking', 'Kitchen display', 'Delivery management', 'Customer accounts', 'Admin dashboard'],
    preferredTechnologies: ['Next.js', 'Node.js', 'PostgreSQL'], integrations: ['Razorpay payment', 'Google Maps', 'SMS notifications'],
    platform: 'Web + Mobile responsive', expectedDeliverables: ['Source code', 'Deployment', 'Documentation', 'Training'],
    budgetRange: '25000-50000', budgetMin: 30000, budgetMax: 50000, isFixedPrice: false,
    deadline: '2026-10-01', priority: 'medium', attachments: [],
    status: 'open', clientId: 'c2', client: clients[1],
    proposals: [], proposalCount: 12, category: 'web', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-04T14:30:00Z', updatedAt: '2026-08-04T14:30:00Z',
  },
  {
    id: 'sr3', title: 'Appointment Booking System for Medical Clinic',
    description: 'Need an appointment booking and patient management system for our medical clinic.',
    problemStatement: 'Our clinic sees 100+ patients daily. We need a system to manage appointments, patient records, prescriptions, and billing. Patients should be able to book appointments online.',
    solutionType: 'web', requiredFeatures: ['Online booking', 'Patient records', 'Prescription management', 'Billing', 'Doctor schedule management', 'SMS reminders', 'Report generation'],
    preferredTechnologies: ['React', 'Node.js', 'PostgreSQL'], integrations: ['SMS API', 'Email notifications'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Deployment', 'Documentation', 'User manual'],
    budgetRange: '10000-25000', budgetMin: 15000, budgetMax: 25000, isFixedPrice: true,
    deadline: '2026-09-30', priority: 'high', attachments: [],
    status: 'open', clientId: 'c3', client: clients[2],
    proposals: [], proposalCount: 5, category: 'web', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-05T09:00:00Z', updatedAt: '2026-08-05T09:00:00Z',
  },
  {
    id: 'sr4', title: 'College Event Management Platform',
    description: 'Build a platform for managing inter-college events, registrations, and results.',
    problemStatement: 'We organize 20+ inter-college events annually. Need a platform for event listing, team registrations, scheduling, live scoring, results, and certificate generation.',
    solutionType: 'web', requiredFeatures: ['Event listing', 'Team registration', 'Payment collection', 'Schedule management', 'Live scoring', 'Results', 'Certificate generation', 'Leaderboard'],
    preferredTechnologies: ['React', 'Firebase'], integrations: ['Payment gateway', 'Email'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Deployment', 'Documentation'],
    budgetRange: '5000-10000', budgetMin: 8000, budgetMax: 12000, isFixedPrice: false,
    deadline: '2026-09-01', priority: 'medium', attachments: [],
    status: 'open', clientId: 'c4', client: clients[3],
    proposals: [], proposalCount: 15, category: 'web', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-03T16:00:00Z', updatedAt: '2026-08-03T16:00:00Z',
  },
  {
    id: 'sr5', title: 'Automated Invoice Generator',
    description: 'Need a system that generates professional invoices from order data automatically.',
    problemStatement: 'We process 200+ orders daily and need automated invoice generation with GST calculations, PDF generation, email delivery, and integration with our existing order management system.',
    solutionType: 'automation', requiredFeatures: ['Invoice template designer', 'GST calculation', 'PDF generation', 'Email delivery', 'Bulk processing', 'Payment tracking', 'Reports'],
    preferredTechnologies: ['Python', 'Django', 'React'], integrations: ['REST API for order data', 'Email service', 'Cloud storage'],
    platform: 'Web', expectedDeliverables: ['Source code', 'API', 'Documentation'],
    budgetRange: '10000-25000', budgetMin: 10000, budgetMax: 20000, isFixedPrice: true,
    deadline: '2026-09-15', priority: 'medium', attachments: [],
    status: 'open', clientId: 'c1', client: clients[0],
    proposals: [], proposalCount: 6, category: 'automation', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-02T11:00:00Z', updatedAt: '2026-08-02T11:00:00Z',
  },
  {
    id: 'sr6', title: 'Customer Support Chatbot',
    description: 'Build an AI chatbot for handling customer support queries with escalation.',
    problemStatement: 'Our support team handles 300+ queries daily. We need an AI chatbot that can handle common queries, provide product information, process simple requests, and escalate complex issues to human agents.',
    solutionType: 'ai_ml', requiredFeatures: ['NLP-based query understanding', 'Knowledge base integration', 'Multi-language support', 'Escalation to human agents', 'Analytics dashboard', 'Training interface'],
    preferredTechnologies: ['Python', 'FastAPI', 'React', 'OpenAI API'], integrations: ['WhatsApp', 'Website widget', 'Slack'],
    platform: 'Web + API', expectedDeliverables: ['Source code', 'Deployment', 'Documentation', 'Training guide'],
    budgetRange: '25000-50000', budgetMin: 30000, budgetMax: 50000, isFixedPrice: false,
    deadline: '2026-10-15', priority: 'high', attachments: [],
    status: 'open', clientId: 'c1', client: clients[0],
    proposals: [], proposalCount: 4, category: 'ai-ml', difficulty: 'advanced', isRemote: true,
    createdAt: '2026-08-01T08:00:00Z', updatedAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'sr7', title: 'Local Business Website Builder',
    description: 'Create a simple website builder for local businesses with templates.',
    problemStatement: 'Many local businesses in our area need websites but cannot afford expensive solutions. We want a simple drag-and-drop website builder with pre-made templates for restaurants, shops, and service providers.',
    solutionType: 'web', requiredFeatures: ['Drag-and-drop builder', 'Pre-made templates', 'Contact forms', 'Google Maps integration', 'SEO optimization', 'Custom domain support', 'Analytics'],
    preferredTechnologies: ['Next.js', 'TypeScript'], integrations: ['Google Maps', 'Google Analytics', 'WhatsApp'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Deployment', 'Documentation'],
    budgetRange: '25000-50000', budgetMin: 35000, budgetMax: 50000, isFixedPrice: false,
    deadline: '2026-11-01', priority: 'low', attachments: [],
    status: 'open', clientId: 'c2', client: clients[1],
    proposals: [], proposalCount: 3, category: 'web', difficulty: 'advanced', isRemote: true,
    createdAt: '2026-07-28T12:00:00Z', updatedAt: '2026-07-28T12:00:00Z',
  },
  {
    id: 'sr8', title: 'Attendance Management System',
    description: 'Need a comprehensive attendance management system for a company with 200+ employees.',
    problemStatement: 'We need to track employee attendance with geo-fencing, leave management, overtime calculation, and payroll integration. Should work on mobile for field staff.',
    solutionType: 'web', requiredFeatures: ['Geo-fenced check-in', 'Leave management', 'Overtime calculation', 'Shift management', 'Reports', 'Mobile app', 'Payroll export'],
    preferredTechnologies: ['React Native', 'Node.js', 'PostgreSQL'], integrations: ['Google Maps', 'Payroll systems'],
    platform: 'Web + Mobile', expectedDeliverables: ['Source code', 'Apps', 'Documentation'],
    budgetRange: '25000-50000', budgetMin: 25000, budgetMax: 45000, isFixedPrice: false,
    deadline: '2026-10-30', priority: 'medium', attachments: [],
    status: 'in_progress', clientId: 'c1', client: clients[0],
    proposals: [], proposalCount: 9, category: 'mobile', difficulty: 'advanced', isRemote: true,
    createdAt: '2026-07-20T10:00:00Z', updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'sr9', title: 'Data Analytics Dashboard for E-commerce',
    description: 'Build a real-time analytics dashboard for our e-commerce platform.',
    problemStatement: 'We need to visualize sales data, customer behavior, product performance, and inventory trends in real-time. Dashboard should support custom date ranges and exportable reports.',
    solutionType: 'data_analytics', requiredFeatures: ['Sales analytics', 'Customer segmentation', 'Product performance', 'Inventory trends', 'Custom date ranges', 'Export reports', 'Real-time updates'],
    preferredTechnologies: ['React', 'Python', 'PostgreSQL'], integrations: ['Existing e-commerce API', 'Google Analytics'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Documentation', 'API integration guide'],
    budgetRange: '10000-25000', budgetMin: 15000, budgetMax: 25000, isFixedPrice: false,
    deadline: '2026-09-20', priority: 'medium', attachments: [],
    status: 'open', clientId: 'c2', client: clients[1],
    proposals: [], proposalCount: 7, category: 'data-science', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-07T15:00:00Z', updatedAt: '2026-08-07T15:00:00Z',
  },
  {
    id: 'sr10', title: 'Inventory Management for Retail Chain',
    description: 'Build inventory management system for a retail chain with 3 stores.',
    problemStatement: 'We have 3 retail stores and need centralized inventory management with barcode scanning, stock transfers between stores, purchase order automation, and low stock alerts.',
    solutionType: 'web', requiredFeatures: ['Barcode scanning', 'Multi-store management', 'Stock transfers', 'Purchase orders', 'Low stock alerts', 'Supplier management', 'Reports'],
    preferredTechnologies: ['React', 'Node.js', 'PostgreSQL'], integrations: ['Barcode scanner', 'Email alerts'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Deployment', 'Documentation', 'Training'],
    budgetRange: '10000-25000', budgetMin: 15000, budgetMax: 25000, isFixedPrice: true,
    deadline: '2026-09-25', priority: 'high', attachments: [],
    status: 'open', clientId: 'c2', client: clients[1],
    proposals: [], proposalCount: 10, category: 'web', difficulty: 'intermediate', isRemote: true,
    createdAt: '2026-08-05T13:00:00Z', updatedAt: '2026-08-05T13:00:00Z',
  },
  {
    id: 'sr11', title: 'Student Feedback & Survey Platform',
    description: 'Build a platform for collecting and analyzing student feedback surveys.',
    problemStatement: 'We need a platform where faculty can create surveys, students can submit feedback anonymously, and administrators can view analytics and reports on faculty performance.',
    solutionType: 'web', requiredFeatures: ['Survey builder', 'Anonymous submission', 'Analytics dashboard', 'Faculty reports', 'Trend analysis', 'Export data'],
    preferredTechnologies: ['React', 'Firebase'], integrations: ['Email notifications', 'College LMS'],
    platform: 'Web', expectedDeliverables: ['Source code', 'Documentation'],
    budgetRange: '5000-10000', budgetMin: 5000, budgetMax: 10000, isFixedPrice: true,
    deadline: '2026-09-10', priority: 'low', attachments: [],
    status: 'open', clientId: 'c4', client: clients[3],
    proposals: [], proposalCount: 11, category: 'web', difficulty: 'beginner', isRemote: true,
    createdAt: '2026-08-06T11:00:00Z', updatedAt: '2026-08-06T11:00:00Z',
  },
  {
    id: 'sr12', title: 'IoT Smart Parking System',
    description: 'Build a smart parking management system with sensor integration.',
    problemStatement: 'Our campus has 500 parking spots. We need a system to detect available spots using sensors, guide drivers to available spots, handle payments, and provide usage analytics.',
    solutionType: 'other', requiredFeatures: ['Sensor integration', 'Real-time availability', 'Mobile app', 'Payment processing', 'Navigation', 'Analytics', 'Reservation system'],
    preferredTechnologies: ['Python', 'React Native', 'MQTT', 'PostgreSQL'], integrations: ['IoT sensors', 'Payment gateway', 'Maps'],
    platform: 'Web + Mobile', expectedDeliverables: ['Source code', 'Hardware specs', 'Documentation'],
    budgetRange: '50000+', budgetMin: 50000, budgetMax: 100000, isFixedPrice: false,
    deadline: '2026-12-01', priority: 'medium', attachments: [],
    status: 'open', clientId: 'c4', client: clients[3],
    proposals: [], proposalCount: 2, category: 'automation', difficulty: 'expert', isRemote: false,
    createdAt: '2026-07-25T09:00:00Z', updatedAt: '2026-07-25T09:00:00Z',
  },
];

// ── Projects ───────────────────────────────────────────────

export const projects: Project[] = [
  {
    id: 'proj1', name: 'AI Resume Analyzer', description: 'Building an AI-powered resume analysis and scoring system.',
    status: 'active', ownerId: 'u1', owner: students[0], technologies: ['React', 'Python', 'FastAPI', 'TensorFlow'],
    category: 'AI / ML', progress: 78, deadline: '2026-09-15',
    members: [
      { id: 'pm1', userId: 'u1', projectId: 'proj1', role: 'owner', joinedAt: '2026-01-15' },
      { id: 'pm2', userId: 'u2', projectId: 'proj1', role: 'member', joinedAt: '2026-02-01', user: students[1] },
    ],
    tasks: [], milestones: [], isPublished: true, productId: 'p1',
    createdAt: '2026-01-15', updatedAt: '2026-08-01',
  },
  {
    id: 'proj2', name: 'E-Commerce Platform', description: 'Full-stack e-commerce with payment integration.',
    status: 'active', ownerId: 'u6', owner: students[5], technologies: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    category: 'Web Development', progress: 92, deadline: '2026-08-30',
    members: [
      { id: 'pm3', userId: 'u6', projectId: 'proj2', role: 'owner', joinedAt: '2025-11-01' },
    ],
    tasks: [], milestones: [], isPublished: true, productId: 'p3',
    createdAt: '2025-11-01', updatedAt: '2026-08-05',
  },
  {
    id: 'proj3', name: 'Attendance Management System', description: 'Employee attendance with geo-fencing for TechStart Solutions.',
    status: 'active', ownerId: 'u3', owner: students[2], technologies: ['React Native', 'Node.js', 'PostgreSQL'],
    category: 'Mobile', progress: 45, deadline: '2026-10-30',
    members: [
      { id: 'pm4', userId: 'u3', projectId: 'proj3', role: 'owner', joinedAt: '2026-07-20' },
      { id: 'pm5', userId: 'u5', projectId: 'proj3', role: 'member', joinedAt: '2026-07-25', user: students[4] },
    ],
    tasks: [], milestones: [], isPublished: false, contractId: 'cont1', clientId: 'c1', client: clients[0],
    createdAt: '2026-07-20', updatedAt: '2026-08-05',
  },
  {
    id: 'proj4', name: 'SaaS Boilerplate', description: 'Production-ready SaaS starter template.',
    status: 'completed', ownerId: 'u1', owner: students[0], technologies: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
    category: 'SaaS', progress: 100, deadline: '2026-07-01',
    members: [
      { id: 'pm6', userId: 'u1', projectId: 'proj4', role: 'owner', joinedAt: '2026-03-01' },
    ],
    tasks: [], milestones: [], isPublished: true, productId: 'p11',
    createdAt: '2026-03-01', updatedAt: '2026-07-01',
  },
  {
    id: 'proj5', name: 'ML Disease Prediction', description: 'Machine learning models for disease risk prediction.',
    status: 'active', ownerId: 'u8', owner: students[7], technologies: ['Python', 'scikit-learn', 'Streamlit', 'Pandas'],
    category: 'Data Science', progress: 65, deadline: '2026-09-01',
    members: [
      { id: 'pm7', userId: 'u8', projectId: 'proj5', role: 'owner', joinedAt: '2025-12-01' },
    ],
    tasks: [], milestones: [], isPublished: true, productId: 'p10',
    createdAt: '2025-12-01', updatedAt: '2026-08-03',
  },
];

// ── Tasks for project proj1 ────────────────────────────────

export const projectTasks: Task[] = [
  {
    id: 't1', projectId: 'proj1', title: 'Design resume upload UI', description: 'Create a drag-and-drop file upload interface for resumes.',
    status: 'done', priority: 'high', assigneeId: 'u1', labels: ['frontend', 'design'],
    dueDate: '2026-02-01', subtasks: [
      { id: 'st1', title: 'Create upload component', completed: true },
      { id: 'st2', title: 'Add drag-and-drop support', completed: true },
      { id: 'st3', title: 'File validation', completed: true },
    ], comments: [], attachments: [], createdAt: '2026-01-20', updatedAt: '2026-01-30',
  },
  {
    id: 't2', projectId: 'proj1', title: 'Build resume parser API', description: 'API endpoint to parse uploaded resumes and extract structured data.',
    status: 'done', priority: 'high', assigneeId: 'u2', labels: ['backend', 'api'],
    dueDate: '2026-03-01', subtasks: [
      { id: 'st4', title: 'PDF text extraction', completed: true },
      { id: 'st5', title: 'NLP entity recognition', completed: true },
      { id: 'st6', title: 'Structured data output', completed: true },
    ], comments: [], attachments: [], createdAt: '2026-02-01', updatedAt: '2026-02-28',
  },
  {
    id: 't3', projectId: 'proj1', title: 'Implement scoring algorithm', description: 'Create the algorithm to score resumes against job descriptions.',
    status: 'in_progress', priority: 'urgent', assigneeId: 'u2', labels: ['ml', 'core'],
    dueDate: '2026-08-15', subtasks: [
      { id: 'st7', title: 'Skill matching model', completed: true },
      { id: 'st8', title: 'Experience scoring', completed: true },
      { id: 'st9', title: 'Overall score calculation', completed: false },
    ], comments: [], attachments: [], createdAt: '2026-03-01', updatedAt: '2026-08-05',
  },
  {
    id: 't4', projectId: 'proj1', title: 'Build analytics dashboard', description: 'Dashboard showing resume analytics and scoring trends.',
    status: 'in_progress', priority: 'medium', assigneeId: 'u1', labels: ['frontend', 'analytics'],
    dueDate: '2026-08-20', subtasks: [
      { id: 'st10', title: 'Charts and graphs', completed: true },
      { id: 'st11', title: 'Filter and date range', completed: false },
      { id: 'st12', title: 'Export functionality', completed: false },
    ], comments: [], attachments: [], createdAt: '2026-06-01', updatedAt: '2026-08-04',
  },
  {
    id: 't5', projectId: 'proj1', title: 'Add batch processing', description: 'Support uploading and analyzing multiple resumes at once.',
    status: 'todo', priority: 'medium', assigneeId: 'u1', labels: ['feature', 'backend'],
    dueDate: '2026-08-25', subtasks: [], comments: [], attachments: [], createdAt: '2026-07-15', updatedAt: '2026-07-15',
  },
  {
    id: 't6', projectId: 'proj1', title: 'Write API documentation', description: 'Document all API endpoints with examples.',
    status: 'todo', priority: 'low', labels: ['docs'],
    dueDate: '2026-09-01', subtasks: [], comments: [], attachments: [], createdAt: '2026-07-20', updatedAt: '2026-07-20',
  },
  {
    id: 't7', projectId: 'proj1', title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for testing and deployment.',
    status: 'backlog', priority: 'low', labels: ['devops'],
    dueDate: '2026-09-10', subtasks: [], comments: [], attachments: [], createdAt: '2026-07-25', updatedAt: '2026-07-25',
  },
  {
    id: 't8', projectId: 'proj1', title: 'Performance optimization', description: 'Optimize NLP model inference time and API response.',
    status: 'review', priority: 'high', assigneeId: 'u2', labels: ['performance', 'ml'],
    dueDate: '2026-08-10', subtasks: [
      { id: 'st13', title: 'Model quantization', completed: true },
      { id: 'st14', title: 'Caching layer', completed: true },
      { id: 'st15', title: 'Load testing', completed: false },
    ], comments: [], attachments: [], createdAt: '2026-07-01', updatedAt: '2026-08-05',
  },
];

// ── Proposals ──────────────────────────────────────────────

export const proposals: Proposal[] = [
  {
    id: 'prop1', solutionRequestId: 'sr1', studentId: 'u1', student: students[0],
    content: 'I have extensive experience building AI-powered resume systems. My existing AI Resume Analyzer product demonstrates my capability in NLP and resume parsing. I propose building a custom screening system with advanced ML models for candidate ranking. I will use a modern tech stack with React frontend and FastAPI backend, with TensorFlow for the ML models.',
    estimatedDelivery: 20, price: 18000, technologies: ['React', 'Python', 'FastAPI', 'TensorFlow', 'PostgreSQL'],
    milestones: [
      { id: 'pm1', title: 'UI + Architecture', description: 'Design system architecture and build frontend', amount: 4000, estimatedDays: 5 },
      { id: 'pm2', title: 'Backend + Database', description: 'Build API and database layer', amount: 6000, estimatedDays: 5 },
      { id: 'pm3', title: 'ML Models + Integration', description: 'Train models and integrate with backend', amount: 5000, estimatedDays: 7 },
      { id: 'pm4', title: 'Testing + Deployment', description: 'Testing, optimization, and deployment', amount: 3000, estimatedDays: 3 },
    ],
    status: 'pending', createdAt: '2026-08-06T14:00:00Z', updatedAt: '2026-08-06T14:00:00Z',
  },
  {
    id: 'prop2', solutionRequestId: 'sr1', studentId: 'u3', student: students[2],
    content: 'I specialize in building enterprise-grade applications. For this project, I propose using Spring Boot for the backend with a React frontend. My approach includes building a robust API layer, implementing ML models using Python microservices, and ensuring scalability for high-volume resume processing.',
    estimatedDelivery: 25, price: 20000, technologies: ['React', 'Java', 'Spring Boot', 'Python', 'PostgreSQL'],
    milestones: [
      { id: 'pm5', title: 'Architecture & Setup', description: 'Project setup and architecture design', amount: 4000, estimatedDays: 5 },
      { id: 'pm6', title: 'Core Backend', description: 'API development and database', amount: 7000, estimatedDays: 8 },
      { id: 'pm7', title: 'ML Integration', description: 'ML model integration', amount: 5000, estimatedDays: 7 },
      { id: 'pm8', title: 'Testing & Deploy', description: 'QA and deployment', amount: 4000, estimatedDays: 5 },
    ],
    status: 'pending', createdAt: '2026-08-06T16:00:00Z', updatedAt: '2026-08-06T16:00:00Z',
  },
  {
    id: 'prop3', solutionRequestId: 'sr1', studentId: 'u4', student: students[3],
    content: 'While mobile is my primary expertise, I have strong experience in full-stack development. I will build this system with a focus on user experience and mobile-responsive design. The ML components will use pre-trained models from Hugging Face for quick and accurate resume parsing.',
    estimatedDelivery: 30, price: 15000, technologies: ['React', 'Node.js', 'Python', 'Hugging Face', 'MongoDB'],
    milestones: [
      { id: 'pm9', title: 'Frontend Development', description: 'Build responsive UI', amount: 5000, estimatedDays: 10 },
      { id: 'pm10', title: 'Backend & ML', description: 'API and ML integration', amount: 6000, estimatedDays: 12 },
      { id: 'pm11', title: 'Testing & Polish', description: 'Testing and final polish', amount: 4000, estimatedDays: 8 },
    ],
    status: 'pending', createdAt: '2026-08-07T09:00:00Z', updatedAt: '2026-08-07T09:00:00Z',
  },
];

// ── Contracts ──────────────────────────────────────────────

export const contracts: Contract[] = [
  {
    id: 'cont1', proposalId: 'prop-accepted-1', solutionRequestId: 'sr8',
    studentId: 'u3', student: students[2], clientId: 'c1', client: clients[0],
    projectId: 'proj3', totalAmount: 35000, platformFee: 3500, studentEarnings: 31500,
    status: 'active',
    milestones: [
      { id: 'cm1', contractId: 'cont1', title: 'Project Setup & UI Design', description: 'Architecture, project setup, and UI design', amount: 7000, status: 'approved', dueDate: '2026-08-10', submittedAt: '2026-08-08', approvedAt: '2026-08-09' },
      { id: 'cm2', contractId: 'cont1', title: 'Backend & Database', description: 'API development and database setup', amount: 10000, status: 'in_progress', dueDate: '2026-08-30' },
      { id: 'cm3', contractId: 'cont1', title: 'Geo-fencing & Mobile App', description: 'Location tracking and mobile app', amount: 10000, status: 'pending', dueDate: '2026-09-20' },
      { id: 'cm4', contractId: 'cont1', title: 'Testing & Deployment', description: 'QA testing and production deployment', amount: 8000, status: 'pending', dueDate: '2026-10-15' },
    ],
    startDate: '2026-07-25', expectedEndDate: '2026-10-30', createdAt: '2026-07-25', updatedAt: '2026-08-05',
  },
];

// ── Conversations & Messages ───────────────────────────────

export const conversations: Conversation[] = [
  {
    id: 'conv1', participants: [students[2], clients[0]], projectId: 'proj3', contractId: 'cont1',
    lastMessage: { id: 'msg5', conversationId: 'conv1', senderId: 'u3', content: 'I\'ve completed the UI designs. Please review the Figma link.', type: 'text', isRead: false, createdAt: '2026-08-08T09:30:00Z' },
    unreadCount: 1, createdAt: '2026-07-25', updatedAt: '2026-08-08T09:30:00Z',
  },
  {
    id: 'conv2', participants: [students[0], clients[0]],
    lastMessage: { id: 'msg10', conversationId: 'conv2', senderId: 'c1', content: 'Thanks for the detailed proposal. Let me discuss with my team.', type: 'text', isRead: true, createdAt: '2026-08-07T14:00:00Z' },
    unreadCount: 0, createdAt: '2026-08-06', updatedAt: '2026-08-07T14:00:00Z',
  },
];

export const messages: Message[] = [
  { id: 'msg1', conversationId: 'conv1', senderId: 'c1', content: 'Hi Rahul, excited to start the project!', type: 'text', isRead: true, createdAt: '2026-07-25T10:00:00Z' },
  { id: 'msg2', conversationId: 'conv1', senderId: 'u3', content: 'Thank you! I\'ve started with the architecture design. Will share the initial wireframes by tomorrow.', type: 'text', isRead: true, createdAt: '2026-07-25T10:15:00Z' },
  { id: 'msg3', conversationId: 'conv1', senderId: 'system', content: 'Milestone 1 "Project Setup & UI Design" has been started.', type: 'system', isRead: true, createdAt: '2026-07-26T09:00:00Z' },
  { id: 'msg4', conversationId: 'conv1', senderId: 'c1', content: 'Can we add CSV export to the reports?', type: 'text', isRead: true, createdAt: '2026-08-05T14:00:00Z' },
  { id: 'msg5', conversationId: 'conv1', senderId: 'u3', content: 'I\'ve completed the UI designs. Please review the Figma link.', type: 'text', isRead: false, createdAt: '2026-08-08T09:30:00Z' },
];

// ── Notifications ──────────────────────────────────────────

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', type: 'proposal', title: 'New proposal received', message: 'TechStart Solutions is reviewing your proposal for AI Resume Screening.', link: '/proposals/prop1', isRead: false, createdAt: '2026-08-08T10:00:00Z' },
  { id: 'n2', userId: 'u1', type: 'purchase', title: 'Product purchased', message: 'Someone purchased your AI Resume Analyzer.', link: '/earnings', isRead: false, createdAt: '2026-08-08T08:30:00Z' },
  { id: 'n3', userId: 'u1', type: 'match', title: 'New opportunity match', message: 'A new requirement matching your skills has been posted: AI Customer Support Chatbot.', link: '/solutions/sr6', isRead: true, createdAt: '2026-08-07T09:00:00Z' },
  { id: 'n4', userId: 'u3', type: 'contract', title: 'Milestone approved', message: 'TechStart Solutions approved Milestone 1. ₹7,000 has been released.', link: '/contracts/cont1', isRead: true, createdAt: '2026-08-09T10:00:00Z' },
  { id: 'n5', userId: 'u1', type: 'review', title: 'New review', message: 'You received a 5-star review on AI Resume Analyzer.', link: '/reviews', isRead: true, createdAt: '2026-08-06T16:00:00Z' },
  { id: 'n6', userId: 'u1', type: 'message', title: 'New message', message: 'TechStart Solutions sent you a message.', link: '/messages', isRead: true, createdAt: '2026-08-07T14:00:00Z' },
  { id: 'n7', userId: 'u1', type: 'system', title: 'Profile verified', message: 'Your student identity has been verified. You now have a verified badge.', isRead: true, createdAt: '2025-03-20T12:00:00Z' },
];

// ── Reviews ────────────────────────────────────────────────

export const reviews: Review[] = [
  {
    id: 'r1', contractId: 'cont-old-1', reviewerId: 'c1', reviewer: clients[0],
    revieweeId: 'u1', reviewee: students[0],
    communication: 5, quality: 5, delivery: 4, professionalism: 5, overall: 4.8,
    content: 'Harsh delivered an excellent product. Great communication throughout the project. Code quality was outstanding and he went above and beyond with documentation. Slightly delayed on one milestone but made up for it with the quality.',
    isVerified: true, createdAt: '2026-05-15',
  },
  {
    id: 'r2', contractId: 'cont-old-2', reviewerId: 'c2', reviewer: clients[1],
    revieweeId: 'u3', reviewee: students[2],
    communication: 4, quality: 5, delivery: 5, professionalism: 5, overall: 4.8,
    content: 'Rahul is extremely professional and delivers on time. The inventory system he built exceeded our expectations. Highly recommend for backend-heavy projects.',
    isVerified: true, createdAt: '2026-04-20',
  },
  {
    id: 'r3', contractId: 'cont-old-3', reviewerId: 'c3', reviewer: clients[2],
    revieweeId: 'u2', reviewee: students[1],
    communication: 5, quality: 5, delivery: 5, professionalism: 4, overall: 4.8,
    content: 'Priya built an amazing AI model for our patient data analysis. Her ML expertise is top-notch. The dashboard she created was intuitive and our staff adapted to it quickly.',
    isVerified: true, createdAt: '2026-06-10',
  },
];

// ── Transactions ───────────────────────────────────────────

export const transactions: Transaction[] = [
  { id: 'tx1', type: 'payment', amount: 499, status: 'completed', fromUserId: 'buyer1', toUserId: 'u1', orderId: 'ord1', description: 'AI Resume Analyzer purchase', createdAt: '2026-08-08T08:30:00Z' },
  { id: 'tx2', type: 'payment', amount: 7000, status: 'completed', fromUserId: 'c1', toUserId: 'u3', contractId: 'cont1', milestoneId: 'cm1', description: 'Milestone 1 payment - Attendance System', createdAt: '2026-08-09T10:00:00Z' },
  { id: 'tx3', type: 'commission', amount: 700, status: 'completed', fromUserId: 'u3', description: 'Platform commission - Milestone 1', createdAt: '2026-08-09T10:00:00Z' },
  { id: 'tx4', type: 'payout', amount: 6300, status: 'completed', toUserId: 'u3', description: 'Payout - Milestone 1 (after commission)', createdAt: '2026-08-09T10:05:00Z' },
  { id: 'tx5', type: 'payment', amount: 1999, status: 'completed', fromUserId: 'buyer2', toUserId: 'u3', orderId: 'ord2', description: 'College ERP System purchase', createdAt: '2026-08-07T12:00:00Z' },
  { id: 'tx6', type: 'payment', amount: 799, status: 'completed', fromUserId: 'buyer3', toUserId: 'u6', orderId: 'ord3', description: 'E-Commerce Starter Kit purchase', createdAt: '2026-08-06T15:00:00Z' },
  { id: 'tx7', type: 'payment', amount: 499, status: 'completed', fromUserId: 'buyer4', toUserId: 'u1', orderId: 'ord4', description: 'AI Resume Analyzer purchase', createdAt: '2026-08-05T09:00:00Z' },
  { id: 'tx8', type: 'payment', amount: 2499, status: 'completed', fromUserId: 'buyer5', toUserId: 'u1', orderId: 'ord5', description: 'SaaS Boilerplate purchase', createdAt: '2026-08-04T11:00:00Z' },
];

// ── Wallet ─────────────────────────────────────────────────

export const studentWallet: Wallet = {
  available: 42500,
  pending: 8000,
  totalEarned: 124500,
  transactions: transactions.filter(t => t.toUserId === 'u1' || t.fromUserId === 'u1'),
};

// ── Platform Statistics ────────────────────────────────────

export const platformStats: PlatformStats = {
  totalStudents: 10247,
  totalProjects: 2156,
  totalProducts: 847,
  solutionsBuilt: 523,
  totalEarnings: 2500000,
  activeContracts: 156,
  totalClients: 1842,
  totalTransactions: 4521,
};

// ── Admin Metrics ──────────────────────────────────────────

export const adminMetrics: AdminMetrics = {
  ...platformStats,
  userGrowth: [
    { month: 'Jan', users: 6200 }, { month: 'Feb', users: 6800 }, { month: 'Mar', users: 7400 },
    { month: 'Apr', users: 7900 }, { month: 'May', users: 8500 }, { month: 'Jun', users: 9200 },
    { month: 'Jul', users: 9800 }, { month: 'Aug', users: 10247 },
  ],
  productSales: [
    { month: 'Jan', sales: 245 }, { month: 'Feb', sales: 312 }, { month: 'Mar', sales: 398 },
    { month: 'Apr', sales: 425 }, { month: 'May', sales: 510 }, { month: 'Jun', sales: 578 },
    { month: 'Jul', sales: 645 }, { month: 'Aug', sales: 412 },
  ],
  solutionRequests: [
    { month: 'Jan', requests: 32 }, { month: 'Feb', requests: 41 }, { month: 'Mar', requests: 55 },
    { month: 'Apr', requests: 48 }, { month: 'May', requests: 62 }, { month: 'Jun', requests: 71 },
    { month: 'Jul', requests: 68 }, { month: 'Aug', requests: 45 },
  ],
  completedContracts: [
    { month: 'Jan', contracts: 18 }, { month: 'Feb', contracts: 22 }, { month: 'Mar', contracts: 31 },
    { month: 'Apr', contracts: 28 }, { month: 'May', contracts: 35 }, { month: 'Jun', contracts: 42 },
    { month: 'Jul', contracts: 38 }, { month: 'Aug', contracts: 25 },
  ],
  revenue: [
    { month: 'Jan', revenue: 85000 }, { month: 'Feb', revenue: 112000 }, { month: 'Mar', revenue: 145000 },
    { month: 'Apr', revenue: 132000 }, { month: 'May', revenue: 178000 }, { month: 'Jun', revenue: 205000 },
    { month: 'Jul', revenue: 192000 }, { month: 'Aug', revenue: 125000 },
  ],
  activeUsers: [
    { month: 'Jan', active: 3200 }, { month: 'Feb', active: 3600 }, { month: 'Mar', active: 4100 },
    { month: 'Apr', active: 4400 }, { month: 'May', active: 4900 }, { month: 'Jun', active: 5300 },
    { month: 'Jul', active: 5100 }, { month: 'Aug', active: 4800 },
  ],
};

// ── Earnings Data ──────────────────────────────────────────

export const earningsData = [
  { month: 'Jan', earnings: 8500 },
  { month: 'Feb', earnings: 12000 },
  { month: 'Mar', earnings: 18500 },
  { month: 'Apr', earnings: 15200 },
  { month: 'May', earnings: 22000 },
  { month: 'Jun', earnings: 19800 },
  { month: 'Jul', earnings: 24500 },
  { month: 'Aug', earnings: 14000 },
];

// ── AI Match Scores ────────────────────────────────────────

export const aiMatchScores: Record<string, AIMatchScore> = {
  'sr1': { score: 92, matchingSkills: ['Python', 'Machine Learning', 'React', 'FastAPI'], missingSkills: [], reason: 'Strong match based on your AI/ML expertise and existing resume analyzer project.' },
  'sr6': { score: 85, matchingSkills: ['Python', 'React', 'FastAPI'], missingSkills: ['NLP specialized'], reason: 'Good match for chatbot development with your Python and API experience.' },
  'sr9': { score: 78, matchingSkills: ['React', 'Python', 'PostgreSQL'], missingSkills: ['D3.js'], reason: 'Solid match for analytics work with your data handling skills.' },
  'sr2': { score: 72, matchingSkills: ['React', 'Node.js', 'PostgreSQL'], missingSkills: ['Payment gateway experience'], reason: 'Can build the web components; payment integration will be a learning opportunity.' },
};

// ── Categories ─────────────────────────────────────────────

export const categories: Category[] = [
  { id: 'web', name: 'Web Development', slug: 'web-development', icon: 'Globe', productCount: 312, requestCount: 45 },
  { id: 'ai-ml', name: 'AI / ML', slug: 'ai-ml', icon: 'Brain', productCount: 156, requestCount: 28 },
  { id: 'mobile', name: 'Mobile', slug: 'mobile', icon: 'Smartphone', productCount: 98, requestCount: 18 },
  { id: 'saas', name: 'SaaS', slug: 'saas', icon: 'Cloud', productCount: 67, requestCount: 12 },
  { id: 'api', name: 'APIs', slug: 'apis', icon: 'Plug', productCount: 89, requestCount: 15 },
  { id: 'templates', name: 'Templates', slug: 'templates', icon: 'Layout', productCount: 124, requestCount: 0 },
  { id: 'ui-kits', name: 'UI Kits', slug: 'ui-kits', icon: 'Palette', productCount: 78, requestCount: 0 },
  { id: 'data-science', name: 'Data Science', slug: 'data-science', icon: 'BarChart3', productCount: 56, requestCount: 22 },
  { id: 'devops', name: 'DevOps', slug: 'devops', icon: 'Server', productCount: 34, requestCount: 8 },
  { id: 'automation', name: 'Automation', slug: 'automation', icon: 'Zap', productCount: 45, requestCount: 14 },
];

// ── Current User (for demo) ────────────────────────────────

export const currentUser: User = students[0];
