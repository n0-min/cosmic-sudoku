-- ПОЛНАЯ ПЕРЕСОЗДАНИЕ ТАБЛИЦЫ PROFILES
-- ВНИМАНИЕ: Это удалит существующие данные!
-- Если у вас есть важные данные, сначала сделайте бэкап:
-- CREATE TABLE profiles_backup AS SELECT * FROM profiles;

-- Шаг 1: Удалить старую таблицу (если есть зависимости, они будут удалены каскадом)
DROP TABLE IF EXISTS profiles CASCADE;

-- Шаг 2: Создать таблицу заново с правильной структурой
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  city TEXT,
  level INTEGER DEFAULT 1 NOT NULL,
  total_score INTEGER DEFAULT 0 NOT NULL,
  games_played INTEGER DEFAULT 0 NOT NULL,
  games_won INTEGER DEFAULT 0 NOT NULL,
  cosmic_coins INTEGER DEFAULT 0 NOT NULL,
  current_skin TEXT DEFAULT 'default' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Шаг 3: Включить RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Шаг 4: Создать политики
DROP POLICY IF EXISTS "Anyone can view profiles for leaderboard" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Anyone can view profiles for leaderboard"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Шаг 5: Создать индексы для производительности
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_total_score ON profiles(total_score DESC);
CREATE INDEX idx_profiles_cosmic_coins ON profiles(cosmic_coins DESC);
CREATE INDEX idx_profiles_city_score ON profiles(city, total_score DESC) WHERE city IS NOT NULL;

-- Шаг 6: Создать триггер для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Шаг 7: Проверка структуры
SELECT
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Ожидаемый результат:
-- id          | uuid                  | NULL                    | NO
-- username    | text                  | NULL                    | NO
-- city        | text                  | NULL                    | YES
-- level       | integer               | 1                       | NO
-- total_score | integer               | 0                       | NO
-- games_played| integer               | 0                       | NO
-- games_won   | integer               | 0                       | NO
-- cosmic_coins| integer               | 0                       | NO
-- current_skin| text                  | 'default'::text         | NO
-- created_at  | timestamp with time zone | now()                | NO
-- updated_at  | timestamp with time zone | now()                | NO
