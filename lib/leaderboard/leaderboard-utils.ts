import { createBrowserClient } from '@supabase/ssr';
import type { Difficulty } from '@/types/sudoku';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LeaderboardEntry {
  userId: string;
  username: string;
  difficulty: Difficulty;
  solveTime: number;
  mistakes: number;
  hintsUsed: number;
  timestamp: number;
}

interface LeaderboardRank {
  rank: number;
  totalPlayers: number;
  isTopThree: boolean;
  isTopTen: boolean;
}

export async function calculateLeaderboardRank(
  difficulty: Difficulty,
  solveTime: number,
  mistakes: number,
  hintsUsed: number
): Promise<LeaderboardRank> {
  try {
    // Fetch all scores for this difficulty from Supabase
    const { data: leaderboardData, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('difficulty', difficulty)
      .order('solve_time', { ascending: true });

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return { rank: 1, totalPlayers: 1, isTopThree: true, isTopTen: true };
    }

    const leaderboard = leaderboardData || [];

    // Count how many players have better scores
    let betterScores = 0;
    for (const entry of leaderboard) {
      const isBetter =
        entry.solve_time < solveTime ||
        (entry.solve_time === solveTime && entry.mistakes < mistakes) ||
        (entry.solve_time === solveTime && entry.mistakes === mistakes && entry.hints_used < hintsUsed);

      if (isBetter) {
        betterScores++;
      }
    }

    const rank = betterScores + 1;
    const totalPlayers = leaderboard.length + 1;

    return {
      rank,
      totalPlayers,
      isTopThree: rank <= 3,
      isTopTen: rank <= 10,
    };
  } catch (error) {
    console.error('Error calculating rank:', error);
    return { rank: 1, totalPlayers: 1, isTopThree: true, isTopTen: true };
  }
}

export async function getLeaderboard(difficulty: Difficulty, limit: number = 10): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        profiles (username)
      `)
      .eq('difficulty', difficulty)
      .order('solve_time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function saveScoreToDatabase(
  userId: string,
  difficulty: Difficulty,
  solveTime: number,
  mistakes: number,
  hintsUsed: number
): Promise<void> {
  try {
    console.log('Saving score to database:', {
      userId,
      difficulty,
      solveTime,
      mistakes,
      hintsUsed,
    });

    const { data, error } = await supabase.from('leaderboard').insert({
      user_id: userId,
      difficulty,
      solve_time: solveTime,
      mistakes,
      hints_used: hintsUsed,
      created_at: new Date().toISOString(),
    }).select();

    if (error) {
      console.error('Error saving score:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Score saved successfully:', data);
    }
  } catch (error) {
    console.error('Exception saving score to database:', error);
  }
}
