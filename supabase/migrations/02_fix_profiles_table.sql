-- Fix profiles table structure
-- This migration ensures all required columns exist with correct types

-- First, check if the table exists and has the correct structure
DO $$
BEGIN
  -- Add missing columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'id') THEN
    ALTER TABLE profiles ADD COLUMN id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'username') THEN
    ALTER TABLE profiles ADD COLUMN username TEXT UNIQUE NOT NULL;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'city') THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'level') THEN
    ALTER TABLE profiles ADD COLUMN level INTEGER DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'total_score') THEN
    ALTER TABLE profiles ADD COLUMN total_score INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'games_played') THEN
    ALTER TABLE profiles ADD COLUMN games_played INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'games_won') THEN
    ALTER TABLE profiles ADD COLUMN games_won INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'cosmic_coins') THEN
    ALTER TABLE profiles ADD COLUMN cosmic_coins INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'current_skin') THEN
    ALTER TABLE profiles ADD COLUMN current_skin TEXT DEFAULT 'default';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'created_at') THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update existing rows with default values where NULL
UPDATE profiles
SET
  level = COALESCE(level, 1),
  total_score = COALESCE(total_score, 0),
  games_played = COALESCE(games_played, 0),
  games_won = COALESCE(games_won, 0),
  cosmic_coins = COALESCE(cosmic_coins, 0),
  current_skin = COALESCE(current_skin, 'default'),
  created_at = COALESCE(created_at, NOW()),
  updated_at = COALESCE(updated_at, NOW());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_score ON profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_city_score ON profiles(city, total_score DESC) WHERE city IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_cosmic_coins ON profiles(cosmic_coins DESC);

-- Verify the structure
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
