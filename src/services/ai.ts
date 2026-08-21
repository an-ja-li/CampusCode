// ============================================================
// CampusCode — AI Service (Mock Abstraction)
// ============================================================

export interface AIProjectPlan {
  name: string;
  description: string;
  milestones: { title: string; description: string; durationDays: number }[];
  suggestedTech: string[];
  estimatedEffort: string;
  estimatedCost: { min: number; max: number };
}

export interface AIRequirementAnalysis {
  complexity: 'low' | 'medium' | 'high';
  estimatedEffort: string;
  suggestedBudget: { min: number; max: number };
  keyFeatures: string[];
  potentialChallenges: string[];
  techRecommendations: string[];
}

export interface AIProposalSuggestion {
  proposalContent: string;
  suggestedPrice: number;
  suggestedTimeline: number;
  milestones: { title: string; amount: number }[];
  keySellingPoints: string[];
}

export interface AIMatchResult {
  score: number;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
}

export interface AIListingOptimization {
  title: string;
  description: string;
  tags: string[];
  priceSuggestion: { min: number; max: number };
  improvements: string[];
}

class AIService {
  private isLive = false;

  constructor() {
    this.isLive = !!process.env.OPENAI_API_KEY || !!process.env.GEMINI_API_KEY;
  }

  async generateProjectPlan(description: string): Promise<AIProjectPlan> {
    // TODO: Call OpenAI/Gemini API
    return {
      name: 'Generated Project',
      description: `AI-generated plan based on: ${description.slice(0, 50)}...`,
      milestones: [
        { title: 'Requirements & Design', description: 'Gather requirements, create wireframes, and design system architecture', durationDays: 7 },
        { title: 'Core Development', description: 'Build the core features and backend APIs', durationDays: 14 },
        { title: 'Frontend & Integration', description: 'Develop the frontend UI and integrate with backend', durationDays: 10 },
        { title: 'Testing & QA', description: 'Comprehensive testing, bug fixes, and performance optimization', durationDays: 5 },
        { title: 'Deployment & Documentation', description: 'Deploy to production and write documentation', durationDays: 4 },
      ],
      suggestedTech: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
      estimatedEffort: '40 days',
      estimatedCost: { min: 15000, max: 35000 },
    };
  }

  async analyzeRequirement(description: string, features: string[]): Promise<AIRequirementAnalysis> {
    return {
      complexity: features.length > 5 ? 'high' : features.length > 3 ? 'medium' : 'low',
      estimatedEffort: `${features.length * 5}-${features.length * 8} days`,
      suggestedBudget: { min: features.length * 3000, max: features.length * 6000 },
      keyFeatures: features.slice(0, 5),
      potentialChallenges: [
        'Scalability requirements may need careful architecture planning',
        'Third-party API integrations may have rate limits',
        'Real-time features require WebSocket infrastructure',
      ],
      techRecommendations: ['Next.js for frontend', 'PostgreSQL for database', 'Redis for caching'],
    };
  }

  async suggestProposal(requirementDescription: string, userSkills: string[]): Promise<AIProposalSuggestion> {
    return {
      proposalContent: `I am excited to work on this project. With my expertise in ${userSkills.slice(0, 3).join(', ')}, I can deliver a high-quality solution. I will follow industry best practices and provide clean, maintainable code with comprehensive documentation.`,
      suggestedPrice: 25000,
      suggestedTimeline: 30,
      milestones: [
        { title: 'Project Setup & Design', amount: 5000 },
        { title: 'Core Feature Development', amount: 10000 },
        { title: 'Integration & Testing', amount: 7000 },
        { title: 'Deployment & Handoff', amount: 3000 },
      ],
      keySellingPoints: [
        'Strong expertise in the required technologies',
        'Proven track record of on-time delivery',
        'Clean, well-documented code',
        'Post-delivery support included',
      ],
    };
  }

  async matchStudentToRequest(studentSkills: string[], requestTech: string[]): Promise<AIMatchResult> {
    const matching = studentSkills.filter((s) => requestTech.some((t) => t.toLowerCase() === s.toLowerCase()));
    const missing = requestTech.filter((t) => !studentSkills.some((s) => s.toLowerCase() === t.toLowerCase()));
    const score = Math.round((matching.length / Math.max(requestTech.length, 1)) * 100);

    return {
      score: Math.min(score + 10, 100),
      matchingSkills: matching,
      missingSkills: missing,
      reason: score >= 70
        ? 'Strong match based on your skill set and experience.'
        : score >= 40
        ? 'Moderate match. Consider building skills in missing areas.'
        : 'This request requires skills outside your primary expertise.',
    };
  }

  async optimizeListing(title: string, description: string, technologies: string[]): Promise<AIListingOptimization> {
    return {
      title: title || 'Optimized Product Title',
      description: description || 'An AI-optimized product description',
      tags: [...technologies.slice(0, 5), 'developer-tool', 'open-source'],
      priceSuggestion: { min: 299, max: 999 },
      improvements: [
        'Add a video demo to increase conversions by 40%',
        'Include before/after screenshots',
        'Highlight unique selling points in the first paragraph',
        'Add testimonials or case studies if available',
      ],
    };
  }
}

export const aiService = new AIService();
