'use client';

import { GitHubUser, GitHubRepo, JourneyEntry, LanguageData } from '@/lib/types';
import { HeroSection } from '../hero-section';
import { SkillsSection } from '../skills-section';
import { ProjectsSection } from '../projects-section';
import { SummarySection } from '../summary-section';
import { ContributionGraph } from '../contribution-graph';
import { ResumeSection } from '../resume-section';
import { CareerJourneySection } from '../career-journey-section';
import { ArticlesSection } from '../articles-section';
import { ExternalProjectsSection } from '../external-projects-section';
import { ToolsSkillsSection } from '../tools-skills-section';
import { cn } from '@/lib/utils';
import { AnalyzeGithubProfileOutput } from '@/ai/flows/analyze-github-profile';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface LayoutProps {
    user: GitHubUser;
    repos: GitHubRepo[];
    languageData: LanguageData[];
    reposJson: string;
    username: string;
    aiData: AnalyzeGithubProfileOutput | null;
    isLoading: boolean;
    error: string | null;
    isPreview: boolean;
    onEnhance: () => void;
    allCareerEntries: JourneyEntry[];
    onEntriesChange: (entries: JourneyEntry[]) => void;
    showSummary: boolean;
    showProjects: boolean;
    showCareerJourney: boolean;
    showSkills: boolean;
    views: number | null;
}

export function SingleColumnLayout({
    user,
    repos,
    languageData,
    reposJson,
    username,
    aiData,
    isLoading,
    error,
    isPreview,
    onEnhance,
    allCareerEntries,
    onEntriesChange,
    showSummary,
    showProjects,
    showCareerJourney,
    showSkills,
    views,
}: LayoutProps) {
    return (
        <div className="max-w-3xl mx-auto space-y-16 p-8">
            <HeroSection user={user} views={views} />

            {error && !isLoading && (
                <Alert variant="destructive">
                    <AlertTitle>AI Analysis Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-16">
                {showSummary && (
                    <SummarySection
                        summary={aiData?.summary ?? null}
                        isLoading={isLoading}
                        error={error}
                        isPreviewing={isPreview}
                    />
                )}

                {showSkills && <SkillsSection languages={languageData} isPreviewing={isPreview} />}

                <ToolsSkillsSection
                    isPreviewing={isPreview}
                    generationData={{
                        repositoryData: reposJson,
                        summary: aiData?.summary ?? '',
                        careerJourney: JSON.stringify(allCareerEntries.filter((e) => e.isAiGenerated)),
                    }}
                />

                {showProjects && <ProjectsSection repos={repos} projectSummaries={aiData?.projectSummaries} />}

                <ExternalProjectsSection isPreviewing={isPreview} />

                {showCareerJourney && (
                    <CareerJourneySection
                        initialEntries={allCareerEntries}
                        onEntriesChange={onEntriesChange}
                        isPreviewing={isPreview}
                    />
                )}

                <ArticlesSection isPreviewing={isPreview} />

                <ContributionGraph username={user.login} />

                <ResumeSection
                    username={user.login}
                    isPreviewing={isPreview}
                    onEnhance={onEnhance}
                    isEnhancing={isLoading}
                />
            </div>
        </div>
    );
}
