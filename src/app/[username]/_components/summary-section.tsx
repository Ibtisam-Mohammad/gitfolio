'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SummarySectionProps {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  isPreviewing: boolean;
}

export function SummarySection({ summary, isLoading, error, isPreviewing }: SummarySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="font-headline">AI Professional Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}
        {error && !isLoading && (
           <Alert variant="destructive">
            <AlertTitle>AI Summary Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && summary && (
          <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
        )}
        {!isLoading && !error && !summary && !isPreviewing && (
          <p className="text-muted-foreground text-center py-4">AI summary could not be generated.</p>
        )}
      </CardContent>
    </Card>
  );
}
