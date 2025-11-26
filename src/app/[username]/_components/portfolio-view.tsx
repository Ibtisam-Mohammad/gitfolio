'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GitHubUser, GitHubRepo, JourneyEntry } from '@/lib/types';
import type { LanguageData } from '@/lib/types';
import { FloatingActionButtons } from './floating-action-buttons';
import { analyzeGithubProfile, AnalyzeGithubProfileOutput } from '@/ai/flows/analyze-github-profile';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/theme-provider';
import { useVisitorCounter } from '@/hooks/use-visitor-counter';
import { StandardLayout } from './layouts/standard-layout';
import { SidebarLayout } from './layouts/sidebar-layout';
import { SingleColumnLayout } from './layouts/single-column-layout';

interface PortfolioViewProps {
  user: GitHubUser;
  repos: GitHubRepo[];
  languageData: LanguageData[];
  reposJson: string;
  username: string;
}

function PortfolioViewContent({
  user,
  repos,
  languageData,
  reposJson,
  username,
}: PortfolioViewProps) {
  const searchParams = useSearchParams();
  const isPreviewFromUrl = searchParams.get('preview') === 'true';
  const { currentTheme } = useTheme();

  const [isPreview, setIsPreview] = useState(isPreviewFromUrl);
  const [aiData, setAiData] = useState<AnalyzeGithubProfileOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualEntries, setManualEntries] = useState<JourneyEntry[]>([]);
  const { toast } = useToast();

  const getAiAnalysis = async (resumeText?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeGithubProfile({
        username: user.login,
        repositoryData: reposJson,
        bio: user.bio,
        resumeText,
      });
      setAiData(result);
      if (resumeText) {
        toast({
          title: "Portfolio Enhanced!",
          description: "The AI summary and career journey have been updated with your resume data."
        })
      }
    } catch (e: any) {
      console.error('Failed to analyze GitHub profile:', e);
      if (e.message?.includes('503')) {
        setError('The AI service is temporarily overloaded. Please try again in a few moments.');
      } else {
        setError('Could not generate AI analysis. This might be a temporary issue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getAiAnalysis();
    }
    return () => {
      isMounted = false;
    };
  }, [user.login, user.bio, reposJson]);

  const allCareerEntries = [
    ...(aiData?.workExperience.map((item, index) => ({
      id: `ai-work-${index}`,
      type: 'Work' as const,
      organization: item.organization,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      isAiGenerated: true,
    })) || []),
    ...(aiData?.education.map((item, index) => ({
      id: `ai-edu-${index}`,
      type: 'Education' as const,
      organization: item.organization,
      role: item.degree,
      startDate: item.startDate,
      endDate: item.endDate,
      description: item.description,
      isAiGenerated: true,
    })) || []),
    ...manualEntries,
  ];

  const handleEntriesChange = (entries: JourneyEntry[]) => {
    setManualEntries(entries.filter(e => !e.isAiGenerated));
  };

  // Visitor Analytics
  const views = useVisitorCounter(username);

  if (isLoading && !aiData && !error) {
    return <LoadingSkeleton />;
  }

  const LayoutComponent = {
    'standard': StandardLayout,
    'sidebar': SidebarLayout,
    'single-column': SingleColumnLayout,
  }[currentTheme.layout] || StandardLayout;

  return (
    <>
      <LayoutComponent
        user={user}
        repos={repos}
        languageData={languageData}
        reposJson={reposJson}
        username={username}
        isPreview={isPreview}
        aiData={aiData}
        isLoading={isLoading}
        error={error}
        manualEntries={manualEntries}
        onEntriesChange={handleEntriesChange}
        onEnhance={getAiAnalysis}
        allCareerEntries={allCareerEntries}
        views={views}
        showProjects={true}
        showSummary={true}
        showCareerJourney={true}
        showSkills={true}
      />

      <FloatingActionButtons
        username={username}
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
      />
    </>
  );
}


export function PortfolioView(props: PortfolioViewProps) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PortfolioViewContent {...props} />
    </Suspense>
  )
}


function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-pulse">
      {/* Simplified loading state */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <Skeleton className="h-32 w-32" />
        <div className="space-y-3 flex-grow">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
        <div className="lg:col-span-1 space-y-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}
