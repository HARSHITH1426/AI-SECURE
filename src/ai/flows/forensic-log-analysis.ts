'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogSchema = z.object({
  timestamp: z.string(),
  event: z.string(),
  status: z.string(),
  risk: z.number(),
  blockHash: z.string(),
});

const AnalysisInputSchema = z.object({
  logs: z.array(LogSchema).describe('The audit logs for analysis.'),
});

export type ForensicAnalysisInput = z.infer<typeof AnalysisInputSchema>;

const AnalysisOutputSchema = z.object({
  integrityReport: z.string().describe('Log integrity assessment.'),
  anomaliesDetected: z.array(z.string()).describe('Pattern inconsistencies.'),
  forensicConclusion: z.string().describe('Final expert determination.'),
  suggestedMitigation: z.string().describe('Immediate security actions.'),
});

export type ForensicAnalysisOutput = z.infer<typeof AnalysisOutputSchema>;

const analysisPrompt = ai.definePrompt({
  name: 'analysisPrompt',
  input: {schema: AnalysisInputSchema},
  output: {schema: AnalysisOutputSchema},
  prompt: `Perform a deep forensic scan on the following ledger entries:

{{#each logs}}
- [{{timestamp}}] {{event}} | RISK: {{risk}} | HASH: {{blockHash}}
{{/each}}

Verify logical consistency and highlight any suspicious patterns that suggest vault compromise.`,
});

const forensicScanFlow = ai.defineFlow(
  {
    name: 'forensicScanFlow',
    inputSchema: AnalysisInputSchema,
    outputSchema: AnalysisOutputSchema,
  },
  async input => {
    const {output} = await analysisPrompt(input);
    if (!output) throw new Error('Scan failed.');
    return output;
  }
);

export async function processForensicLogs(input: ForensicAnalysisInput): Promise<ForensicAnalysisOutput> {
  return forensicScanFlow(input);
}