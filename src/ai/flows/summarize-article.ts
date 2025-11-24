'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing a blog post or article.
 * It takes the article content and produces a concise 3-sentence summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizeArticleInputSchema = z.object({
  articleContent: z.string().describe('The full text content of the article to be summarized.'),
});
export type SummarizeArticleInput = z.infer<typeof SummarizeArticleInputSchema>;

const SummarizeArticleOutputSchema = z.object({
  summary: z.string().describe('A concise, 3-sentence summary of the article highlighting the key technical takeaways.'),
});
export type SummarizeArticleOutput = z.infer<typeof SummarizeArticleOutputSchema>;

export async function summarizeArticle(input: SummarizeArticleInput): Promise<SummarizeArticleOutput> {
  return summarizeArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeArticlePrompt',
  input: { schema: SummarizeArticleInputSchema },
  output: { schema: SummarizeArticleOutputSchema },
  prompt: `You are an expert technical writer. Analyze the following article content and generate a concise, 3-sentence summary.
  
  The summary must:
  1.  Be exactly three sentences long.
  2.  Focus on the key technical concepts, conclusions, or takeaways.
  3.  Be easy to understand for a developer audience.

  Article Content:
  {{{articleContent}}}

  Return only the summary.
  `,
});

const summarizeArticleFlow = ai.defineFlow(
  {
    name: 'summarizeArticleFlow',
    inputSchema: SummarizeArticleInputSchema,
    outputSchema: SummarizeArticleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
