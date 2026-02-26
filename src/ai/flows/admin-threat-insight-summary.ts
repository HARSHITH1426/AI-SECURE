'use server';
/**
 * @fileOverview This file implements a Genkit flow for summarizing security threats and anomalies for administrators.
 *
 * - adminThreatInsightSummary - A function that provides concise, actionable summaries of detected security threats.
 * - AdminThreatInsightSummaryInput - The input type for the adminThreatInsightSummary function.
 * - AdminThreatInsightSummaryOutput - The return type for the adminThreatInsightSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Defines the input schema for the AdminThreatInsightSummary flow.
 * It expects an array of strings, where each string represents a raw security event or threat indicator.
 */
const AdminThreatInsightSummaryInputSchema = z.object({
  threatData: z
    .array(z.string())
    .describe(
      'A list of raw security events, anomalies, and potential insider threat indicators from the AI Threat Intelligence Layer.'
    ),
});
export type AdminThreatInsightSummaryInput = z.infer<
  typeof AdminThreatInsightSummaryInputSchema
>;

/**
 * Defines the output schema for the AdminThreatInsightSummary flow.
 * It provides a concise summary, key threats identified, and actionable recommendations.
 */
const AdminThreatInsightSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise overview of the most critical security events and anomalies detected.'
    ),
  keyThreatsIdentified: z
    .array(z.string())
    .describe('A list of specific threats or vulnerabilities identified from the data.'),
  actionableRecommendations: z
    .array(z.string())
    .describe('Specific steps the administrator should take to address the identified risks.'),
});
export type AdminThreatInsightSummaryOutput = z.infer<
  typeof AdminThreatInsightSummaryOutputSchema
>;

/**
 * Defines the Genkit prompt for generating an administrator-focused security threat summary.
 * It instructs the LLM to act as an expert cybersecurity analyst.
 */
const adminThreatInsightSummaryPrompt = ai.definePrompt({
  name: 'adminThreatInsightSummaryPrompt',
  input: {schema: AdminThreatInsightSummaryInputSchema},
  output: {schema: AdminThreatInsightSummaryOutputSchema},
  prompt: `You are an expert cybersecurity analyst providing critical intelligence to an administrator.
Your goal is to synthesize the provided raw security threat data into a concise, actionable summary.
Identify the most significant threats and provide clear, practical recommendations.

Here is the raw security threat data from the AI Threat Intelligence Layer:

{{#if threatData}}
  {{#each threatData}}
    - Event: {{{this}}}
  {{/each}}
{{else}}
  No specific threat data was provided. Please indicate if there are no significant security concerns to report.
{{/if}}

Based on this data, provide:
1. A concise overview highlighting the most critical security events and anomalies.
2. A list of specific threats or vulnerabilities identified.
3. A list of actionable recommendations for the administrator to address these risks.

Ensure the output is professional, easy to understand, and directly aids in decision-making.`,
});

/**
 * Defines the Genkit flow for processing security threat data and generating an actionable summary.
 * This flow utilizes the 'adminThreatInsightSummaryPrompt' to interact with the LLM.
 */
const adminThreatInsightSummaryFlow = ai.defineFlow(
  {
    name: 'adminThreatInsightSummaryFlow',
    inputSchema: AdminThreatInsightSummaryInputSchema,
    outputSchema: AdminThreatInsightSummaryOutputSchema,
  },
  async input => {
    const {output} = await adminThreatInsightSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate threat insight summary.');
    }
    return output;
  }
);

/**
 * Wrapper function to execute the adminThreatInsightSummaryFlow.
 * This function can be called directly from Next.js React components.
 * @param input The security threat data to be summarized.
 * @returns A promise that resolves to the actionable security threat summary.
 */
export async function adminThreatInsightSummary(
  input: AdminThreatInsightSummaryInput
): Promise<AdminThreatInsightSummaryOutput> {
  return adminThreatInsightSummaryFlow(input);
}
