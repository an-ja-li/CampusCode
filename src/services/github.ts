// ============================================================
// CampusCode — GitHub Service (Mock Abstraction)
// ============================================================

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  topics: string[];
  updated_at: string;
}

class GitHubService {
  private token: string | null;

  constructor() {
    this.token = process.env.GITHUB_ACCESS_TOKEN || null;
  }

  async getUser(username: string): Promise<GitHubUser> {
    if (this.token) {
      // TODO: Call GitHub API - GET /users/:username
    }

    return {
      id: 1,
      login: username,
      name: 'Harsh Vardhan',
      avatar_url: '',
      bio: 'Full-stack developer passionate about building products',
      public_repos: 42,
      followers: 128,
      following: 55,
    };
  }

  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    if (this.token) {
      // TODO: Call GitHub API - GET /users/:username/repos
    }

    return [
      {
        id: 1,
        name: 'ai-resume-analyzer',
        full_name: `${username}/ai-resume-analyzer`,
        description: 'AI-powered resume analysis and scoring system',
        language: 'Python',
        stargazers_count: 245,
        forks_count: 42,
        html_url: `https://github.com/${username}/ai-resume-analyzer`,
        topics: ['ai', 'machine-learning', 'resume', 'nlp'],
        updated_at: '2026-08-01T10:00:00Z',
      },
      {
        id: 2,
        name: 'campus-marketplace',
        full_name: `${username}/campus-marketplace`,
        description: 'Student marketplace for buying and selling software',
        language: 'TypeScript',
        stargazers_count: 128,
        forks_count: 18,
        html_url: `https://github.com/${username}/campus-marketplace`,
        topics: ['react', 'nextjs', 'marketplace'],
        updated_at: '2026-07-15T10:00:00Z',
      },
    ];
  }

  async getRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    return {
      TypeScript: 65000,
      Python: 25000,
      CSS: 8000,
      JavaScript: 2000,
    };
  }

  async getRepoCommitCount(owner: string, repo: string): Promise<number> {
    return 342;
  }
}

export const githubService = new GitHubService();
