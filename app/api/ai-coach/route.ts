import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Grid } from '@/types/sudoku';

const AICoachRequestSchema = z.object({
  puzzle: z.array(z.array(z.number().min(1).max(9).nullable())),
  currentGrid: z.array(z.array(z.number().min(1).max(9).nullable())),
  selectedCell: z.object({
    row: z.number().min(0).max(8),
    col: z.number().min(0).max(8),
  }).optional(),
});

function analyzeSudokuGrid(puzzle: Grid, currentGrid: Grid, selectedCell?: { row: number; col: number }) {
  const hints: string[] = [];

  if (selectedCell) {
    const { row, col } = selectedCell;

    const usedInRow = new Set(currentGrid[row].filter(n => n !== null));
    const usedInCol = new Set(currentGrid.map(r => r[col]).filter(n => n !== null));

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    const usedInBox = new Set<number>();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const val = currentGrid[boxRow + i][boxCol + j];
        if (val !== null) usedInBox.add(val);
      }
    }

    const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
      n => !usedInRow.has(n) && !usedInCol.has(n) && !usedInBox.has(n)
    );

    if (possibleNumbers.length === 1) {
      hints.push(`This cell has only one possible value: ${possibleNumbers[0]}. This is called a "Naked Single" - when a cell can only contain one number based on the constraints.`);
    } else if (possibleNumbers.length > 1) {
      hints.push(`This cell can be ${possibleNumbers.join(', ')}. Look for additional constraints in the row, column, or 3x3 box to narrow it down.`);
    }

    hints.push(`Numbers already used in this row: ${Array.from(usedInRow).sort().join(', ') || 'none'}`);
    hints.push(`Numbers already used in this column: ${Array.from(usedInCol).sort().join(', ') || 'none'}`);
    hints.push(`Numbers already used in this 3x3 box: ${Array.from(usedInBox).sort().join(', ') || 'none'}`);
  }

  let emptyCells = 0;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (currentGrid[row][col] === null && puzzle[row][col] === null) {
        emptyCells++;
      }
    }
  }

  hints.push(`You have ${emptyCells} cells remaining to fill.`);

  return hints.join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = AICoachRequestSchema.parse(body);

    const analysis = analyzeSudokuGrid(
      validatedData.puzzle,
      validatedData.currentGrid,
      validatedData.selectedCell
    );

    const prompt = `You are an expert Sudoku coach. A player is working on a puzzle and needs guidance. Here's the analysis:

${analysis}

Provide helpful strategic advice without giving away the exact answer. Explain Sudoku techniques like:
- Naked Singles (only one possible number for a cell)
- Hidden Singles (a number can only go in one place in a row/column/box)
- Naked Pairs/Triples
- Pointing Pairs
- Box/Line Reduction

Keep your response concise (2-3 sentences) and encouraging.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', await response.text());
      return NextResponse.json(
        { hint: analysis },
        { status: 200 }
      );
    }

    const data = await response.json();
    const aiHint = data.choices[0]?.message?.content || analysis;

    return NextResponse.json({
      hint: aiHint,
      analysis,
    });
  } catch (error) {
    console.error('AI Coach error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get AI hint' },
      { status: 500 }
    );
  }
}
