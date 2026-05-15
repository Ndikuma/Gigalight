'use server';
/**
 * @fileOverview An AI assistant flow for drafting personalized cover letters or project proposals.
 *
 * - draftApplicationProposal - A function that handles the generation of application proposals.
 * - ApplicationProposalInput - The input type for the draftApplicationProposal function.
 * - ApplicationProposalOutput - The return type for the draftApplicationProposal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ApplicationProposalInputSchema = z.object({
  userProfile: z.object({
    title: z.string().describe("The applicant's professional title or role."),
    bio: z.string().describe("A brief biography or summary of the applicant's experience."),
    skills: z.array(z.string()).describe("A list of the applicant's key skills."),
    hourlyRate: z.number().optional().describe("The applicant's desired hourly rate in SATs (optional)."),
    completedProjects: z.number().describe("The number of projects the applicant has completed."),
    totalEarned: z.number().describe("The total amount earned by the applicant in SATs."),
    githubUrl: z.string().url().optional().describe("URL to the applicant's GitHub profile (optional)."),
    linkedinUrl: z.string().url().optional().describe("URL to the applicant's LinkedIn profile (optional)."),
    websiteUrl: z.string().url().optional().describe("URL to the applicant's personal website (optional)."),
    portfolioUrl: z.string().url().optional().describe("URL to the applicant's portfolio (optional)."),
  }).describe("Details about the applicant's profile."),
  opportunity: z.object({
    type: z.enum(['job', 'project']).describe("The type of opportunity: 'job' or 'project'."),
    title: z.string().describe("The title of the job or project."),
    description: z.string().describe("A detailed description of the job or project."),
    requirements: z.string().describe("Key requirements or qualifications for the opportunity."),
    skills: z.array(z.string()).describe("A list of skills required for the opportunity."),
    companyName: z.string().optional().describe("The name of the company offering the job (optional)."),
    budgetMin: z.number().optional().describe("The minimum budget or salary for the opportunity in SATs (optional)."),
    budgetMax: z.number().optional().describe("The maximum budget or salary for the opportunity in SATs (optional)."),
    experienceLevel: z.string().describe("The required experience level for the opportunity (e.g., 'Entry Level', 'Intermediate', 'Senior')."),
    deadline: z.string().optional().describe("The application or bid deadline as a date string (optional)."),
  }).describe("Details about the job or project opportunity."),
});
export type ApplicationProposalInput = z.infer<typeof ApplicationProposalInputSchema>;

const ApplicationProposalOutputSchema = z.object({
  proposalText: z.string().describe("The drafted cover letter or project proposal."),
  keyHighlights: z.array(z.string()).describe("3-5 bullet points summarizing why the applicant is a good fit."),
});
export type ApplicationProposalOutput = z.infer<typeof ApplicationProposalOutputSchema>;

export async function draftApplicationProposal(input: ApplicationProposalInput): Promise<ApplicationProposalOutput> {
  return applicationProposalAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'applicationProposalPrompt',
  input: { schema: ApplicationProposalInputSchema },
  output: { schema: ApplicationProposalOutputSchema },
  prompt: `You are an AI assistant specialized in drafting compelling cover letters and project proposals.
Your goal is to help a worker/freelancer create a personalized proposal for a job or project opportunity.
You will be provided with the applicant's profile and the details of the opportunity.
Craft a professional and persuasive proposal that highlights how the applicant's skills, experience, and accomplishments directly align with the requirements and description of the opportunity.
Make sure the tone is confident and enthusiastic.

Applicant Profile:
Title: {{{userProfile.title}}}
Bio: {{{userProfile.bio}}}
Skills: {{#each userProfile.skills}}- {{this}}
{{/each}}
{{#if userProfile.hourlyRate}}Hourly Rate: {{userProfile.hourlyRate}} SAT/hour
{{/if}}
Completed Projects: {{userProfile.completedProjects}}
Total Earned: {{userProfile.totalEarned}} SAT
{{#if userProfile.githubUrl}}GitHub: {{userProfile.githubUrl}}
{{/if}}
{{#if userProfile.linkedinUrl}}LinkedIn: {{userProfile.linkedinUrl}}
{{/if}}
{{#if userProfile.websiteUrl}}Website: {{userProfile.websiteUrl}}
{{/if}}
{{#if userProfile.portfolioUrl}}Portfolio: {{userProfile.portfolioUrl}}
{{/if}}

Opportunity Details:
Type: {{{opportunity.type}}}
Title: {{{opportunity.title}}}
Description: {{{opportunity.description}}}
Requirements: {{{opportunity.requirements}}}
Skills Required: {{#each opportunity.skills}}- {{this}}
{{/each}}
{{#if opportunity.companyName}}Company: {{opportunity.companyName}}
{{/if}}
{{#if opportunity.budgetMin}}Budget/Salary Range: {{opportunity.budgetMin}} - {{opportunity.budgetMax}} SAT
{{/if}}
Experience Level: {{{opportunity.experienceLevel}}}
{{#if opportunity.deadline}}Deadline: {{opportunity.deadline}}
{{/if}}

Based on the above information, generate a personalized cover letter or project proposal.
Focus on demonstrating value and a strong fit for the role/project.
After the main proposal, provide 3-5 key highlights in bullet points summarizing why the applicant is an excellent candidate.`,
});

const applicationProposalAssistantFlow = ai.defineFlow(
  {
    name: 'applicationProposalAssistantFlow',
    inputSchema: ApplicationProposalInputSchema,
    outputSchema: ApplicationProposalOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
