import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ScoreSubmissionSchema } from '@/lib/validation/schemas';
import { SudokuGenerator } from '@/lib/sudoku/generator';
import DOMPurify from 'isomorphic-dompurify';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ScoreSubmissionSchema.parse(body);

    const { currentGrid, solution, puzzle } = validatedData;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null && currentGrid[row][col] !== puzzle[row][col]) {
          return NextResponse.json(
            { error: 'Invalid submission: puzzle tampering detected' },
            { status: 400 }
          );
        }
      }
    }

    const validation = SudokuGenerator.validate(currentGrid, solution);

    if (!validation.isComplete) {
      return NextResponse.json(
        { error: 'Puzzle is not complete' },
        { status: 400 }
      );
    }

    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3,
    };

    const baseScore = 1000;
    const timeBonus = Math.max(0, 1200 - validatedData.timeSeconds);
    const mistakePenalty = validatedData.mistakes * 50;
    const hintPenalty = validatedData.hintsUsed * 100;
    const difficultyMultiplier = difficultyMultipliers[validatedData.difficulty];

    const score = Math.floor(
      (baseScore + timeBonus - mistakePenalty - hintPenalty) * difficultyMultiplier
    );

    const { error: insertError } = await supabase.from('games').insert({
      user_id: user.id,
      difficulty: validatedData.difficulty,
      level: validatedData.level,
      time_seconds: validatedData.timeSeconds,
      mistakes: validatedData.mistakes,
      hints_used: validatedData.hintsUsed,
      score: Math.max(0, score),
    });

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save score' },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabase.rpc('increment_user_stats', {
      p_user_id: user.id,
      p_score: Math.max(0, score),
    });

    if (updateError) {
      console.error('Stats update error:', updateError);
    }

    return NextResponse.json({
      success: true,
      score: Math.max(0, score),
    });
  } catch (error) {
    console.error('Score submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);

    let query = supabase
      .from('profiles')
      .select('id, username, city, level, total_score, games_played, games_won')
      .order('total_score', { ascending: false })
      .limit(limit);

    if (city) {
      const sanitizedCity = DOMPurify.sanitize(city);
      query = query.eq('city', sanitizedCity);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leaderboard' },
        { status: 500 }
      );
    }

    const sanitizedData = data.map((profile) => ({
      ...profile,
      username: DOMPurify.sanitize(profile.username),
      city: profile.city ? DOMPurify.sanitize(profile.city) : null,
    }));

    return NextResponse.json({ leaderboard: sanitizedData });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
