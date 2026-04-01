-- init.sql

-- Activer l'extension pgcrypto si besoin pour gen_random_uuid() (historique, bien que natif depuis PG13)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  age INTEGER,
  gender VARCHAR, -- 'M', 'F', 'NB', 'other', 'prefer_not_to_say'
  role VARCHAR, -- 'user', 'admin'
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  meetcoins_balance INTEGER DEFAULT 0,
  gamification_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR -- 'sport', 'food', 'voyage', 'nightlife', 'chill'
);

CREATE TABLE user_interests (
  user_id UUID REFERENCES users(id),
  interest_id UUID REFERENCES interests(id),
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  category_id UUID REFERENCES interests(id),
  specific_details JSONB, -- JSONB est plus performant que JSON sur Postgres
  latitude DECIMAL,
  longitude DECIMAL,
  max_participants INTEGER,
  min_age INTEGER,
  max_age INTEGER,
  auto_validate BOOLEAN DEFAULT true,
  event_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_favorite_activities (
  user_id UUID REFERENCES users(id),
  activity_id UUID REFERENCES activities(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE activity_participants (
  activity_id UUID REFERENCES activities(id),
  user_id UUID REFERENCES users(id),
  status VARCHAR, -- 'pending', 'accepted', 'rejected', 'cancelled'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activity_id, user_id)
);

CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id), -- Nullable pour les chats privés
  type VARCHAR, -- 'group', 'private'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_members (
  chat_id UUID REFERENCES chats(id),
  user_id UUID REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL REFERENCES chats(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INTEGER,
  transaction_type VARCHAR, -- 'purchase_coins', 'spend_activity', 'earn_reward'
  related_activity_id UUID REFERENCES activities(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);