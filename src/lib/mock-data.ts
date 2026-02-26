export const mockThreats = [
  "Unusual typing speed detected (Behavioral Monitoring)",
  "Multiple login attempts from geographically disparate locations within 5 minutes (Anomaly Detection)",
  "Access request for high-privilege administrative panel from standard user account (Privilege Escalation)",
  "Bulk download of encrypted sensitive assets initiated during non-working hours (Insider Threat)",
  "Session hijacked attempt detected; browser fingerprint mismatch (Session Activity Tracker)",
  "Dynamic entropy shift: Contextual risk increased due to untrusted network node (Trust-Entropy Engine)",
  "ML Retraining Triggered: New behavioral pattern identified and incorporated into core model."
];

export const mockLogs = [
  { id: "1", timestamp: "2024-05-20T10:30:15Z", event: "User Authentication", status: "Success", risk: 0.12, blockHash: "0x8f2a...3e12" },
  { id: "2", timestamp: "2024-05-20T10:45:22Z", event: "File Upload: research_patent_v2.pdf", status: "Encrypted", risk: 0.05, blockHash: "0xa1b2...c3d4" },
  { id: "3", timestamp: "2024-05-20T11:12:05Z", event: "Threat Detection: Anomaly", status: "Mitigated", risk: 0.85, blockHash: "0x5c9d...e2f1" },
  { id: "4", timestamp: "2024-05-20T11:12:06Z", event: "Autonomous Action: MFA Triggered", status: "Pending", risk: 0.85, blockHash: "0x3b8a...1c2d" },
  { id: "5", timestamp: "2024-05-20T12:00:00Z", event: "Key Rotation Cycle", status: "Complete", risk: 0.02, blockHash: "0x7e4f...9a8b" },
];

export const mockVaultFiles = [
  { id: "v1", name: "Strategic_Plan_2025.enc", category: "Corporate", size: "2.4 MB", date: "2024-05-15", securityLevel: "Critical" },
  { id: "v2", name: "User_Credentials_Backup.aes", category: "Access", size: "156 KB", date: "2024-05-18", securityLevel: "High" },
  { id: "v3", name: "Research_Findings_Neural_Crypt.pdf", category: "Scientific", size: "18.1 MB", date: "2024-05-19", securityLevel: "Moderate" },
  { id: "v4", name: "Biometric_Signatures_Database.dat", category: "Identity", size: "450 MB", date: "2024-05-20", securityLevel: "Critical" },
];

export const currentSystemStats = {
  trustScore: 88,
  entropyLevel: 4.2,
  activeThreats: 2,
  encryptionStandard: "AES-256-GCM",
  keyRotationInterval: "12 Hours",
};
