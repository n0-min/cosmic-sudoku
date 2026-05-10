-- Function to award coins and update stats
CREATE OR REPLACE FUNCTION award_completion_rewards(
  p_user_id UUID,
  p_score INTEGER,
  p_difficulty TEXT
)
RETURNS TABLE(coins_earned INTEGER, new_total INTEGER) AS $$
DECLARE
  v_coins_earned INTEGER;
  v_new_total INTEGER;
BEGIN
  -- Calculate coins based on difficulty
  v_coins_earned := CASE p_difficulty
    WHEN 'easy' THEN 10
    WHEN 'medium' THEN 25
    WHEN 'hard' THEN 50
    WHEN 'expert' THEN 100
    ELSE 10
  END;

  -- Bonus coins for high scores
  IF p_score > 2000 THEN
    v_coins_earned := v_coins_earned + 50;
  ELSIF p_score > 1500 THEN
    v_coins_earned := v_coins_earned + 25;
  END IF;

  -- Update user profile
  UPDATE public.profiles
  SET
    cosmic_coins = cosmic_coins + v_coins_earned,
    total_score = total_score + p_score,
    games_played = games_played + 1,
    games_won = games_won + 1,
    level = CASE
      WHEN (total_score + p_score) >= level * 1000 THEN level + 1
      ELSE level
    END,
    updated_at = NOW()
  WHERE id = p_user_id
  RETURNING cosmic_coins INTO v_new_total;

  RETURN QUERY SELECT v_coins_earned, v_new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to purchase skin
CREATE OR REPLACE FUNCTION purchase_skin(
  p_user_id UUID,
  p_skin_id TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance INTEGER) AS $$
DECLARE
  v_price INTEGER;
  v_current_coins INTEGER;
  v_already_owned BOOLEAN;
BEGIN
  -- Check if already owned
  SELECT EXISTS(
    SELECT 1 FROM public.user_skins
    WHERE user_id = p_user_id AND skin_id = p_skin_id
  ) INTO v_already_owned;

  IF v_already_owned THEN
    RETURN QUERY SELECT false, 'Skin already owned', 0;
    RETURN;
  END IF;

  -- Get skin price
  SELECT price INTO v_price
  FROM public.skins
  WHERE skin_id = p_skin_id;

  IF v_price IS NULL THEN
    RETURN QUERY SELECT false, 'Skin not found', 0;
    RETURN;
  END IF;

  -- Get user coins
  SELECT cosmic_coins INTO v_current_coins
  FROM public.profiles
  WHERE id = p_user_id;

  IF v_current_coins < v_price THEN
    RETURN QUERY SELECT false, 'Not enough coins', v_current_coins;
    RETURN;
  END IF;

  -- Deduct coins
  UPDATE public.profiles
  SET cosmic_coins = cosmic_coins - v_price
  WHERE id = p_user_id
  RETURNING cosmic_coins INTO v_current_coins;

  -- Add skin to user
  INSERT INTO public.user_skins (user_id, skin_id)
  VALUES (p_user_id, p_skin_id);

  RETURN QUERY SELECT true, 'Skin purchased successfully', v_current_coins;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
