# Lexilog
Gamified Vocabulary Trainer App

Lexilog is a full-stack **gamified vocabulary learning platform** that helps users improve their vocabulary through personalized practice, progress tracking, and interactive quizzes.

The platform uses a proficiency-based learning system with a weighted word selection algorithm to prioritize weaker vocabulary while periodically reviewing mastered words, enabling more effective long-term retention.

---

## Features

* Secure user authentication using JWT
* Personalized vocabulary practice
* Weighted random word selection based on user proficiency
* Multiple-choice quizzes with instant feedback
* Progress tracking with XP, coins, and proficiency levels
* Leaderboard system for user motivation
* Persistent user learning data stored in MongoDB
* Automated frontend, backend, and end-to-end testing

---

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* shadcn/ui

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Testing

* Vitest
* React Testing Library
* Supertest
* Playwright

---

## Learning Algorithm

Lexilog uses a personalized vocabulary selection system to optimize practice sessions.

The algorithm:

* Assigns each word a proficiency score based on user performance.
* Uses weighted random selection to prioritize words with lower proficiency.
* Introduces new vocabulary gradually.
* Periodically reviews mastered words to reinforce retention.

This ensures that users spend more time practicing challenging vocabulary while maintaining previously learned words.

---

## Gamification System

Lexilog incorporates gamification elements to encourage consistent learning.

Users can:

* Earn XP through quiz completion
* Collect coins as rewards
* Increase word proficiency
* Master vocabulary items
* Compete on a leaderboard

---

## Testing

The application includes automated tests across multiple layers:

* Frontend unit/component testing using Vitest and React Testing Library
* Backend integration testing using Supertest
* End-to-end testing using Playwright

These tests validate core functionality and ensure reliability across the application stack.

---

## Project Structure

```text
Lexilog/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── requests/
│   ├── scripts/
│   ├── services/
│   ├── tests/
│   └── utils/
├── frontend/
│   ├── src/
│   ├── public/
│   └── images/
├── e2e-tests/
│   └── tests/
├── vocab-data/
├── vocab-generator/
└── README.md
```

---

## Installation

### Prerequisites

* Node.js
* npm
* MongoDB

### Clone the repository

```bash
git clone <repository-url>
cd lexilog
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secret>
```

---

## Future Improvements

* Mobile application using React Native
* AI-powered vocabulary recommendations
* Advanced learning analytics
* Additional quiz formats

---

## License

This project is for educational and portfolio purposes.
