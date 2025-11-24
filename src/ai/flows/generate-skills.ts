'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a list of skills from a developer's portfolio data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateSkillsInputSchema = z.object({
  repositoryData: z.string().describe('A JSON string containing the user repository data from GitHub.'),
  summary: z.string().nullable().describe('The AI-generated professional summary.'),
  careerJourney: z.string().describe('A JSON string of the user\'s work and education history.'),
});
export type GenerateSkillsInput = z.infer<typeof GenerateSkillsInputSchema>;

const GenerateSkillsOutputSchema = z.object({
  skills: z.array(z.string()).describe('An array of suggested skills, including technical tools, libraries, frameworks, methodologies, and soft skills.'),
});
export type GenerateSkillsOutput = z.infer<typeof GenerateSkillsOutputSchema>;

export async function generateSkills(input: GenerateSkillsInput): Promise<GenerateSkillsOutput> {
  return generateSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSkillsPrompt',
  input: { schema: GenerateSkillsInputSchema },
  output: { schema: GenerateSkillsOutputSchema },
  prompt: `You are an expert career coach and tech recruiter. Analyze the following developer portfolio information: GitHub repositories, a professional summary, and career history.
  
  Based on this data, identify and extract a list of relevant skills. The list should include:
  - Technical Skills: Programming languages, frameworks, libraries, databases, cloud services, and other tools.
  - Methodologies: Agile, Scrum, DevOps, TDD, etc.
  - Soft Skills: Leadership, communication, project management, teamwork, etc.

  Do not include skills that are just programming languages (e.g., 'TypeScript', 'Python'), as those are displayed separately. Focus on frameworks, tools, and other professional skills.

  Return a unique list of skills. Do not return more than 15 skills.

  Repository Data:
  {{{repositoryData}}}

  Professional Summary:
  {{{summary}}}

  Career Journey:
  {{{careerJourney}}}

  Return the skills as a JSON object with a "skills" array.
  `,
});

const generateSkillsFlow = ai.defineFlow(
  {
    name: 'generateSkillsFlow',
    inputSchema: GenerateSkillsInputSchema,
    outputSchema: GenerateSkillsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
