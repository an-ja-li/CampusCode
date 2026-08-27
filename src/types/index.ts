// ============================================================
// CampusCode — TypeScript Type Definitions
// ============================================================

// ── Enums ──────────────────────────────────────────────────

export type UserRole = 'student' | 'client' | 'admin';
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed' | 'archived';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProductStatus = 'draft' | 'pending_review' | 'published' | 'rejected' | 'archived';
export type OrderStatus = 'pending' | 'completed' | 'refunded' | 'disputed';
export type SolutionRequestStatus = 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled';
export type ProposalStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type ContractStatus = 'created' | 'active' | 'in_review' | 'completed' | 'disputed' | 'cancelled';
export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'revision_requested';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
export type NotificationType = 'proposal' | 'contract' | 'payment' | 'review' | 'message' | 'system' | 'match' | 'purchase';
export type StudentLevel = 'beginner' | 'contributor' | 'builder' | 'expert' | 'top_developer';
export type LicenseType = 'MIT' | 'Commercial' | 'Personal Use' | 'Educational' | 'Custom';
export type BudgetRange = '5000-10000' | '10000-25000' | '25000-50000' | '50000+' | 'custom';
export type SolutionType = 'web' | 'mobile' | 'ai_ml' | 'automation' | 'api' | 'data_analytics' | 'desktop' | 'ui_ux' | 'other';

// ── Core Models ────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  studentProfile?: StudentProfile;
  clientProfile?: ClientProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  college: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  github?: string;
  linkedin?: string;
  bio: string;
  level: StudentLevel;
  badges: Badge[];
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalEarnings: number;
  completedProjects: number;
  portfolioUrl?: string;
}

export interface ClientProfile {
  id: string;
  userId: string;
  organization: string;
  website?: string;
  description: string;
  profileType: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  totalSpent: number;
  projectsPosted: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
}

// ── Project Management ─────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  owner?: User;
  technologies: string[];
  category: string;
  progress: number;
  deadline?: string;
  members: ProjectMember[];
  tasks: Task[];
  milestones: ProjectMilestone[];
  githubRepo?: string;
  isPublished: boolean;
  productId?: string;
  contractId?: string;
  clientId?: string;
  client?: User;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  userId: string;
  user?: User;
  projectId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User;
  labels: string[];
  dueDate?: string;
  subtasks: SubTask[];
  comments: Comment[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User;
  content: string;
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  progress: number;
  tasks: string[];
  createdAt: string;
}

// ── Marketplace ────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  longDescription?: string;
  category: string;
  tags: string[];
  technologies: string[];
  price: number;
  isFree: boolean;
  status: ProductStatus;
  sellerId: string;
  seller?: User;
  screenshots: string[];
  demoUrl?: string;
  features: string[];
  requirements: string[];
  installationGuide: string;
  documentation: string;
  version: string;
  changelog: ChangelogEntry[];
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
  salesCount: number;
  license: LicenseType;
  includes: string[];
  qualityScore: QualityScore;
  githubRepo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user?: User;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  createdAt: string;
}

export interface QualityScore {
  documentation: number;
  codeQuality: number;
  demoAvailability: number;
  readme: number;
  testing: number;
  overall: number;
}

export interface Order {
  id: string;
  productId: string;
  product?: Product;
  buyerId: string;
  buyer?: User;
  sellerId: string;
  seller?: User;
  amount: number;
  platformFee: number;
  sellerEarnings: number;
  status: OrderStatus;
  paymentId?: string;
  createdAt: string;
}

// ── Solution Requests ──────────────────────────────────────

