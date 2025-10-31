-- ✅ USERS
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(320) UNIQUE NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  password_hash varchar(256) NOT NULL,
  bio varchar(1200) DEFAULT '' NOT NULL,
  role varchar(20) DEFAULT 'user' NOT NULL CHECK (role IN ('user', 'admin')),
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);


-- ✅ SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stripe_subscription_id varchar(255) DEFAULT '',
  plan varchar(50) DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'standard', 'premium')),
  plan_period_start timestamptz,
  plan_period_end timestamptz,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_plan ON subscriptions (plan);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions (stripe_subscription_id);


-- ✅ OAUTH
CREATE TABLE oauth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider varchar(30) NOT NULL CHECK (provider IN ('google', 'meta', 'microsoft')),
  provider_user_id varchar(255) NOT NULL,
  email varchar(320),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_oauth_user_id ON oauth (user_id);
CREATE INDEX idx_oauth_provider ON oauth (provider);


-- ✅ CONVERSATIONS
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  title varchar(200),
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversations_user_id ON conversations (user_id);
CREATE INDEX idx_conversations_created_at ON conversations (created_at);


-- ✅ CHAT MESSAGES
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
  role varchar(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  tokens_used integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_messages_conversation_id ON chat_messages (conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages (created_at);


-- ✅ SITE SETTINGS
CREATE TABLE site_settings (
  key text PRIMARY KEY,
  value text,
  json_value jsonb,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- No extra index needed; the primary key on (key) is enough.


-- ✅ FEATURE TOGGLES
CREATE TABLE feature_toggles (
  plan varchar(50) NOT NULL CHECK (plan IN ('free', 'standard', 'premium')),
  feature_key text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  PRIMARY KEY (plan, feature_key)
);

CREATE INDEX idx_feature_toggles_plan ON feature_toggles (plan);
CREATE INDEX idx_feature_toggles_feature_key ON feature_toggles (feature_key);

--------------
-- Triggers---
--------------

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attaching trigger on all applicable tables
-- users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- subscriptions
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- oauth
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON oauth
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- conversations
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
-- site_settings
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON site_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();







-- Insert themes
INSERT INTO site_settings (key, json_value)
VALUES (
  'themes',
  '[
    {
      "theme": "dark",
      "is_default": true,
      "link_color": "#19c37d",
      "text_color": "#ececf1",
      "accent_color": "#10a37f",
      "border_color": "#565869",
      "button_color": "#10a37f",
      "surface_color": "#444654",
      "background_color": "#343541",
      "button_text_color": "#ffffff"
    },
    {
      "theme": "light",
      "is_default": false,
      "link_color": "#19c37d",
      "text_color": "#202123",
      "accent_color": "#10a37f",
      "border_color": "#d9d9e3",
      "button_color": "#10a37f",
      "surface_color": "#f7f7f8",
      "background_color": "#ffffff",
      "button_text_color": "#ffffff"
    },
    {
      "theme": "custom",
      "is_default": false,
      "link_color": "#a78bfa",
      "text_color": "#e0e0e6",
      "accent_color": "#8b5cf6",
      "border_color": "#3f3f5a",
      "button_color": "#8b5cf6",
      "surface_color": "#2a2a3d",
      "background_color": "#1e1e2f",
      "button_text_color": "#ffffff"
    }
  ]'::jsonb
);
