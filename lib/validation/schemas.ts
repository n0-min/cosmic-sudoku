import { z } from 'zod';

export const GridSchema = z.array(z.array(z.number().min(1).max(9).nullable()));

export const ValidateRequestSchema = z.object({
  puzzle: GridSchema,
  solution: GridSchema,
  currentGrid: GridSchema,
  startTime: z.number(),
  elapsedTime: z.number(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  level: z.number().min(1),
  mistakes: z.number().min(0),
  hintsUsed: z.number().min(0),
});

export const ScoreSubmissionSchema = z.object({
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']),
  level: z.number().min(1),
  timeSeconds: z.number().min(1),
  mistakes: z.number().min(0),
  hintsUsed: z.number().min(0),
  puzzle: GridSchema,
  solution: GridSchema,
  currentGrid: GridSchema,
});

export type ValidateRequest = z.infer<typeof ValidateRequestSchema>;
export type ScoreSubmission = z.infer<typeof ScoreSubmissionSchema>;
