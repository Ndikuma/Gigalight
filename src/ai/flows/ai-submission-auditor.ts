'use server';
/**
 * @fileOverview A Genkit flow for an AI Submission Auditor tool.
 *
 * - aiSubmissionAuditor - A function that analyzes submitted task proofs against task instructions.
 * - AiSubmissionAuditorInput - The input type for the aiSubmissionAuditor function.
 * - AiSubmissionAuditorOutput - The return type for the aiSubmissionAuditor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiSubmissionAuditorInputSchema = z.object({
  taskInstructions: z
    .string()
    .describe("The detailed instructions provided for the task."),
  proofRequirements: z
    .string()
    .describe(
      "Specific requirements outlining what needs to be shown in the proof."
    ),
  proofImageUri: z
    .string()
    .optional()
    .describe(
      "Optional: A photo proof of the task completion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  proofText: z
    .string()
    .optional()
    .describe("Optional: Text-based proof of the task completion."),
  proofLink: z
    .string()
    .optional()
    .describe("Optional: A URL link as proof of the task completion."),
  proofDescription: z
    .string()
    .optional()
    .describe("Optional: Additional description or context for the submitted proof."),
});
export type AiSubmissionAuditorInput = z.infer<
  typeof AiSubmissionAuditorInputSchema
>;

const AiSubmissionAuditorOutputSchema = z.object({
  suggestedStatus: z
    .enum(['approve', 'reject', 'needs_manual_review'])
    .describe("The AI's suggested approval status for the submission."),
  discrepancies: z
    .array(z.string())
    .describe(
      "A list of specific discrepancies or issues identified in the submitted proof compared to the requirements."
    ),
  rationale: z
    .string()
    .describe(
      "A detailed explanation for the suggested status, referencing the task instructions, proof requirements, and submitted proof."
    ),
});
export type AiSubmissionAuditorOutput = z.infer<
  typeof AiSubmissionAuditorOutputSchema
>;

export async function aiSubmissionAuditor(
  input: AiSubmissionAuditorInput
): Promise<AiSubmissionAuditorOutput> {
  return aiSubmissionAuditorFlow(input);
}

const aiSubmissionAuditorPrompt = ai.definePrompt({
  name: 'aiSubmissionAuditorPrompt',
  input: { schema: AiSubmissionAuditorInputSchema },
  output: { schema: AiSubmissionAuditorOutputSchema },
  prompt: `You are an AI Submission Auditor. Your role is to meticulously analyze submitted proof for a task against the task's instructions and specific proof requirements. Your goal is to identify any discrepancies or areas where the proof does not meet the requirements, and based on your findings, suggest an approval status (approve, reject, or needs_manual_review).

Provide a clear and concise rationale for your suggested status, explicitly mentioning how the proof aligns with or deviates from the provided instructions and requirements. If there are discrepancies, list them.

--- Task Details ---
Task Instructions: {{{taskInstructions}}}
Proof Requirements: {{{proofRequirements}}}

--- Submitted Proof ---
{{#if proofImageUri}}
Photo Proof: {{media url=proofImageUri}}
{{/if}}
{{#if proofText}}
Text Proof: {{{proofText}}}
{{/if}}
{{#if proofLink}}
Link Proof: {{{proofLink}}}
{{/if}}
{{#if proofDescription}}
Additional Proof Description: {{{proofDescription}}}
{{/if}}

--- Your Analysis ---
`,
});

const aiSubmissionAuditorFlow = ai.defineFlow(
  {
    name: 'aiSubmissionAuditorFlow',
    inputSchema: AiSubmissionAuditorInputSchema,
    outputSchema: AiSubmissionAuditorOutputSchema,
  },
  async (input) => {
    const { output } = await aiSubmissionAuditorPrompt(input);
    return output!;
  }
);
