# FitTrack - Personal Fitness Tracker

FitTrack is a modern web application built with React, Vite, and Tailwind CSS, integrated with Firebase for authentication and data storage. It allows users to track their workouts, visualize their progress, and export their data.

## Features

- **Dashboard**: High-level overview of workout stats and progress.
- **Activity Log**: Add, view, and manage your workout activities.
- **Data Export**: Export your workout history as a JSON file.
- **Authentication**: Secure user login/signup.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React (Icons), Recharts.
- **State Management**: Redux Toolkit.
- **Backend**: Firebase (Authentication & Firestore).

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- A Firebase project set up.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd fittrack
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```

## How to push to GitHub

If you want to upload this project to your own GitHub repository, follow these steps:

1. **Create a new repository** on [GitHub](https://github.com/new). Do not initialize it with a README or License.
2. **Open your terminal** in the project root directory.
3. **Initialize Git** (if not already done):
   ```bash
   git init
   ```
4. **Add all files**:
   ```bash
   git add .
   ```
5. **Commit your changes**:
   ```bash
   git commit -m "Initial commit"
   ```
6. **Rename the main branch** (optional, usually `main`):
   ```bash
   git branch -M main
   ```
7. **Add the remote repository**:
   *Replace `<URL>` with your repository's URL.*
   ```bash
   git remote add origin <URL>
   ```
8. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```