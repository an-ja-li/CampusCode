// ============================================================
// CampusCode — Project GitHub Live Activity API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface GitHubCommitItem {
  sha: string;
  message: string;
  author: {
    name: string;
    avatarUrl?: string;
    date: string;
  };
  htmlUrl: string;
  branch: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const customRepoUrl = searchParams.get('repoUrl');

    let repoUrl = customRepoUrl;

    if (!repoUrl) {
      const project = await db.project.findUnique({
        where: { id },
        select: { githubRepo: true, name: true, technologies: true },
      });
      repoUrl = project?.githubRepo || null;
    }

    if (!repoUrl) {
      return NextResponse.json({
        connected: false,
        repo: null,
        commits: [],
        stats: null,
      });
    }

    // Extract owner and repo from URL (e.g., https://github.com/owner/repo or owner/repo)
    const cleanUrl = repoUrl.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');
    const parts = cleanUrl.split('/');

    if (parts.length < 2) {
      return NextResponse.json({
        connected: true,
        repo: { fullName: cleanUrl, url: repoUrl, defaultBranch: 'main' },
        commits: generateDemoCommits(cleanUrl, ['React', 'Node.js']),
        stats: { stars: 12, forks: 3, openIssues: 1, defaultBranch: 'main' },
      });
    }

    const [owner, repoName] = parts;

    // Fetch from GitHub REST API
    try {
      const headers: Record<string, string> = {
        'User-Agent': 'CampusCode-App',
        Accept: 'application/vnd.github.v3+json',
      };

      // Optional GitHub personal token if in env
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }

      const [repoRes, commitsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repoName}`, {
          headers,
          next: { revalidate: 60 },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repoName}/commits?per_page=15`, {
          headers,
          next: { revalidate: 60 },
        }),
      ]);

      if (repoRes.ok && commitsRes.ok) {
        const repoData = await repoRes.json();
        const commitsData = await commitsRes.json();

        const formattedCommits: GitHubCommitItem[] = Array.isArray(commitsData)
          ? commitsData.map((c: any) => ({
              sha: c.sha.substring(0, 7),
              message: c.commit.message?.split('\n')[0] || 'Commit update',
              author: {
                name: c.commit.author?.name || c.author?.login || 'Developer',
                avatarUrl: c.author?.avatar_url || '',
                date: c.commit.author?.date || new Date().toISOString(),
              },
              htmlUrl: c.html_url,
              branch: repoData.default_branch || 'main',
            }))
          : [];

        return NextResponse.json({
          connected: true,
          isLive: true,
          repo: {
            name: repoData.name,
            fullName: repoData.full_name,
            description: repoData.description,
            url: repoData.html_url,
            defaultBranch: repoData.default_branch || 'main',
            language: repoData.language,
            updatedAt: repoData.pushed_at || repoData.updated_at,
          },
          stats: {
            stars: repoData.stargazers_count || 0,
            forks: repoData.forks_count || 0,
            openIssues: repoData.open_issues_count || 0,
            watchers: repoData.watchers_count || 0,
            defaultBranch: repoData.default_branch || 'main',
          },
          commits: formattedCommits,
        });
      }
    } catch (fetchError) {
      console.warn('[GitHub API fetch error, using fallback]:', fetchError);
    }

    // Fallback if private, rate limited, or demo repo
    return NextResponse.json({
      connected: true,
      isLive: false,
      repo: {
        name: repoName,
        fullName: `${owner}/${repoName}`,
        url: `https://github.com/${owner}/${repoName}`,
        defaultBranch: 'main',
      },
      stats: {
        stars: 18,
        forks: 4,
        openIssues: 2,
        defaultBranch: 'main',
      },
      commits: generateDemoCommits(`${owner}/${repoName}`, ['TypeScript', 'Tailwind CSS']),
    });
  } catch (error) {
    console.error('[API Project GitHub Activity Error]:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub activity' }, { status: 500 });
  }
}

function generateDemoCommits(repoName: string, tech: string[]): GitHubCommitItem[] {
  const now = Date.now();
  const commits = [
    {
      sha: 'a8b3f21',
      message: 'feat: add interactive service booking dashboard and time slot picker',
      minsAgo: 14,
      author: 'Harsh Vardhan',
    },
    {
      sha: '9c4d10e',
      message: 'refactor: optimize MongoDB aggregate pipelines and JWT middleware',
      minsAgo: 120,
      author: 'Harsh Vardhan',
    },
    {
      sha: 'e571a2b',
      message: 'fix: resolve provider location geolocation radius filter query',
      minsAgo: 380,
      author: 'Harsh Vardhan',
    },
    {
      sha: '7f9c34d',
      message: 'chore: setup Tailwind CSS v4 design tokens and custom components',
      minsAgo: 1440,
      author: 'Collaborator',
    },
    {
      sha: '3b81ef0',
      message: 'initial commit: project scaffold, Prisma schema, and Next.js routing',
      minsAgo: 2880,
      author: 'Harsh Vardhan',
    },
  ];

  return commits.map((c) => ({
    sha: c.sha,
    message: c.message,
    author: {
      name: c.author,
      avatarUrl: `https://avatar.vercel.sh/${c.author.replace(/\s+/g, '')}`,
      date: new Date(now - c.minsAgo * 60 * 1000).toISOString(),
    },
    htmlUrl: `https://github.com/${repoName}/commit/${c.sha}`,
    branch: 'main',
  }));
}
