export const mockThreats = [
  "New login from unrecognized browser",
  "Incorrect password attempt for admin account",
  "Unauthorized access attempt to sensitive file",
  "Bulk data export initiated",
  "Session timeout after 30 minutes of inactivity",
  "Security patch updated to version 4.0.2",
  "Identity verification required for large file download"
];

export const mockLogs = [
  { id: "1", timestamp: "2024-05-20T10:30:15Z", event: "User Login", status: "Success", risk: 0.05, blockHash: "0x8f2a...3e12" },
  { id: "2", timestamp: "2024-05-20T10:45:22Z", event: "File Uploaded: report_v1.pdf", status: "Encrypted", risk: 0.01, blockHash: "0xa1b2...c3d4" },
  { id: "3", timestamp: "2024-05-20T11:12:05Z", event: "Failed Login Attempt", status: "Blocked", risk: 0.75, blockHash: "0x5c9d...e2f1" },
  { id: "4", timestamp: "2024-05-20T11:12:06Z", event: "MFA Requested", status: "Sent", risk: 0.10, blockHash: "0x3b8a...1c2d" },
  { id: "5", timestamp: "2024-05-20T12:00:00Z", event: "System Backup", status: "Complete", risk: 0.00, blockHash: "0x7e4f...9a8b" },
];

export const mockVaultFiles = [
  { id: "v1", name: "Project_Plan_2025.pdf", category: "Documents", size: "2.4 MB", date: "2024-05-15", securityLevel: "High" },
  { id: "v2", name: "Backup_Keys.txt", category: "Security", size: "1 KB", date: "2024-05-18", securityLevel: "Critical" },
  { id: "v3", name: "Research_Notes.docx", category: "Notes", size: "45 KB", date: "2024-05-19", securityLevel: "Moderate" },
  { id: "v4", name: "User_Database_Backup.sql", category: "Database", size: "450 MB", date: "2024-05-20", securityLevel: "Critical" },
];

export const currentSystemStats = {
  trustScore: 98,
  entropyLevel: 1.2,
  activeThreats: 0,
  encryptionStandard: "AES-256-GCM",
  keyRotationInterval: "24 Hours",
};
