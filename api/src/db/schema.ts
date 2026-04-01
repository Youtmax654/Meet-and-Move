import {
  boolean,
  decimal,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ==========================================
// 🧑 USERS & INTERESTS
// ==========================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username").notNull(),
  email: varchar("email").unique().notNull(),
  age: integer("age"),
  gender: varchar("gender"), // 'M', 'F', 'NB', 'other', 'prefer_not_to_say'
  role: varchar("role"), // 'user', 'admin'
  bio: text("bio"),
  isVerified: boolean("is_verified").default(false),
  meetcoinsBalance: integer("meetcoins_balance").default(0),
  gamificationLevel: integer("gamification_level").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"), // 'sport', 'food', 'voyage', 'nightlife', 'chill'
});

export const userInterests = pgTable(
  "user_interests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    interestId: uuid("interest_id")
      .notNull()
      .references(() => interests.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.interestId] })],
);

// ==========================================
// 🎯 ACTIVITIES
// ==========================================

export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: uuid("host_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => interests.id),
  specificDetails: jsonb("specific_details"), // JSONB
  latitude: decimal("latitude"),
  longitude: decimal("longitude"),
  maxParticipants: integer("max_participants"),
  minAge: integer("min_age"),
  maxAge: integer("max_age"),
  autoValidate: boolean("auto_validate").default(true),
  eventDate: timestamp("event_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userFavoriteActivities = pgTable(
  "user_favorite_activities",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activities.id),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.activityId] })],
);

export const activityParticipants = pgTable(
  "activity_participants",
  {
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activities.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    status: varchar("status"), // 'pending', 'accepted', 'rejected', 'cancelled'
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.userId] })],
);

// ==========================================
// 💬 CHATS & MESSAGES
// ==========================================

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id), // Nullable pour les chats privés
  type: varchar("type"), // 'group', 'private'
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.userId] })],
);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => users.id),
  content: text("content"),
  sentAt: timestamp("sent_at").defaultNow(),
});

// ==========================================
// 💰 TRANSACTIONS
// ==========================================

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount"),
  transactionType: varchar("transaction_type"), // 'purchase_coins', 'spend_activity', 'earn_reward'
  relatedActivityId: uuid("related_activity_id").references(
    () => activities.id,
  ),
  createdAt: timestamp("created_at").defaultNow(),
});
