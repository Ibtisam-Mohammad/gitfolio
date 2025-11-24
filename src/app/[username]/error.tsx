'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-15rem)] text-center p-4">
      <AlertTriangle className="w-20 h-20 text-destructive mb-6" />
      <h2 className="text-4xl font-bold font-headline mb-2">Something Went Wrong</h2>
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        {error.message || "An unexpected error occurred while generating the portfolio."}
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
