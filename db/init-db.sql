-- init.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  age INTEGER,
  gender VARCHAR, -- 'M', 'F', 'NB', 'other', 'prefer_not_to_say'
  role VARCHAR, -- 'user', 'pro_guide', 'admin'
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  meetcoins_balance INTEGER DEFAULT 0,
  gamification_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE interests (
  id SERIAL PRIMARY KEY,
  name VARCHAR -- 'sport', 'food', 'voyage', 'nightlife', 'chill'
);

CREATE TABLE user_interests (
  user_id INTEGER REFERENCES users(id),
  interest_id INTEGER REFERENCES interests(id),
  PRIMARY KEY (user_id, interest_id)
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  host_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES interests(id),
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
  user_id INTEGER REFERENCES users(id),
  activity_id INTEGER REFERENCES activities(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, activity_id)
);

CREATE TABLE activity_participants (
  activity_id INTEGER REFERENCES activities(id),
  user_id INTEGER REFERENCES users(id),
  status VARCHAR, -- 'pending', 'accepted', 'rejected', 'cancelled'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (activity_id, user_id)
);

CREATE TABLE chats (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER REFERENCES activities(id), -- Nullable pour les chats privés
  type VARCHAR, -- 'group', 'private'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_members (
  chat_id INTEGER REFERENCES chats(id),
  user_id INTEGER REFERENCES users(id),
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (chat_id, user_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  chat_id INTEGER NOT NULL REFERENCES chats(id),
  sender_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  amount INTEGER,
  transaction_type VARCHAR, -- 'purchase_coins', 'spend_activity', 'earn_reward'
  related_activity_id INTEGER REFERENCES activities(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);