export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    name: string;
  } | null;
  owner: {
    login: string;
  };
}

export type JourneyEntry = {
  id: string;
  type: 'Work' | 'Education';
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description?: string;
  isAiGenerated: boolean;
};

export type LanguageData = {
  name: string;
  count: number;
  color: string;
};

export interface Article {
  id: string;
  title: string;
  url: string;
  content: string;
  summary?: string;
}

export interface ExternalProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  projectUrl: string;
}
