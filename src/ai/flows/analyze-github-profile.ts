'use server';

/**
 * @fileOverview This file defines a unified Genkit flow for analyzing a user's GitHub profile.
 * It generates a professional summary and extracts career journey information (work experience and education)
 * in a single call to avoid rate-limiting issues.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WorkExperienceSchema = z.object({
  organization: z.string().describe('The name of the company or organization.'),
  role: z.string().describe('The job title or role.'),
  startDate: z.string().describe('The start date in "MMMM yyyy" format.'),
  endDate: z.string().describe('The end date in "MMMM yyyy" format, or "Present" if current.'),
  description: z.string().describe('A brief description of the role and accomplishments.').optional(),
});
export type WorkExperience = z.infer<typeof WorkExperienceSchema>;

const EducationSchema = z.object({
  organization: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree, certificate, or field of study.'),
  startDate: z.string().describe('The start date in "MMMM yyyy" format.'),
  endDate: z.string().describe('The end date or graduation date in "MMMM yyyy" format.'),
  description: z.string().describe('Any notable achievements or details.').optional(),
});
export type Education = z.infer<typeof EducationSchema>;


const AnalyzeGithubProfileInputSchema = z.object({
  username: z.string().describe('The GitHub username of the user.'),
  repositoryData: z.string().describe('A JSON string containing the user repository data from github.'),
  bio: z.string().nullable().describe('The user\'s GitHub bio.'),
  resumeText: z.string().optional().describe('The text content of the user\'s resume.'),
});
export type AnalyzeGithubProfileInput = z.infer<typeof AnalyzeGithubProfileInputSchema>;

const AnalyzeGithubProfileOutputSchema = z.object({
  summary: z.string().describe('A professional summary generated based on the user\'s GitHub contributions and resume.'),
  workExperience: z.array(WorkExperienceSchema).describe('An array of work experience entries.'),
  education: z.array(EducationSchema).describe('An array of education entries.'),
  projectSummaries: z.record(z.string()).describe('A map of repository names to AI-generated summaries, specifically for repos with missing descriptions.'),
});
export type AnalyzeGithubProfileOutput = z.infer<typeof AnalyzeGithubProfileOutputSchema>;

export async function analyzeGithubProfile(input: AnalyzeGithubProfileInput): Promise<AnalyzeGithubProfileOutput> {
  return analyzeGithubProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGithubProfilePrompt',
  input: { schema: AnalyzeGithubProfileInputSchema },
  output: { schema: AnalyzeGithubProfileOutputSchema },
  prompt: `You are an expert AI assistant tasked with analyzing a developer's professional information to create a portfolio.
  
  From the provided GitHub data and optional resume text, you must perform two tasks:
  1.  **Generate a Professional Summary:** Create a concise summary highlighting the developer's key skills, expertise, and notable patterns. If resume text is provided, use it as the primary source and supplement with GitHub data.
  2.  **Extract Career Journey:** Identify work experience and education. If resume text is provided, extract this information *exclusively* from the resume. Otherwise, analyze the GitHub data.
      - Look for company names, job titles, and employment dates.
      - Look for university names, degrees, and attendance dates.
      - Format dates as "MMMM yyyy" (e.g., "August 2021"). For current roles, use "Present" as the end date.
      - Format dates as "MMMM yyyy" (e.g., "August 2021"). For current roles, use "Present" as the end date.
      - If no career data can be found, return empty arrays. Do not invent information.
  3.  **Generate Project Summaries:** For the top repositories listed in the data, if a repository has a missing or very short description, generate a concise, engaging 1-sentence summary based on its name, language, and any available context.
      - Return a map where the key is the repository name and the value is the generated summary.
      - Only include repositories that need a better description.

  Prioritize the resume text for accuracy when it is available.

  GitHub Username: {{{username}}}
  Bio: {{{bio}}}
  Repository Data:
  {{{repositoryData}}}

  {{#if resumeText}}
  Resume Text:
  {{{resumeText}}}
  {{/if}}

  Return the full analysis as a single JSON object with the summary, workExperience, education, and projectSummaries fields.
  `,
});

const analyzeGithubProfileFlow = ai.defineFlow(
  {
    name: 'analyzeGithubProfileFlow',
    inputSchema: AnalyzeGithubProfileInputSchema,
    outputSchema: AnalyzeGithubProfileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
