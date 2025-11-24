'use client';

import type { LanguageData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart as BarChartIcon } from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Moved from lib/github.ts to avoid server-only import issues
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

export function SkillsSection({ languages, isPreviewing }: { languages: LanguageData[], isPreviewing: boolean }) {
  if (languages.length === 0 && isPreviewing) {
    return null;
  }

  const chartData = languages.map(lang => ({
      ...lang,
      color: languageColors[lang.name as keyof typeof languageColors] || languageColors.Default,
  })).slice(0, 7);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <BarChartIcon className="w-6 h-6 text-primary" />
          Top Languages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {languages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                width={80}
                />
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{
                    background: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="var(--color-count)" >
                {chartData.map((entry) => (
                    <Bar key={`cell-${entry.name}`} fill={entry.color} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        ) : (
            <p className="text-muted-foreground text-center py-4">No public repositories with recognizable languages found.</p>
        )}
      </CardContent>
    </Card>
  );
}
