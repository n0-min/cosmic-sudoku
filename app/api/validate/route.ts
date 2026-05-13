import { NextRequest, NextResponse } from 'next/server';
import { ValidateRequestSchema } from '@/lib/validation/schemas';
import { SudokuGenerator } from '@/lib/sudoku/generator';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = ValidateRequestSchema.parse(body);

    const { currentGrid, solution, puzzle, startTime, elapsedTime } = validatedData;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] !== null && currentGrid[row][col] !== puzzle[row][col]) {
          return NextResponse.json(
            { error: 'Tampering detected: Given cells were modified' },
            { status: 400 }
          );
        }
      }
    }

    const timeDiff = Date.now() - startTime;
    const reportedTime = elapsedTime;

    if (Math.abs(timeDiff - reportedTime) > 5000) {
      return NextResponse.json(
        { error: 'Timer manipulation detected' },
        { status: 400 }
      );
    }

    const validation = SudokuGenerator.validate(currentGrid, solution);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          isValid: false,
          isComplete: false,
          errors: validation.errors,
        },
        { status: 200 }
      );
    }

    const difficultyMultipliers = {
      easy: 1,
      medium: 1.5,
      hard: 2,
      expert: 3,
    };

    const baseScore = 1000;
    const timeBonus = Math.max(0, 1200 - Math.floor(elapsedTime / 1000));
    const mistakePenalty = validatedData.mistakes * 50;
    const hintPenalty = validatedData.hintsUsed * 100;
    const difficultyMultiplier = difficultyMultipliers[validatedData.difficulty];

    const score = Math.floor(
      (baseScore + timeBonus - mistakePenalty - hintPenalty) * difficultyMultiplier
    );

    return NextResponse.json({
      isValid: true,
      isComplete: validation.isComplete,
      score: Math.max(0, score),
      errors: [],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
