'use client';

import { analyzeBehavior, type BehavioralOutput } from '@/ai/flows/behavioral-analysis';
import { doc, setDoc, collection, addDoc, getFirestore } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

/**
 * Calculates real-time session risk and applies adaptive security policies.
 */
export async function evaluateSessionRisk(params: {
  failedAttempts: number;
  isNewIp: boolean;
  isUnusualTime: boolean;
  accessedHoneyfile: boolean;
  downloadSpikes: number;
  recentLogs: string[];
}) {
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) return;

  const analysis = await analyzeBehavior(params);

  // 1. Log the security event
  addDoc(collection(db, 'securityLogs'), {
    userId: user.uid,
    action: 'BEHAVIORAL_EVALUATION',
    timestamp: new Date().toISOString(),
    riskScore: analysis.riskScore,
    riskLevel: analysis.riskLevel,
    reasons: analysis.reasons,
    ipAddress: 'detected_via_proxy',
  });

  // 2. Update user adaptive state (using setDoc with merge to ensure doc creation)
  setDoc(doc(db, 'users', user.uid), {
    currentRiskLevel: analysis.riskLevel,
    isLocked: analysis.suggestedAction === 'LOCK_ACCOUNT',
    lastUpdated: new Date().toISOString(),
  }, { merge: true });

  // 3. Trigger Adaptive Actions
  if (analysis.suggestedAction === 'LOGOUT' || analysis.suggestedAction === 'LOCK_ACCOUNT') {
    signOut(auth);
    window.location.href = '/login?reason=' + analysis.riskLevel;
  }

  return analysis;
}

export function calculateLocalRiskScore(data: {
  failedAttempts: number;
  newIp: boolean;
  unusualTime: boolean;
  downloadSpikes: number;
}) {
  return (
    data.failedAttempts * 2 +
    (data.newIp ? 3 : 0) +
    (data.unusualTime ? 2 : 0) +
    data.downloadSpikes * 4
  );
}
