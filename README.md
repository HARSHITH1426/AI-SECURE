# FitTrack - Personal Fitness Tracker

FitTrack is a modern web application built with React, Vite, and Tailwind CSS, integrated with Firebase for authentication and data storage. It allows users to track their workouts, visualize their progress, and manage their fitness goals.

## 🚀 Features

- **Dashboard**: High-level overview of workout stats, recent activities, and progress charts.
- **Activity Log**: View, add, edit, and delete your workouts.
- **Charts & Insights**: Visual representation of your fitness data over time.
- **Export Data**: Download your activity history as a JSON file.
- **Authentication**: Secure login/signup using Firebase Auth.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React (Icons), Recharts.
- **State Management**: Redux Toolkit.
- **Backend/Database**: Firebase (Authentication & Firestore).
- **Build Tool**: Vite.

## 📦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Firebase account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/fittrack.git
   cd fittrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase:**
   - Create a project in the [Firebase Console](https://console.firebase.google.com/).
   - Add a web app to your project.
   - Copy your Firebase config object.
   - Create a `.env` file in the root directory and add your credentials:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Run the app:**
   ```bash
   npm run dev
   ```

## 📤 How to Upload to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   ```

2. **Add files to staging:**
   ```bash
   git add .
   ```

3. **Commit your changes:**
   ```bash
   git commit -m "Initial commit: Set up FitTrack with Firebase and Redux"
   ```

4. **Create a new repository on GitHub:**
   - Go to [GitHub](https://github.com/) and create a new repository (e.g., `fittrack`).
   - Do **not** initialize with a README, license, or gitignore.

5. **Connect your local repo to GitHub:**
   *Replace `YOUR_USERNAME` with your GitHub username.*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/fittrack.git
   git branch -M main
   ```

6. **Push to GitHub:**
   ```bash
   git push -u origin main
   ```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
