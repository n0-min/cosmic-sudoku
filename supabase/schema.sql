-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  city TEXT,
  level INTEGER DEFAULT 1,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  cosmic_coins INTEGER DEFAULT 0,
  current_skin TEXT DEFAULT 'default',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scores/Games table
CREATE TABLE public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  level INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  mistakes INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_type)
);

-- Duels table
CREATE TABLE public.duels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  player2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  puzzle_data JSONB NOT NULL,
  difficulty TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'active', 'completed', 'cancelled')),
  winner_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Duel progress (real-time sync)
CREATE TABLE public.duel_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  duel_id UUID REFERENCES public.duels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  elapsed_time INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(duel_id, user_id)
);

-- Row Level Security (RLS) Policies

-- Profiles: Users can read all profiles, but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Games: Users can only insert/read their own games
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own games"
  ON public.games FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
  ON public.games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Achievements: Users can only read/insert their own achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
  ON public.achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON public.achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Duels: Users can read duels they're part of
ALTER TABLE public.duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own duels"
  ON public.duels FOR SELECT
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

CREATE POLICY "Users can create duels"
  ON public.duels FOR INSERT
  WITH CHECK (auth.uid() = player1_id);

CREATE POLICY "Users can update duels they're part of"
  ON public.duels FOR UPDATE
  USING (auth.uid() = player1_id OR auth.uid() = player2_id);

-- Duel Progress: Users can only update their own progress
ALTER TABLE public.duel_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view duel progress for their duels"
  ON public.duel_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.duels
      WHERE duels.id = duel_progress.duel_id
      AND (duels.player1_id = auth.uid() OR duels.player2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert their own duel progress"
  ON public.duel_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own duel progress"
  ON public.duel_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_games_user_id ON public.games(user_id);
CREATE INDEX idx_games_completed_at ON public.games(completed_at DESC);
CREATE INDEX idx_games_score ON public.games(score DESC);
CREATE INDEX idx_profiles_level ON public.profiles(level DESC);
CREATE INDEX idx_profiles_total_score ON public.profiles(total_score DESC);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_duels_status ON public.duels(status);
CREATE INDEX idx_duel_progress_duel_id ON public.duel_progress(duel_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for duel_progress
CREATE TRIGGER update_duel_progress_updated_at
  BEFORE UPDATE ON public.duel_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Skins table
CREATE TABLE public.skins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  skin_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  rarity TEXT CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  preview_image TEXT,
  theme_colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User owned skins
CREATE TABLE public.user_skins (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  skin_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, skin_id)
);

-- RLS for skins (everyone can view)
ALTER TABLE public.skins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skins are viewable by everyone"
  ON public.skins FOR SELECT
  USING (true);

-- RLS for user_skins
ALTER TABLE public.user_skins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skins"
  ON public.user_skins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase skins"
  ON public.user_skins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert default skins
INSERT INTO public.skins (skin_id, name, description, price, rarity, theme_colors) VALUES
  ('default', 'Classic', 'The original cosmic theme', 0, 'common', '{"primary": "#8b5cf6", "secondary": "#3b82f6"}'),
  ('nebula', 'Nebula Dream', 'Purple and pink cosmic clouds', 500, 'rare', '{"primary": "#ec4899", "secondary": "#a855f7"}'),
  ('blackhole', 'Black Hole', 'Dark matter and event horizon', 1000, 'epic', '{"primary": "#1e1b4b", "secondary": "#312e81"}'),
  ('supernova', 'Supernova Burst', 'Explosive stellar energy', 2000, 'legendary', '{"primary": "#f59e0b", "secondary": "#ef4444"}'),
  ('aurora', 'Aurora Borealis', 'Northern lights in space', 750, 'rare', '{"primary": "#10b981", "secondary": "#06b6d4"}'),
  ('galaxy', 'Spiral Galaxy', 'Swirling stars and dust', 1500, 'epic', '{"primary": "#6366f1", "secondary": "#8b5cf6"}');

-- Index for user_skins
CREATE INDEX idx_user_skins_user_id ON public.user_skins(user_id);
