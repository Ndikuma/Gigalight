'use server';
/**
 * @fileOverview A Genkit flow for generating high-conversion social media promotional content.
 *
 * - generateSocialPromotion - A function that handles the AI copy generation.
 * - SocialPromotionInput - The input type for the function.
 * - SocialPromotionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SocialPromotionInputSchema = z.object({
  type: z.enum(['task', 'project', 'service']).describe("The type of asset being promoted."),
  title: z.string().describe("The title of the asset."),
  description: z.string().describe("The detailed description or scope."),
  reward: z.string().optional().describe("The SAT yield or budget."),
  skills: z.array(z.string()).optional().describe("Key technical skills involved."),
  url: z.string().describe("The public protocol URL for the asset."),
});
export type SocialPromotionInput = z.infer<typeof SocialPromotionInputSchema>;

const SocialPromotionOutputSchema = z.object({
  twitter: z.string().describe("Short, punchy, high-engagement copy for X/Twitter."),
  linkedin: z.string().describe("Professional, value-driven copy for LinkedIn."),
  threadHook: z.string().describe("A compelling opening 'hook' for a technical thread."),
  hashtags: z.array(z.string()).describe("A list of relevant industry hashtags."),
});
export type SocialPromotionOutput = z.infer<typeof SocialPromotionOutputSchema>;

export async function generateSocialPromotion(input: SocialPromotionInput): Promise<SocialPromotionOutput> {
  return socialPromotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialPromotionPrompt',
  input: { schema: SocialPromotionInputSchema },
  output: { schema: SocialPromotionOutputSchema },
  prompt: `You are an expert Social Media Strategist specializing in the Bitcoin L2 and decentralized workforce economy.
Your goal is to generate high-conversion, professional, and enthusiastic promotional copy for a node operator on the GigaLight protocol.

The asset being promoted is a {{{type}}}: "{{{title}}}".

Parameters:
Description: {{{description}}}
{{#if reward}}Reward/Budget: {{{reward}}}{{/if}}
{{#if skills}}Expertise: {{#each skills}}{{{this}}}, {{/each}}{{/if}}
URL: {{{url}}}

Instructions:
- Use a tone that is tech-forward, professional, and slightly futuristic.
- For Twitter: Focus on the "Satoshi Standard," L2 speed, and immediate yield. Use emojis strategically (e.g., ⚡, ₿, 🚀).
- For LinkedIn: Focus on professional growth, strategic milestones, and technical excellence.
- For Thread Hook: Create a compelling reason for someone to "click to see more."
- Do not use generic corporate jargon. Use industry-specific terms like "L2 Rails," "Node Integrity," "SAT Yield," and "Multi-sig Settlement."

Return the output in a JSON object with 'twitter', 'linkedin', 'threadHook', and 'hashtags' fields.`,
});

const socialPromotionFlow = ai.defineFlow(
  {
    name: 'socialPromotionFlow',
    inputSchema: SocialPromotionInputSchema,
    outputSchema: SocialPromotionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error("AI failed to propagate social signals.");
    return output;
  }
);
