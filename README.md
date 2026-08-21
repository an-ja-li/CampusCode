# CampusCode

**Build. Manage. Sell. Earn.**

A production-quality student-focused software marketplace and project-management platform. CampusCode connects student developers with people and organizations that need software solutions.

## 🚀 Features

### Two Marketplace Flows

1. **Student Software Marketplace** — Students can build, manage, publish, and sell software projects, templates, SaaS products, APIs, UI kits, ML projects, and developer tools.
2. **Solution Request Marketplace** — Anyone can post a software requirement. Students discover requests, submit proposals, build solutions, and get paid.

### Platform Highlights

- 🎨 **Modern SaaS UI** — Dark/light mode, glassmorphism, Framer Motion animations
- 📊 **Dashboard** — Real-time stats, earnings charts, AI-recommended opportunities
- 📋 **Project Management** — Kanban boards, task tracking, milestone management
- 🛒 **Marketplace** — Product search, filters, categories, ratings, quality scores
- 💬 **Real-time Messaging** — Split-pane chat with conversation management
- 💰 **Earnings & Payments** — Wallet, transaction history, payout management (Razorpay)
- 🤖 **AI Features** — Project planner, requirement analyzer, proposal assistant, skill matching
- 🔐 **Role-based Access** — Student, Client, and Admin dashboards
- 🏆 **Gamification** — Student levels, achievement badges, verified profiles
- 📱 **Fully Responsive** — Mobile-first design across all pages

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Database | PostgreSQL + Prisma |
| Auth | NextAuth.js (Google, GitHub, Credentials) |
| Payments | Razorpay (mock-ready) |
| AI | OpenAI / Gemini (mock-ready) |

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Landing page
│   ├── login/               # Authentication
│   ├── register/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── (dashboard)/         # Dashboard route group
│   │   ├── dashboard/       # Overview
│   │   ├── marketplace/     # Software marketplace
│   │   ├── solutions/       # Solution requests
│   │   ├── projects/        # Project management + Kanban
│   │   ├── proposals/       # Proposal tracking
│   │   ├── contracts/       # Contract management
│   │   ├── messages/        # Real-time messaging
│   │   ├── earnings/        # Wallet & transactions
│   │   ├── sell/            # Product publishing wizard
│   │   ├── portfolio/       # Public developer profile
│   │   ├── reviews/         # Review management
│   │   ├── settings/        # User settings
│   │   └── admin/           # Admin dashboard
│   └── api/                 # RESTful API routes
├── components/
│   ├── ui/                  # Reusable UI primitives
│   ├── layout/              # Navbar, Footer
│   └── providers/           # Theme provider
├── hooks/                   # Custom React hooks
├── services/                # External service abstractions
├── lib/                     # Utilities, constants, mock data
├── types/                   # TypeScript interfaces
└── prisma/                  # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL (optional — app works with mock data)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/campuscode.git
cd campuscode

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Database Setup (Optional)

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed demo data
npx prisma db seed
```

### Build for Production

```bash
npm run build
npm start
```

## 📊 Pages Overview

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, marketplace previews, stats |
| `/login` | Email/password + OAuth login |
| `/register` | Multi-step registration (Student / Client) |
| `/dashboard` | Overview with stats, charts, recommendations |
| `/marketplace` | Browse & search software products |
| `/marketplace/[product]` | Product detail with reviews, quality score |
| `/solutions` | Browse posted software requirements |
| `/solutions/[id]` | Requirement detail + submit proposal |
| `/solutions/post` | 7-step requirement posting wizard |
| `/projects` | Project list with progress tracking |
| `/projects/[id]` | Project workspace (Overview, Kanban, Tasks, Team) |
| `/proposals` | Track submitted proposals |
| `/contracts` | Active contract & milestone management |
| `/messages` | Real-time messaging interface |
| `/earnings` | Wallet, earnings chart, transactions |
| `/sell` | 7-step product publishing wizard |
| `/portfolio/[slug]` | Public developer portfolio |
| `/reviews` | Review management with rating breakdown |
| `/settings` | Profile, notifications, security, billing |
| `/admin` | Platform overview, user/product moderation |
| `/admin/users` | User management table |
| `/admin/products` | Product moderation queue |
| `/admin/requests` | Solution request moderation |
| `/admin/transactions` | Financial transactions overview |

## 🔑 API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/products` | GET, POST | Product CRUD with search & filtering |
| `/api/projects` | GET, POST | Project management |
| `/api/solutions` | GET, POST | Solution requests |
| `/api/proposals` | GET, POST | Proposal submission & tracking |
| `/api/contracts` | GET | Contract queries |
| `/api/messages` | GET, POST | Messaging |
| `/api/payments` | POST | Payment processing (Razorpay) |
| `/api/search` | GET | Global search across all entities |
| `/api/notifications` | GET, PATCH | Notification management |
| `/api/ai` | POST | AI-powered features |

## 🎨 Design Philosophy

- **Premium aesthetic** — Not a generic college website. Designed to feel like a modern SaaS product.
- **Inspired by** GitHub (code), Trello/Linear (project management), Gumroad (selling), Upwork (freelancing), Product Hunt (discovery).
- **Accessibility** — Semantic HTML, keyboard navigation, ARIA attributes.
- **Performance** — Static generation where possible, optimized bundle size.

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
