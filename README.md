# Quizmaster 🧠⚡

A competitive trivia platform built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Firebase** (Authentication & Cloud Firestore). Features real-time leaderboards, timed gameplay, interactive feedback, achievement badges, and a secure administrative question management portal.

---

## 🌟 Key Features

### 🎮 Dynamic Gameplay Experience
- **6 Knowledge Categories**: General Knowledge, Science, History, Geography, Technology, and Sports.
- **3 Difficulty Tiers**: Easy, Medium, and Hard with calibrated scoring algorithms.
- **Timed Pressure HUD**: 15-second countdown timer with dynamic color shifts (calm emerald $\rightarrow$ amber at $\le 5$s $\rightarrow$ urgent pulsing rose at $\le 3$s with audio ticks).
- **Keyboard Shortcuts**: Rapid response support using keys `1`–`4` or `A`–`D`, plus `Enter`/`Space` to advance.
- **Immediate Feedback & Knowledge Briefs**: Color-coded answer reveals with contextual explanations for continuous learning.
- **Synthesized Audio Effects**: Web Audio API-powered sound effects for selections, correct answers, incorrect answers, and timer ticks.

### 🏆 Global Leaderboard & Stats
- **Top-3 Podium**: Visual gold, silver, and bronze pedestals celebrating top performers.
- **Multi-Dimensional Filters**: Filter rankings by timeframe (*All Time*, *This Month*, *This Week*) and category.
- **User Pinpointing**: Automatically highlights the authenticated player's rank with a golden border and "YOU" badge.
- **Privacy-Hardened**: Public leaderboards sanitize user data; player email addresses are never exposed publicly.

### 🎖️ Achievements & Player Progression
- **Unlockable Badges**: Visual progression system rewarding milestones (First Steps, Sharp Mind, Speed Demon, Category Master, Trivia Titan, etc.).
- **Live Achievement Toasts**: Animated popups with sound effects when new milestones are unlocked.
- **Player Profile Dashboard**: Historical quiz attempts, personal bests, accuracy percentage, and overall completion statistics.

### 🛡️ Administrative Portal & RBAC
- **Strict Role-Based Access Control**: Hardened authorization model where only the designated Google Account (`oseriemeebhomien@gmail.com`) can access the Admin Dashboard.
- **Cryptographic Token Verification**: Admin authorization is verified directly at the Firestore Security Rules level using Google OAuth JWT tokens (`request.auth.token.email_verified == true`).
- **Complete Question CRUD**: Real-time interface to create, edit, search, filter, and delete quiz questions in Cloud Firestore.
- **One-Click Question Bank Seeding**: Batch uploader to populate Firestore with initial curated trivia questions.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Animations** | [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Backend & Database** | [Google Cloud Firestore](https://firebase.google.com/docs/firestore) |
| **Authentication** | [Firebase Authentication](https://firebase.google.com/docs/auth) (Google OAuth) |
| **Audio** | HTML5 Web Audio API (Zero external asset dependencies) |

---

## 📂 Project Structure

```text
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # SVGs and brand assets
│   ├── components/             # Reusable UI & view components
│   │   ├── AdminDashboard.tsx      # Admin question management & seeding
│   │   ├── CategoryCard.tsx        # Category selection card
│   │   ├── Header.tsx              # Navigation bar with user status
│   │   ├── HomeScreen.tsx          # Landing & game mode selection
│   │   ├── LeaderboardScreen.tsx   # Global rankings & podium
│   │   ├── ProfileDashboard.tsx    # User stats & history
│   │   ├── QuestionFormModal.tsx   # Modal for adding/editing questions
│   │   ├── QuizScreen.tsx          # Main gameplay engine & HUD
│   │   ├── ResultsScreen.tsx       # Score breakdown & review
│   │   ├── SignInModal.tsx         # Google sign-in modal with error recovery
│   │   └── AchievementToast.tsx    # Celebratory toast for unlocked badges
│   ├── context/
│   │   └── AuthContext.tsx         # Firebase Auth provider & session listener
│   ├── data/
│   │   └── questions.ts            # Curated offline question bank (90+ questions)
│   ├── lib/
│   │   └── firebase.ts             # Firebase app, auth, & Firestore initialization
│   ├── services/
│   │   ├── achievementService.ts   # Milestone checking & badge persistence
│   │   ├── firestoreErrors.ts      # Structured Firestore error handler
│   │   ├── leaderboardService.ts   # Public ranking queries & sanitization
│   │   ├── questionService.ts      # Firestore question fetching & mutations
│   │   ├── quizService.ts          # Score calculation & private result storage
│   │   └── userService.ts          # User profile sync & admin verification
│   ├── types/
│   │   ├── quiz.ts                 # Quiz questions, answers, and states
│   │   └── user.ts                 # User profile, scores, and achievement types
│   ├── utils/
│   │   └── audio.ts                # Web Audio sound synthesizers
│   ├── App.tsx                 # Main layout & router orchestration
│   ├── index.css               # Tailwind CSS theme configurations
│   └── main.tsx                # React DOM mount point
├── .env.example                # Example environment variables
├── firebase-applet-config.json # Firebase project identifiers
├── firebase-blueprint.json     # Firestore entity and collection schemas
├── firestore.rules             # Production security rules
├── package.json                # Project dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A [Firebase Project](https://console.firebase.google.com/) with **Authentication** and **Cloud Firestore** enabled.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/quizmaster.git
   cd quizmaster
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   Create a `firebase-applet-config.json` in the root directory (or define environment variables):
   ```json
   {
     "projectId": "your-firebase-project-id",
     "appId": "your-firebase-app-id",
     "apiKey": "your-firebase-api-key",
     "authDomain": "your-project-id.firebaseapp.com",
     "firestoreDatabaseId": "(default)",
     "storageBucket": "your-project-id.firebasestorage.app",
     "messagingSenderId": "your-sender-id"
   }
   ```

4. **Deploy Firestore Security Rules**:
   Ensure security rules are applied to your Firestore instance:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy --only firestore:rules
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Privacy Architecture

- **Default-Deny Catch-All**: Firestore rules reject all unmatched read and write requests by default.
- **Admin Verification**: Only the designated administrator account (`oseriemeebhomien@gmail.com`) can create, modify, or delete questions in the `/questions` collection. The rule verifies the cryptographically signed Google OAuth token:
  ```javascript
  function isPrimaryAdmin() {
    return isSignedIn() &&
      request.auth.token.email == 'oseriemeebhomien@gmail.com' &&
      request.auth.token.email_verified == true;
  }
  ```
- **Self-Elevation Lockout**: Standard players cannot set `role: "admin"` when creating or updating their user document.
- **Email Redaction**: Leaderboard scores stored in the public `/quizResults` collection have email addresses stripped, preserving player privacy while maintaining global rankings. Private quiz histories are secured in `/users/{userId}/quizResults`.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the development server on port 3000 |
| `npm run build` | Compiles TypeScript and builds production bundles to `dist/` |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |
| `npm run preview` | Previews the production build locally |
| `npm run clean` | Cleans up the `dist` directory |

---

## 📱 Mobile Responsiveness

The application is engineered with a mobile-first approach, tested down to $360\text{px}$ viewports:
- Minimum $44\text{px} \times 44\text{px}$ touch targets across all buttons and inputs.
- Safe areas for mobile notches and gesture bars.
- Dynamic responsive typography and flexible grids that scale cleanly across phones, tablets, and desktop displays.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
