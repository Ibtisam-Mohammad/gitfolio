import 'server-only';
import { GitHubRepo, GitHubUser } from './types';
import type { LanguageData } from './types';

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.warn(
    'GITHUB_TOKEN is not set. API requests will be unauthenticated and subject to lower rate limits.'
  );
}

const headers: HeadersInit = {
  'X-GitHub-Api-Version': '2022-11-28',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

class GitHubAPIError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'GitHubAPIError';
    this.status = status;
  }
}

async function fetchGitHubAPI<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API_URL}${path}`, {
    headers,
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
    throw new GitHubAPIError(errorBody.message || `Failed to fetch from GitHub API with status ${res.status}`, res.status);
  }
  return res.json();
}

export async function getGithubUserAndRepos(username: string): Promise<{ user: GitHubUser; repos: GitHubRepo[] }> {
  try {
    const [user, repos] = await Promise.all([
      fetchGitHubAPI<GitHubUser>(`/users/${username}`),
      fetchGitHubAPI<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=pushed`),
    ]);

    // Filter out forked repos and only include those owned by the user
    const ownedRepos = repos.filter(repo => !repo.fork && repo.owner.login === username);

    return { user, repos: ownedRepos };
  } catch (error) {
    if (error instanceof GitHubAPIError && error.status === 404) {
      throw new Error(`GitHub user "${username}" not found.`);
    }
    // Re-throw other errors
    throw error;
  }
}

export function analyzeLanguages(repos: GitHubRepo[]): Omit<LanguageData, 'color'>[] {
  if (!repos || repos.length === 0) return [];

  const langCount = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(langCount)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}
