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
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phoneNumber: text("phone_number").unique(),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  age: integer("age"),
  gender: varchar("gender"),
  image: text("image"),
  bio: text("bio"),
  meetcoinsBalance: integer("meetcoins_balance").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
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
    id: uuid("id").primaryKey().defaultRandom(),
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
      .defaultNow() // 🌟 Ajouté defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ==========================================
// 🧑 USERS & INTERESTS
// ==========================================

export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name"),
});

export const userInterests = pgTable(
  "user_interests",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    interestId: uuid("interest_id")
      .notNull()
      .references(() => interests.id, { onDelete: "cascade" }),
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
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  categoryId: uuid("category_id").references(() => interests.id, {
    onDelete: "set null",
  }),
  specificDetails: jsonb("specific_details"),
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
      .references(() => user.id, { onDelete: "cascade" }),
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.activityId] })],
);

export const activityParticipants = pgTable(
  "activity_participants",
  {
    activityId: uuid("activity_id")
      .notNull()
      .references(() => activities.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: varchar("status").default("pending"), // 'pending', 'accepted', 'rejected', 'cancelled'
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.activityId, table.userId] })],
);

// ==========================================
// 💬 CHATS & MESSAGES
// ==========================================

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id, {
    onDelete: "cascade",
  }),
  type: varchar("type"), // 'group', 'private'
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMembers = pgTable(
  "chat_members",
  {
    chatId: uuid("chat_id")
      .notNull()
      .references(() => chats.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.chatId, table.userId] })],
);

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  senderId: uuid("sender_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
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
    .references(() => user.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  transactionType: varchar("transaction_type"), // 'purchase_coins', 'spend_activity', 'earn_reward'
  relatedActivityId: uuid("related_activity_id").references(
    () => activities.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==========================================
// 🔗 DRIZZLE RELATIONS DEFINITIONS (🌟 AJOUTÉ)
// ==========================================

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  userInterests: many(userInterests),
  hostedActivities: many(activities),
  favoriteActivities: many(userFavoriteActivities),
  participatingActivities: many(activityParticipants),
  chatMemberships: many(chatMembers),
  messagesSent: many(messages),
  transactions: many(transactions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const interestsRelations = relations(interests, ({ many }) => ({
  userInterests: many(userInterests),
  activities: many(activities),
}));

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(user, { fields: [userInterests.userId], references: [user.id] }),
  interest: one(interests, {
    fields: [userInterests.interestId],
    references: [interests.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
  host: one(user, { fields: [activities.hostId], references: [user.id] }),
  category: one(interests, {
    fields: [activities.categoryId],
    references: [interests.id],
  }),
  favoritedBy: many(userFavoriteActivities),
  participants: many(activityParticipants),
  chats: many(chats),
  transactions: many(transactions),
}));

export const userFavoriteActivitiesRelations = relations(
  userFavoriteActivities,
  ({ one }) => ({
    user: one(user, {
      fields: [userFavoriteActivities.userId],
      references: [user.id],
    }),
    activity: one(activities, {
      fields: [userFavoriteActivities.activityId],
      references: [activities.id],
    }),
  }),
);

export const activityParticipantsRelations = relations(
  activityParticipants,
  ({ one }) => ({
    activity: one(activities, {
      fields: [activityParticipants.activityId],
      references: [activities.id],
    }),
    user: one(user, {
      fields: [activityParticipants.userId],
      references: [user.id],
    }),
  }),
);

export const chatsRelations = relations(chats, ({ one, many }) => ({
  activity: one(activities, {
    fields: [chats.activityId],
    references: [activities.id],
  }),
  members: many(chatMembers),
  messages: many(messages),
}));

export const chatMembersRelations = relations(chatMembers, ({ one }) => ({
  chat: one(chats, { fields: [chatMembers.chatId], references: [chats.id] }),
  user: one(user, { fields: [chatMembers.userId], references: [user.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, { fields: [messages.chatId], references: [chats.id] }),
  sender: one(user, { fields: [messages.senderId], references: [user.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(user, { fields: [transactions.userId], references: [user.id] }),
  activity: one(activities, {
    fields: [transactions.relatedActivityId],
    references: [activities.id],
  }),
}));
