-- Complete Supabase setup for Cosmic Sudoku
-- Run this in Supabase SQL Editor

-- 1. Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  cosmic_coins INTEGER DEFAULT 0,
  current_skin TEXT DEFAULT 'default',
  owned_skins TEXT[] DEFAULT ARRAY['default'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to existing profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS cosmic_coins INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_skin TEXT DEFAULT 'default',
ADD COLUMN IF NOT EXISTS owned_skins TEXT[] DEFAULT ARRAY['default'];

-- 3. Update existing rows with default values
UPDATE profiles
SET
  cosmic_coins = COALESCE(cosmic_coins, 0),
  current_skin = COALESCE(current_skin, 'default'),
  owned_skins = COALESCE(owned_skins, ARRAY['default'])
WHERE
  cosmic_coins IS NULL
  OR current_skin IS NULL
  OR owned_skins IS NULL;

-- 4. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- 6. Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 7. Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  solve_time INTEGER NOT NULL,
  mistakes INTEGER NOT NULL DEFAULT 0,
  hints_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create indexes for leaderboard
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty ON leaderboard(difficulty);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_solve_time ON leaderboard(solve_time);
CREATE INDEX IF NOT EXISTS idx_leaderboard_difficulty_time ON leaderboard(difficulty, solve_time);

-- 9. Enable RLS on leaderboard
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- 10. Drop existing leaderboard policies if they exist
DROP POLICY IF EXISTS "Anyone can view leaderboard" ON leaderboard;
DROP POLICY IF EXISTS "Users can insert own scores" ON leaderboard;

-- 11. Create RLS policies for leaderboard
CREATE POLICY "Anyone can view leaderboard"
ON leaderboard FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert own scores"
ON leaderboard FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 12. Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, cosmic_coins, current_skin, owned_skins)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    0,
    'default',
    ARRAY['default']
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 14. Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 15. Verify setup
SELECT 'Profiles table:' as info, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Leaderboard table:', COUNT(*) FROM leaderboard;
