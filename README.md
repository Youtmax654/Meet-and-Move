# Meet&Move

**Meet&Move** is a mobile-first social platform that helps people find partners for physical and cultural activities — sports, hiking, dining, museum visits, cinema, travel, and more. Users can create experiences, join others' activities, chat with their group in real-time, and build a community around shared interests.

> *"Votre prochaine sortie est au coin de la rue"* — Your next outing is just around the corner.

## Features

### 👤 Authentication & User Management
- Email-based authentication with OTP code
- Social login via Google and Apple (Better Auth)
- Secure session storage via `expo-secure-store`
- Profile creation (name, birth date, gender, photo, bio)
- Session redirect logic (profile completion gate)

### 🎯 Activity Management
- Browse activities feed with host info, category, participants, and pricing
- View detailed activity pages (participants, location, chat, price breakdown)
- Create activities with title, description, category, location, date, price, difficulty, duration, max participants, age range, and image
- Join activities with validation (capacity, duplicates)
- Bookmark favorite activities

### 🏷️ Categories & Interests
- Curated categories: Sport, Travel, Gastronomy & Cuisine, Culture & Heritage
- Users can select multiple interests
- Activities are categorized for easy discovery

### 💬 Real-time Chat
- Group chats automatically created when an activity is formed
- Private chat support
- Real-time messaging via SSE (Server-Sent Events) backed by Redis pub/sub
- Optimistic UI with message deduplication
- 30-second heartbeat keepalive

### 👤 User Profiles
- Public profile with cover photo, avatar, bio, and stats
- Activity history (hosted experiences)
- Level, MeetCoins balance, and member since display

### 🪙 MeetCoins & Economy
- Virtual currency system (MeetCoins)
- Transaction ledger: purchase, spend on activities, earn rewards
- Gamification level displayed on profile

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native 0.81 + Expo SDK 54 |
| **Mobile UI** | Tamagui + React Navigation |
| **Backend API** | Hono (Cloudflare Workers) |
| **Database** | PostgreSQL (Docker) |
| **Cache / Pub-Sub** | Redis Alpine (Docker) |
| **ORM** | Drizzle ORM + drizzle-kit |
| **Authentication** | Better Auth (email OTP, Google, Apple) |
| **Validation** | Zod v4 |
| **State Management** | TanStack Query v5 |
| **Styling** | Chakra UI v3 (landing), custom Tamagui theme (mobile) |
| **Email** | Resend |
| **Landing Page** | React 19 + Vite + Chakra UI v3 |
| **HTTP Client** | Axios (cookie-based auth) |
| **Testing** | Vitest |
| **Process Manager** | mprocs |

## Architecture

```
Meet-and-Move/
  api/          # Hono API backend (Cloudflare Worker)
    src/
      features/   # Domain modules (activities, auth, chats, feed, users)
      db/         # PostgreSQL + Redis client setup
      middleware/  # Auth + DB connection middleware
      utils/      # BetterAuth config, email, helpers
  mobile/       # React Native / Expo app
    app/          # Expo Router file-based routes
    features/     # Domain logic per feature
    components/   # Shared UI components
    hooks/        # Custom hooks
    lib/          # API client, Auth client, utilities
  landing/      # Marketing site (React + Vite + Chakra UI)
    src/
      components/ # Hero, Features, FAQ, CTA sections
  db/           # Database configuration
    compose.yaml  # Docker Compose (PostgreSQL + Redis)
    init-db.sql   # Schema + seed data
```

## Getting Started

### Prerequisites

- Node.js >= 22
- Docker & Docker Compose
- Expo CLI

### Installation

```bash
# Clone the repository
git clone https://github.com/maximepenn/Meet-and-Move.git

# Install all dependencies (root, api, and mobile)
npm install

# Launch the API, mobile app, and DBs concurrently
npm start
```

### Individual Commands

```bash
npm run start:mobile   # Start the React Native/Expo app
npm run start:api      # Start the Hono API in dev mode
npm run db:start       # Start PostgreSQL + Redis with Docker
npm run db:stop        # Stop Docker containers
npm run db:prune       # Stop and remove volumes
npm test               # Run all tests
```
