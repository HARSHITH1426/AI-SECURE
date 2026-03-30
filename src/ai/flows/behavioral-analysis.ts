
'use server';
/**
 * @fileOverview AI Adaptive Behavioral Analysis Engine.
 *
 * - analyzeBehavior - Detects anomalies in user activity.
 * - BehavioralInput - Session and event data for analysis.
 * - BehavioralOutput - Risk classification and reasoning.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const BehavioralInputSchema = z.object({
  failedAttempts: z.number(),
  isNewIp: z.boolean(),
  isUnusualTime: z.boolean(),
  accessedHoneyfile: z.boolean(),
  downloadSpikes: z.number(),
  recentLogs: z.array(z.string()),
});
export type BehavioralInput = z.infer<typeof BehavioralInputSchema>;

const BehavioralOutputSchema = z.object({
  riskScore: z.number().describe('Calculated risk score from 0-100'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  reasons: z.array(z.string()).describe('List of detected anomalies (XAI)'),
  suggestedAction: z.enum(['NONE', 'READ_ONLY', 'LOGOUT', 'LOCK_ACCOUNT']),
});
export type BehavioralOutput = z.infer<typeof BehavioralOutputSchema>;

const behavioralPrompt = ai.definePrompt({
  name: 'behavioralPrompt',
  input: { schema: BehavioralInputSchema },
  output: { schema: BehavioralOutputSchema },
  prompt: `You are an Adaptive Security Response Engine. Analyze the following behavioral data:

Failed Login Attempts: {{failedAttempts}}
New IP Detected: {{isNewIp}}
Unusual Login Time: {{isUnusualTime}}
Accessed Honey File: {{accessedHoneyfile}}
Download Spikes: {{downloadSpikes}}

Recent Activity Stream:
{{#each recentLogs}}
- {{{this}}}
{{/each}}

Identify if this behavior represents a threat. If a honey file was accessed, riskLevel MUST be HIGH.
Risk Scoring Logic:
- Failed attempts (+15 per)
- New IP (+20)
- Unusual time (+10)
- Honeyfile (+100)
- Download Spikes (+25)

Return the score, level, specific reasons for classification (Explainable AI), and a recommended adaptive response.`,
});

export async function analyzeBehavior(input: BehavioralInput): Promise<BehavioralOutput> {
  const { output } = await behavioralPrompt(input);
  if (!output) throw new Error('Behavioral analysis failed');
  return output;
}
