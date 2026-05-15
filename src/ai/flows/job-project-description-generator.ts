
'use server';
/**
 * @fileOverview A Genkit flow that generates a comprehensive job/project description,
 * key responsibilities, and specific requirements based on keywords or a brief prompt.
 *
 * - generateJobProjectDescription - A function that handles the job/project description generation process.
 * - JobProjectDescriptionGeneratorInput - The input type for the generateJobProjectDescription function.
 * - JobProjectDescriptionGeneratorOutput - The return type for the generateJobProjectDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JobProjectDescriptionGeneratorInputSchema = z.object({
  prompt: z.string().describe('A brief prompt or keywords for the job/project description.'),
});
export type JobProjectDescriptionGeneratorInput = z.infer<typeof JobProjectDescriptionGeneratorInputSchema>;

const JobProjectDescriptionGeneratorOutputSchema = z.object({
  title: z.string().describe('The generated job or project title.'),
  description: z.string().describe('A comprehensive description of the job or project.'),
  responsibilities: z.array(z.string()).describe('A list of key responsibilities for the role/project.'),
  requirements: z.array(z.string()).describe('A list of specific requirements for the role/project.'),
});
export type JobProjectDescriptionGeneratorOutput = z.infer<typeof JobProjectDescriptionGeneratorOutputSchema>;

export async function generateJobProjectDescription(input: JobProjectDescriptionGeneratorInput): Promise<JobProjectDescriptionGeneratorOutput> {
  return jobProjectDescriptionGeneratorFlow(input);
}

const jobProjectDescriptionPrompt = ai.definePrompt({
  name: 'jobProjectDescriptionPrompt',
  input: {schema: JobProjectDescriptionGeneratorInputSchema},
  output: {schema: JobProjectDescriptionGeneratorOutputSchema},
  prompt: `You are an AI assistant that helps create high-quality job postings and project listings.
Based on the user's prompt, generate a comprehensive job/project title, description, key responsibilities, and specific requirements.

User prompt: {{{prompt}}}`,
});

const jobProjectDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'jobProjectDescriptionGeneratorFlow',
    inputSchema: JobProjectDescriptionGeneratorInputSchema,
    outputSchema: JobProjectDescriptionGeneratorOutputSchema,
  },
  async (input) => {
    const {output} = await jobProjectDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate job/project description.');
    }
    return output;
  }
);
