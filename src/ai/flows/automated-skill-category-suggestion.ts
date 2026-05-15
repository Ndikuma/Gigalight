'use server';
/**
 * @fileOverview This flow suggests relevant skills and categories based on provided text.
 *
 * - suggestSkillsAndCategories - A function that handles the suggestion process.
 * - SuggestSkillsAndCategoriesInput - The input type for the suggestSkillsAndCategories function.
 * - SuggestSkillsAndCategoriesOutput - The return type for the suggestSkillsAndCategories function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestSkillsAndCategoriesInputSchema = z.object({
  text: z
    .string()
    .describe('The text content (e.g., job description, project description, or user profile bio) from which to extract skills and categories.'),
});
export type SuggestSkillsAndCategoriesInput = z.infer<typeof SuggestSkillsAndCategoriesInputSchema>;

const SuggestSkillsAndCategoriesOutputSchema = z.object({
  suggestedSkills: z.array(z.string()).describe('An array of relevant skills extracted from the text.').default([]),
  suggestedCategories: z.array(z.string()).describe('An array of relevant categories extracted from the text.').default([]),
});
export type SuggestSkillsAndCategoriesOutput = z.infer<typeof SuggestSkillsAndCategoriesOutputSchema>;

export async function suggestSkillsAndCategories(input: SuggestSkillsAndCategoriesInput): Promise<SuggestSkillsAndCategoriesOutput> {
  return automatedSkillCategorySuggestionFlow(input);
}

const automatedSkillCategorySuggestionPrompt = ai.definePrompt({
  name: 'automatedSkillCategorySuggestionPrompt',
  input: { schema: SuggestSkillsAndCategoriesInputSchema },
  output: { schema: SuggestSkillsAndCategoriesOutputSchema },
  prompt: `You are an AI assistant specialized in identifying relevant skills and job/project categories from descriptive text.
Your goal is to extract distinct and pertinent skills and categories that would help in classifying jobs, projects, or user profiles.

Instructions:
- Analyze the provided text carefully.
- Identify and list all relevant technical and soft skills.
- Identify and list relevant high-level job or project categories.
- Ensure the suggested skills and categories are concise and distinct.
- Return the results in a JSON object with two fields: 'suggestedSkills' (an array of strings) and 'suggestedCategories' (an array of strings).

Text: """{{{text}}}"""
`,
});

const automatedSkillCategorySuggestionFlow = ai.defineFlow(
  {
    name: 'automatedSkillCategorySuggestionFlow',
    inputSchema: SuggestSkillsAndCategoriesInputSchema,
    outputSchema: SuggestSkillsAndCategoriesOutputSchema,
  },
  async (input) => {
    const { output } = await automatedSkillCategorySuggestionPrompt(input);
    return output!;
  },
);
