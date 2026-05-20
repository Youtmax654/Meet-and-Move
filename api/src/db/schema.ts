import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
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
// 🛠️ AUTHENTICATION & AUTHORIZATION
// ==========================================

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phoneNumber: text("phone_number").unique(),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  age: integer("age"),
  gender: varchar("gender"), // 'M', 'F', 'NB', 'other', 'prefer_not_to_say'
  image: text("image"),
  bio: text("bio"),
  meetcoinsBalance: text("meetcoins_balance").default("0").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid("id").primaryKey(),
    accountId: uuid("account_id").notNull(),
    providerId: uuid("provider_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

// ==========================================
// 🧑 USERS & INTERESTS
// ==========================================

// export const users = pgTable("users", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   username: varchar("username").notNull(),
//   email: varchar("email").unique().notNull(),
//   age: integer("age"),
//   gender: varchar("gender"), // 'M', 'F', 'NB', 'other', 'prefer_not_to_say'
//   role: varchar("role"), // 'user', 'admin'
//   bio: text("bio"),
//   isVerified: boolean("is_verified").default(false),
//   meetcoinsBalance: integer("meetcoins_balance").default(0),
//   gamificationLevel: integer("gamification_level").default(1),
//   createdAt: timestamp("created_at").defaultNow(),
// });

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"), // 'sport', 'food', 'voyage', 'nightlife', 'chill'
});

export const userInterests = pgTable(
  "user_interests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id),
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
    .references(() => user.id),
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
      .references(() => user.id),
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
      .references(() => user.id),
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
      .references(() => user.id),
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
    .references(() => user.id),
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
    .references(() => user.id),
  amount: integer("amount"),
  transactionType: varchar("transaction_type"), // 'purchase_coins', 'spend_activity', 'earn_reward'
  relatedActivityId: uuid("related_activity_id").references(
    () => activities.id,
  ),
  createdAt: timestamp("created_at").defaultNow(),
});
