-- AUTO-CREATE PROFILE ON USER SIGNUP
-- This trigger automatically creates a profile when a new user signs up

-- Step 1: Create the function that will create the profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, level, total_score, games_played, games_won, cosmic_coins, current_skin)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email, 'User_' || substr(NEW.id::text, 1, 8)),
    1,
    0,
    0,
    0,
    0,
    'default'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 3: Verify the trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 4: Test by checking if you have any auth users without profiles
SELECT
  'Users without profiles:' as check_type,
  COUNT(*) as count
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- If you have existing users without profiles, create profiles for them:
INSERT INTO public.profiles (id, username, level, total_score, games_played, games_won, cosmic_coins, current_skin)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', u.email, 'User_' || substr(u.id::text, 1, 8)),
  1,
  0,
  0,
  0,
  0,
  'default'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verify profiles were created
SELECT 'Total profiles after migration:' as info, COUNT(*) FROM profiles;
