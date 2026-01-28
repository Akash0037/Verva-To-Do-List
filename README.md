<div align="center">
<img width="1200" height="475" alt="Verva AI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# ⚡ Verva AI - Dynamic Daily Planning

**Your AI-Powered Productivity Architect**

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 🌟 Overview

**Verva AI** is a modern, AI-enhanced task management web application designed to help you manage your time with vitality and precision. With an integrated AI assistant powered by Google's Gemini, Verva goes beyond simple to-do lists—it becomes your personal productivity coach.

---

## ✨ Key Features

### 📋 Smart Task Management
- Create, edit, and organize tasks with priorities and due dates
- Track task completion with visual progress indicators
- Filter and sort tasks by status, priority, or deadline

### 🤖 AI-Powered Assistant (Verva AI)
- **Powered by Google Gemini AI** - Get intelligent productivity advice
- Context-aware responses based on your current tasks
- Personalized time management strategies and Pomodoro suggestions
- Motivational support to keep you on track

### ⏱️ Pomodoro Timer
- Built-in focus timer using the Pomodoro Technique
- Helps maintain productivity with structured work/break intervals

### 📊 Analytics Dashboard
- Visual insights into your productivity patterns
- Track completed tasks and progress over time
- Charts powered by Recharts for beautiful data visualization

### 🔐 Secure Authentication
- **Google Sign-In** for quick and easy access
- Email/Password authentication option
- Powered by Firebase Authentication

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 19.2 with TypeScript 5.8 |
| **Build Tool** | Vite 6.2 |
| **Styling** | Tailwind CSS 4.1 |
| **AI Integration** | Google Gemini AI (`@google/genai`) |
| **Authentication** | Firebase Auth (Google & Email/Password) |
| **Data Visualization** | Recharts 3.7 |
| **Routing** | React Router DOM 7.13 |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- A **Google Gemini API Key** (get one from [Google AI Studio](https://aistudio.google.com/))
- A **Firebase Project** (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/verva-to-do-list.git
   cd verva-to-do-list
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create or update the `.env.local` file with your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173` to start using Verva AI!

---

## 📖 How to Use

### 1. Sign In
- Click **"Continue with Google"** for quick access, or
- Create an account using email and password

### 2. Create Tasks
- Add new tasks with titles, priorities, and due dates
- Organize your day by marking tasks as complete

### 3. Chat with Verva AI
- Click on the AI Assistant panel
- Ask for help with time management, scheduling, or productivity tips
- Verva AI understands your current tasks and provides personalized advice

### 4. Stay Focused with Pomodoro
- Use the built-in Pomodoro timer for focused work sessions
- Follow the 25-minute work / 5-minute break pattern

### 5. Track Your Progress
- Visit the Analytics dashboard to see your productivity insights
- Monitor completed tasks and identify patterns

---

## 📁 Project Structure

```
verva-to-do-list/
├── components/
│   ├── AiAssistant.tsx    # AI chat interface
│   ├── Analytics.tsx      # Productivity charts
│   ├── Pomodoro.tsx       # Focus timer
│   ├── Sidebar.tsx        # Navigation
│   └── TaskList.tsx       # Task management
├── pages/
│   ├── Dashboard.tsx      # Main dashboard
│   └── Login.tsx          # Authentication page
├── services/
│   ├── authService.ts     # Firebase auth functions
│   ├── firebaseConfig.ts  # Firebase configuration
│   └── geminiService.ts   # Gemini AI integration
├── context/               # React context providers
├── App.tsx                # Main app component
├── index.tsx              # Entry point
└── types.ts               # TypeScript definitions
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## 🌐 Deployment

Build the project for production:
```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting service like:
- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages

> **Note:** After deploying, add your domain to Firebase's **Authorized Domains** list for Google Sign-In to work.

---

## 📄 License

This project is private and proprietary.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and Gemini AI**

</div>
