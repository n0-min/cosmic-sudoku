import type { Difficulty } from '@/types/sudoku';

export interface CosmicBackground {
  name: string;
  gradient: string;
  stars: string;
  planet?: string;
  animation: string;
}

export const COSMIC_BACKGROUNDS: Record<Difficulty, CosmicBackground> = {
  easy: {
    name: 'Earth',
    gradient: 'from-blue-900 via-green-800 to-blue-900',
    stars: 'opacity-30',
    planet: '🌍',
    animation: 'animate-pulse-slow',
  },
  medium: {
    name: 'Moon',
    gradient: 'from-gray-900 via-slate-800 to-gray-900',
    stars: 'opacity-50',
    planet: '🌙',
    animation: 'animate-float',
  },
  hard: {
    name: 'Mars',
    gradient: 'from-red-950 via-orange-900 to-red-950',
    stars: 'opacity-60',
    planet: '🔴',
    animation: 'animate-spin-slow',
  },
  expert: {
    name: 'Solar System',
    gradient: 'from-purple-950 via-indigo-900 to-black',
    stars: 'opacity-80',
    planet: '🌌',
    animation: 'animate-twinkle',
  },
};

export function getBackgroundForDifficulty(difficulty: Difficulty): CosmicBackground {
  return COSMIC_BACKGROUNDS[difficulty];
}
