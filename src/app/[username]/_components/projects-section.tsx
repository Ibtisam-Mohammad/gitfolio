import type { GitHubRepo } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { GitFork, Star, FolderGit2 } from 'lucide-react';

const languageColors: { [lang: string]: string } = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
  Ruby: '#701516',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Lua: '#000080',
  Default: '#cccccc',
};


function ProjectCard({ repo, aiSummary }: { repo: GitHubRepo; aiSummary?: string }) {
  const langColor = repo.language ? languageColors[repo.language] || languageColors.Default : languageColors.Default;

  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block h-full group">
      <Card className="flex flex-col h-full hover:border-primary/80 transition-all duration-300 bg-card/50 hover:bg-card hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_#000]">
        <CardHeader>
          <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{repo.name}</CardTitle>
          <CardDescription className="flex-grow pt-2 min-h-[3rem]">
            {repo.description || aiSummary || 'No description provided.'}
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" title={`${repo.stargazers_count} stars`}>
              <Star className="w-4 h-4" />
              {repo.stargazers_count}
            </div>
            <div className="flex items-center gap-1" title={`${repo.forks_count} forks`}>
              <GitFork className="w-4 h-4" />
              {repo.forks_count}
            </div>
          </div>
          {repo.language && (
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: langColor }} />
              {repo.language}
            </div>
          )}
        </CardFooter>
      </Card>
    </a>
  );
}

export function ProjectsSection({ repos, projectSummaries }: { repos: GitHubRepo[]; projectSummaries?: Record<string, string> }) {
  const sortedRepos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  if (sortedRepos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <FolderGit2 className="w-6 h-6 text-primary" />
            Top Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No public repositories found for this user.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FolderGit2 className="w-7 h-7 text-primary" />
        <h2 className="text-3xl font-bold font-headline">Top Projects</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedRepos.map(repo => (
          <ProjectCard
            key={repo.id}
            repo={repo}
            aiSummary={projectSummaries?.[repo.name]}
          />
        ))}
      </div>
    </div>
  );
}
