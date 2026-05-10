// Stellar Calculus - Material Reality Skins
// Each skin is a distinct material reality with unique visual physics

export interface SkinTheme {
  id: string;
  name: string;
  description: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  // Visual Properties
  background: {
    base: string;
    gradient: string[];
    overlay?: string;
  };

  grid: {
    border: string;
    borderGlow: string;
    cellBg: string;
    cellBgHover: string;
    selectedCell: string;
    selectedGlow: string;
  };

  numbers: {
    given: string;
    user: string;
    selected: string;
  };

  effects: {
    type: 'radial' | 'distortion' | 'rays' | 'bands' | 'interference' | 'minimal';
    intensity: 'soft' | 'medium' | 'intense';
    animation?: string;
  };
}

export const MATERIAL_SKINS: SkinTheme[] = [
  // 1. NEBULA - Diffuse and gaseous (radial gradients, soft glow)
  {
    id: 'nebula',
    name: 'Nebula Dream',
    description: 'Diffuse cosmic clouds with radial gradients and soft luminescence',
    price: 500,
    rarity: 'rare',
    background: {
      base: '#1A0B2E',
      gradient: ['#1A0B2E', '#2D1B4E', '#4A2C6D', '#6B3FA0'],
      overlay: 'radial-gradient(circle at 30% 40%, rgba(236, 72, 153, 0.3), transparent 50%), radial-gradient(circle at 70% 60%, rgba(168, 85, 247, 0.2), transparent 50%)',
    },
    grid: {
      border: '#A855F7',
      borderGlow: 'rgba(168, 85, 247, 0.4)',
      cellBg: 'rgba(26, 11, 46, 0.6)',
      cellBgHover: 'rgba(168, 85, 247, 0.3)',
      selectedCell: 'rgba(236, 72, 153, 0.4)',
      selectedGlow: '0 0 40px rgba(236, 72, 153, 0.6), inset 0 0 20px rgba(168, 85, 247, 0.3)',
    },
    numbers: {
      given: '#EC4899',
      user: '#F0ABFC',
      selected: '#FFFFFF',
    },
    effects: {
      type: 'radial',
      intensity: 'soft',
      animation: 'nebula-drift',
    },
  },

  // 2. BLACK HOLE - Dense and warped (distortion grids, pure black absorption)
  {
    id: 'blackhole',
    name: 'Black Hole',
    description: 'Dense gravitational warping with event horizon distortion',
    price: 1000,
    rarity: 'epic',
    background: {
      base: '#000000',
      gradient: ['#000000', '#0A0A0A', '#1A1A2E', '#16213E'],
      overlay: 'radial-gradient(circle at 50% 50%, rgba(30, 27, 75, 0.4) 0%, transparent 60%)',
    },
    grid: {
      border: '#1E1B4B',
      borderGlow: 'rgba(30, 27, 75, 0.8)',
      cellBg: 'rgba(0, 0, 0, 0.9)',
      cellBgHover: 'rgba(30, 27, 75, 0.5)',
      selectedCell: 'rgba(49, 46, 129, 0.6)',
      selectedGlow: '0 0 30px rgba(30, 27, 75, 0.9), inset 0 0 30px rgba(0, 0, 0, 0.8)',
    },
    numbers: {
      given: '#6366F1',
      user: '#818CF8',
      selected: '#C7D2FE',
    },
    effects: {
      type: 'distortion',
      intensity: 'intense',
      animation: 'gravitational-warp',
    },
  },

  // 3. SUPERNOVA - Violent light (sharp rays, explosive aureoles)
  {
    id: 'supernova',
    name: 'Supernova Burst',
    description: 'Explosive stellar energy with sharp rays and violent light',
    price: 2000,
    rarity: 'legendary',
    background: {
      base: '#1A0F0A',
      gradient: ['#1A0F0A', '#3D1F0F', '#6B2F1A', '#B4451A'],
      overlay: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.4), rgba(239, 68, 68, 0.3) 40%, transparent 70%)',
    },
    grid: {
      border: '#F59E0B',
      borderGlow: 'rgba(249, 115, 22, 0.8)',
      cellBg: 'rgba(26, 15, 10, 0.7)',
      cellBgHover: 'rgba(249, 115, 22, 0.4)',
      selectedCell: 'rgba(239, 68, 68, 0.5)',
      selectedGlow: '0 0 50px rgba(249, 115, 22, 0.8), 0 0 80px rgba(239, 68, 68, 0.4)',
    },
    numbers: {
      given: '#F59E0B',
      user: '#FCD34D',
      selected: '#FFFFFF',
    },
    effects: {
      type: 'rays',
      intensity: 'intense',
      animation: 'explosive-pulse',
    },
  },

  // 4. AURORA - Liquid iridescent (shifting horizontal bands)
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    description: 'Liquid iridescent waves with shifting horizontal bands',
    price: 750,
    rarity: 'rare',
    background: {
      base: '#0A1F1F',
      gradient: ['#0A1F1F', '#0F3A3A', '#14524F', '#1A6B66'],
      overlay: 'linear-gradient(180deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.3) 50%, rgba(59, 130, 246, 0.2) 100%)',
    },
    grid: {
      border: '#10B981',
      borderGlow: 'rgba(16, 185, 129, 0.5)',
      cellBg: 'rgba(10, 31, 31, 0.6)',
      cellBgHover: 'rgba(6, 182, 212, 0.3)',
      selectedCell: 'rgba(59, 130, 246, 0.4)',
      selectedGlow: '0 0 35px rgba(6, 182, 212, 0.6), inset 0 0 20px rgba(16, 185, 129, 0.3)',
    },
    numbers: {
      given: '#06B6D4',
      user: '#67E8F9',
      selected: '#FFFFFF',
    },
    effects: {
      type: 'bands',
      intensity: 'medium',
      animation: 'aurora-wave',
    },
  },

  // 5. QUANTUM - Crystalline (grid interference patterns, green phosphor)
  {
    id: 'quantum',
    name: 'Quantum Grid',
    description: 'Crystalline interference patterns with green phosphor glow',
    price: 1500,
    rarity: 'epic',
    background: {
      base: '#0A1A0A',
      gradient: ['#0A1A0A', '#0F2F0F', '#14451A', '#1A5A2A'],
      overlay: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(34, 197, 94, 0.03) 2px, rgba(34, 197, 94, 0.03) 4px)',
    },
    grid: {
      border: '#22C55E',
      borderGlow: 'rgba(34, 197, 94, 0.6)',
      cellBg: 'rgba(10, 26, 10, 0.8)',
      cellBgHover: 'rgba(34, 197, 94, 0.2)',
      selectedCell: 'rgba(74, 222, 128, 0.4)',
      selectedGlow: '0 0 30px rgba(34, 197, 94, 0.7), inset 0 0 15px rgba(74, 222, 128, 0.3)',
    },
    numbers: {
      given: '#22C55E',
      user: '#4ADE80',
      selected: '#DCFCE7',
    },
    effects: {
      type: 'interference',
      intensity: 'medium',
      animation: 'quantum-flicker',
    },
  },

  // 6. VOID - Ceremonial silence (hairline grids on absolute darkness)
  {
    id: 'void',
    name: 'Void Ceremony',
    description: 'Ceremonial silence with hairline grids on absolute darkness',
    price: 2500,
    rarity: 'legendary',
    background: {
      base: '#000000',
      gradient: ['#000000', '#050505', '#0A0A0A'],
      overlay: 'none',
    },
    grid: {
      border: '#1F1F1F',
      borderGlow: 'rgba(255, 255, 255, 0.1)',
      cellBg: 'rgba(0, 0, 0, 0.95)',
      cellBgHover: 'rgba(31, 31, 31, 0.5)',
      selectedCell: 'rgba(63, 63, 63, 0.6)',
      selectedGlow: '0 0 20px rgba(255, 255, 255, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.9)',
    },
    numbers: {
      given: '#9CA3AF',
      user: '#D1D5DB',
      selected: '#FFFFFF',
    },
    effects: {
      type: 'minimal',
      intensity: 'soft',
      animation: 'void-breath',
    },
  },
];

