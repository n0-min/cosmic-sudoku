-- Function to increment user stats atomically
CREATE OR REPLACE FUNCTION increment_user_stats(
  p_user_id UUID,
  p_score INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET
    total_score = total_score + p_score,
    games_played = games_played + 1,
    games_won = games_won + 1,
    level = CASE
      WHEN (total_score + p_score) >= level * 1000 THEN level + 1
      ELSE level
    END,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
