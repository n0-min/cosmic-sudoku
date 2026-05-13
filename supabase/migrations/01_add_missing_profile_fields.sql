-- Add missing fields to profiles table for leaderboard functionality
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS total_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS games_played INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS games_won INTEGER DEFAULT 0;

-- Update existing rows with default values
UPDATE profiles
SET
  level = COALESCE(level, 1),
  total_score = COALESCE(total_score, 0),
  games_played = COALESCE(games_played, 0),
  games_won = COALESCE(games_won, 0)
WHERE
  level IS NULL
  OR total_score IS NULL
  OR games_played IS NULL
  OR games_won IS NULL;

-- Create index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_total_score ON profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_city_score ON profiles(city, total_score DESC);