// Default skin (Classic - free)
export const DEFAULT_SKIN: SkinTheme = {
  id: 'default',
  name: 'Classic',
  description: 'The original Stellar Calculus theme',
  price: 0,
  rarity: 'common',
  background: {
    base: '#0A0E1A',
    gradient: ['#0A0E1A', '#1A2744', '#0A0E1A'],
  },
  grid: {
    border: '#8B5CF6',
    borderGlow: 'rgba(139, 92, 246, 0.4)',
    cellBg: 'rgba(10, 14, 26, 0.4)',
    cellBgHover: 'rgba(139, 92, 246, 0.3)',
    selectedCell: 'rgba(139, 92, 246, 0.4)',
    selectedGlow: '0 0 30px rgba(0, 245, 255, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3)',
  },
  numbers: {
    given: '#00F5FF',
    user: '#FFFFFF',
    selected: '#FFFFFF',
  },
  effects: {
    type: 'radial',
    intensity: 'soft',
  },
};

export function getSkinById(id: string): SkinTheme {
  if (id === 'default') return DEFAULT_SKIN;
  return MATERIAL_SKINS.find(skin => skin.id === id) || DEFAULT_SKIN;
}

export function getAllSkins(): SkinTheme[] {
  return [DEFAULT_SKIN, ...MATERIAL_SKINS];
}
