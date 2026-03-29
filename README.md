# Secure Vault

A secure data management platform for storing and auditing sensitive assets. Built with Next.js, Firebase, and Tailwind CSS.

## Features

- **Encrypted Storage**: Secure file management with multi-layer encryption.
- **Audit Logs**: Real-time logging of all security events and access attempts.
- **Authentication**: Supports both email/password and Google login.
- **Dashboard**: Visual metrics for system health and security status.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Add your `FIREBASE_CONFIG` and `GOOGLE_GENAI_API_KEY` to the `.env` file.

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:9003](http://localhost:9003) to see the application.

## Security

This project implements industry-standard security practices, including secure headers, encrypted data transmission, and granular access controls.
