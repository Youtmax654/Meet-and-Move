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
| **Object Storage** | MinIO (S3-compatible, Docker) — R2/S3 in prod |
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
    compose.yaml  # Docker Compose (PostgreSQL + Redis + MinIO/S3)
    init-db.sql   # Schema + seed data
```

### 🖼️ Image storage

Images are uploaded through the API and stored in an S3-compatible bucket. In
local development this is **MinIO** (started by Docker Compose); in production
the same `S3_*` env vars can point at Cloudflare R2 or AWS S3.

Image uploads happen **inside** the entity's create/update request — a single
`multipart/form-data` call with a `data` field (the JSON payload) and an optional
`file` field. The object key is derived from the entity id, so re-uploading
**overwrites** the previous image and the public URL is **stable**:

- `PATCH /users/me` (multipart: `data` + optional `file`) → stores
  `profile/<userId>/image` and sets `user.image`.
- `POST /activities` (multipart: `data` + optional `file`) → stores
  `activities/<activityId>/image` in the same request that creates the activity.
- Accepted: JPEG / PNG / WebP, ≤ 5 MB. Both routes still accept plain JSON when
  no image is sent.

Images are read back through **authenticated** API routes that stream the object
from S3:

- `GET /activities/:id/image` → streams the activity cover. `GET /activities/:id`
  returns `image: "/activities/<id>/image"` (a relative path) when a cover exists.
- `GET /users/:id/image` → streams a user avatar. `GET /users/me` returns
  `image: "/users/<id>/image"` for uploaded avatars (external URLs, e.g. social
  login, are passed through untouched).
- In both cases the mobile builds the full URL and attaches the session cookie
  (see `lib/image-source.ts`).
- MinIO console: `http://localhost:9001` (user `meetandmove`, password
  `meetandmove-secret`). See [db/README.md](db/README.md) for details.
- On a physical device, set `S3_PUBLIC_URL` (api) and `EXPO_PUBLIC_API_URL`
  (mobile) to your machine's LAN IP instead of `localhost`.

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
