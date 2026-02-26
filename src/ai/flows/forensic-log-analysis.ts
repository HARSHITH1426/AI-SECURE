'use server';
/**
 * @fileOverview A forensic AI analyst for the Immutable Audit Ledger.
 *
 * - analyzeAuditLedger - A function that performs deep forensic analysis on system logs.
 * - ForensicAnalysisInput - The input type containing log entries.
 * - ForensicAnalysisOutput - The return type containing forensic insights.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LogEntrySchema = z.object({
  timestamp: z.string(),
  event: z.string(),
  status: z.string(),
  risk: z.number(),
  blockHash: z.string(),
});

const ForensicAnalysisInputSchema = z.object({
  logs: z.array(LogEntrySchema).describe('The list of audit logs to analyze.'),
});
export type ForensicAnalysisInput = z.infer<typeof ForensicAnalysisInputSchema>;

const ForensicAnalysisOutputSchema = z.object({
  integrityReport: z.string().describe('A report on the cryptographic integrity of the logs.'),
  anomaliesDetected: z.array(z.string()).describe('Specific suspicious patterns found in the sequence of events.'),
  forensicConclusion: z.string().describe('The final expert determination of the system state.'),
  suggestedMitigation: z.string().describe('Immediate actions recommended to maintain vault security.'),
});
export type ForensicAnalysisOutput = z.infer<typeof ForensicAnalysisOutputSchema>;

const forensicPrompt = ai.definePrompt({
  name: 'forensicPrompt',
  input: {schema: ForensicAnalysisInputSchema},
  output: {schema: ForensicAnalysisOutputSchema},
  prompt: `You are a Senior Forensic AI Analyst specializing in immutable blockchain-based audit ledgers for high-security vault systems.

Analyze the following sequence of system logs:

{{#each logs}}
- [{{timestamp}}] EVENT: {{event}} | STATUS: {{status}} | RISK: {{risk}} | HASH: {{blockHash}}
{{/each}}

Your task is to:
1. Verify the logical flow of events and check for "hash-chaining" consistency.
2. Identify any anomalies, such as high-risk events following suspicious auth patterns.
3. Provide a clear forensic conclusion on whether the vault integrity has been compromised.
4. Suggest specific technical mitigations if any risks are detected.

Be precise, technical, and authoritative.`,
});

const forensicAnalysisFlow = ai.defineFlow(
  {
    name: 'forensicAnalysisFlow',
    inputSchema: ForensicAnalysisInputSchema,
    outputSchema: ForensicAnalysisOutputSchema,
  },
  async input => {
    const {output} = await forensicPrompt(input);
    if (!output) {
      throw new Error('Forensic analysis failed to generate.');
    }
    return output;
  }
);

export async function analyzeAuditLedger(input: ForensicAnalysisInput): Promise<ForensicAnalysisOutput> {
  return forensicAnalysisFlow(input);
}
