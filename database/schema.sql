CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  avatar_url TEXT,
  provider VARCHAR(50) DEFAULT 'email',
  total_votes INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  display_name VARCHAR(150) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  api_endpoint TEXT,
  model_id VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  elo_score INTEGER DEFAULT 1000,
  total_battles INTEGER DEFAULT 0,
  total_wins INTEGER DEFAULT 0,
  total_losses INTEGER DEFAULT 0,
  total_ties INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS battles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_a_id UUID REFERENCES models(id) ON DELETE CASCADE,
  model_b_id UUID REFERENCES models(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  response_a TEXT,
  response_b TEXT,
  winner VARCHAR(10),
  category VARCHAR(50) DEFAULT 'general',
  language VARCHAR(10) DEFAULT 'ar',
  ip_address VARCHAR(50),
  response_time_a INTEGER,
  response_time_b INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS elo_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model_id UUID REFERENCES models(id) ON DELETE CASCADE,
  battle_id UUID REFERENCES battles(id) ON DELETE CASCADE,
  old_elo INTEGER NOT NULL,
  new_elo INTEGER NOT NULL,
  change INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO models (name, display_name, provider, model_id, description, elo_score) VALUES
  ('gpt-4o', 'GPT-4o', 'openai', 'gpt-4o', 'نموذج OpenAI الأقوى', 1200),
  ('gpt-3.5-turbo', 'GPT-3.5 Turbo', 'openai', 'gpt-3.5-turbo', 'نموذج OpenAI السريع', 1050),
  ('claude-3-opus', 'Claude 3 Opus', 'anthropic', 'claude-3-opus-20240229', 'نموذج Anthropic الأقوى', 1180),
  ('claude-3-sonnet', 'Claude 3 Sonnet', 'anthropic', 'claude-3-sonnet-20240229', 'نموذج Anthropic المتوازن', 1100),
  ('gemini-pro', 'Gemini Pro', 'google', 'gemini-pro', 'نموذج Google', 1080)
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_battles_created ON battles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_elo ON models(elo_score DESC);
