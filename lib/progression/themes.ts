export type ThemeName = 'earth' | 'moon' | 'mars' | 'asteroid' | 'jupiter' | 'saturn' | 'neptune' | 'interstellar';

export interface LevelTheme {
  name: ThemeName;
  displayName: string;
  levelRange: [number, number];
  gradient: string;
  description: string;
}

export const LEVEL_THEMES: LevelTheme[] = [
  {
    name: 'earth',
    displayName: '🌍 Earth',
    levelRange: [1, 10],
    gradient: 'from-blue-900 via-green-900 to-blue-900',
    description: 'Begin your journey on Earth',
  },
  {
    name: 'moon',
    displayName: '🌙 Moon',
    levelRange: [11, 20],
    gradient: 'from-gray-800 via-slate-700 to-gray-800',
    description: 'Explore the lunar surface',
  },
  {
    name: 'mars',
    displayName: '🔴 Mars',
    levelRange: [21, 30],
    gradient: 'from-red-900 via-orange-900 to-red-900',
    description: 'Conquer the red planet',
  },
  {
    name: 'asteroid',
    displayName: '☄️ Asteroid Belt',
    levelRange: [31, 40],
    gradient: 'from-stone-800 via-amber-900 to-stone-800',
    description: 'Navigate the asteroid field',
  },
  {
    name: 'jupiter',
    displayName: '🪐 Jupiter',
    levelRange: [41, 60],
    gradient: 'from-orange-800 via-yellow-700 to-orange-800',
    description: 'Witness the gas giant',
  },
  {
    name: 'saturn',
    displayName: '💫 Saturn',
    levelRange: [61, 80],
    gradient: 'from-yellow-700 via-amber-600 to-yellow-700',
    description: 'Dance with the rings',
  },
  {
    name: 'neptune',
    displayName: '🔵 Neptune',
    levelRange: [81, 100],
    gradient: 'from-blue-800 via-cyan-700 to-blue-800',
    description: 'Dive into the ice giant',
  },
  {
    name: 'interstellar',
    displayName: '✨ Interstellar Space',
    levelRange: [101, Infinity],
    gradient: 'from-purple-900 via-indigo-900 to-purple-900',
    description: 'Journey beyond the solar system',
  },
];

export function getThemeForLevel(level: number): LevelTheme {
  return LEVEL_THEMES.find(
    theme => level >= theme.levelRange[0] && level <= theme.levelRange[1]
  ) || LEVEL_THEMES[LEVEL_THEMES.length - 1];
}

export function getProgressInTheme(level: number): number {
  const theme = getThemeForLevel(level);
  const [start, end] = theme.levelRange;

  if (end === Infinity) return 0;

  return ((level - start) / (end - start + 1)) * 100;
}
