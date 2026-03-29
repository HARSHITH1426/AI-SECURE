'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummaryInputSchema = z.object({
  threatData: z.array(z.string()).describe('List of security events and threat indicators.'),
});

export type AdminThreatInsightSummaryInput = z.infer<typeof SummaryInputSchema>;

const SummaryOutputSchema = z.object({
  summary: z.string().describe('Concise overview of critical events.'),
  keyThreatsIdentified: z.array(z.string()).describe('Specific threats found.'),
  actionableRecommendations: z.array(z.string()).describe('Recommended steps for the admin.'),
});

export type AdminThreatInsightSummaryOutput = z.infer<typeof SummaryOutputSchema>;

const summaryPrompt = ai.definePrompt({
  name: 'summaryPrompt',
  input: {schema: SummaryInputSchema},
  output: {schema: SummaryOutputSchema},
  prompt: `As a Senior Security Analyst, provide a strategic briefing based on these system logs:

{{#if threatData}}
  {{#each threatData}}
  - LOG: {{{this}}}
  {{/each}}
{{else}}
  No anomalies to report.
{{/if}}

Identify significant risks and give clear, technical recommendations for mitigation.`,
});

const securityInsightFlow = ai.defineFlow(
  {
    name: 'securityInsightFlow',
    inputSchema: SummaryInputSchema,
    outputSchema: SummaryOutputSchema,
  },
  async input => {
    const {output} = await summaryPrompt(input);
    if (!output) throw new Error('Insight generation failed.');
    return output;
  }
);

export async function fetchSecuritySummary(
  input: AdminThreatInsightSummaryInput
): Promise<AdminThreatInsightSummaryOutput> {
  return securityInsightFlow(input);
}