export interface SolutionRequest {
  id: string;
  title: string;
  description: string;
  problemStatement: string;
  solutionType: SolutionType;
  requiredFeatures: string[];
  preferredTechnologies: string[];
  integrations: string[];
  platform: string;
  expectedDeliverables: string[];
  budgetRange: BudgetRange;
  budgetMin?: number;
  budgetMax?: number;
  isFixedPrice: boolean;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments: string[];
  status: SolutionRequestStatus;
  clientId: string;
  client?: User;
  proposals: Proposal[];
  proposalCount: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  isRemote: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Proposals ──────────────────────────────────────────────

export interface Proposal {
  id: string;
  solutionRequestId: string;
  solutionRequest?: SolutionRequest;
  studentId: string;
  student?: User;
  content: string;
  estimatedDelivery: number; // days
  price: number;
  technologies: string[];
  milestones: ProposalMilestone[];
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalMilestone {
  id: string;
  title: string;
  description: string;
  amount: number;
  estimatedDays: number;
}

// ── Contracts ──────────────────────────────────────────────

export interface Contract {
  id: string;
  proposalId: string;
  proposal?: Proposal;
  solutionRequestId: string;
  solutionRequest?: SolutionRequest;
  studentId: string;
  student?: User;
  clientId: string;
  client?: User;
  projectId?: string;
  project?: Project;
  totalAmount: number;
  platformFee: number;
  studentEarnings: number;
  status: ContractStatus;
  milestones: ContractMilestoneItem[];
  startDate: string;
  expectedEndDate: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractMilestoneItem {
  id: string;
  contractId: string;
  title: string;
  description: string;
  amount: number;
  status: MilestoneStatus;
  dueDate: string;
  submittedAt?: string;
  approvedAt?: string;
}

// ── Messaging ──────────────────────────────────────────────

export interface Conversation {
  id: string;
  participants: User[];
  projectId?: string;
  contractId?: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
}

// ── Reviews ────────────────────────────────────────────────

export interface Review {
  id: string;
  contractId: string;
  reviewerId: string;
  reviewer?: User;
  revieweeId: string;
  reviewee?: User;
  communication: number;
  quality: number;
  delivery: number;
  professionalism: number;
  overall: number;
  content: string;
  isVerified: boolean;
  createdAt: string;
}

// ── Payments & Earnings ────────────────────────────────────

export interface Transaction {
  id: string;
  type: 'payment' | 'payout' | 'refund' | 'commission';
  amount: number;
  status: PaymentStatus;
  fromUserId?: string;
  toUserId?: string;
  orderId?: string;
  contractId?: string;
  milestoneId?: string;
  description: string;
  createdAt: string;
}

export interface Wallet {
  available: number;
  pending: number;
  totalEarned: number;
  transactions: Transaction[];
}

// ── Notifications ──────────────────────────────────────────

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// ── GitHub ──────────────────────────────────────────────────

export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  commits: number;
  languages: Record<string, number>;
  lastUpdated: string;
  contributors: number;
}

// ── Categories & Tags ──────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  requestCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// ── AI Features ────────────────────────────────────────────

export interface AIProjectPlan {
  roadmap: string[];
  milestones: { title: string; duration: string; tasks: string[] }[];
  technologies: string[];
  estimatedTimeline: string;
}

export interface AIRequirementAnalysis {
  complexity: 'low' | 'medium' | 'high' | 'very_high';
  suggestedTechnologies: string[];
  estimatedDevelopmentTime: string;
  recommendedBudget: { min: number; max: number };
  requiredSkills: string[];
}

export interface AIMatchScore {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
}

// ── Platform Statistics ────────────────────────────────────

export interface PlatformStats {
  totalStudents: number;
  totalProjects: number;
  totalProducts: number;
  solutionsBuilt: number;
  totalEarnings: number;
  activeContracts: number;
  totalClients: number;
  totalTransactions: number;
}

export interface AdminMetrics extends PlatformStats {
  userGrowth: { month: string; users: number }[];
  productSales: { month: string; sales: number }[];
  solutionRequests: { month: string; requests: number }[];
  completedContracts: { month: string; contracts: number }[];
  revenue: { month: string; revenue: number }[];
  activeUsers: { month: string; active: number }[];
}
