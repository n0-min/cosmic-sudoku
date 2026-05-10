import { create } from 'zustand';
import type { Skin } from '@/types/sudoku';

interface UserStore {
  cosmicCoins: number;
  currentSkin: string;
  ownedSkins: string[];
  setCosmicCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  setCurrentSkin: (skinId: string) => void;
  addOwnedSkin: (skinId: string) => void;
  setOwnedSkins: (skins: string[]) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  cosmicCoins: 0,
  currentSkin: 'default',
  ownedSkins: ['default'],

  setCosmicCoins: (coins: number) => set({ cosmicCoins: coins }),

  addCoins: (amount: number) =>
    set((state) => ({ cosmicCoins: state.cosmicCoins + amount })),

  setCurrentSkin: (skinId: string) => set({ currentSkin: skinId }),

  addOwnedSkin: (skinId: string) =>
    set((state) => ({
      ownedSkins: [...new Set([...state.ownedSkins, skinId])],
    })),

  setOwnedSkins: (skins: string[]) => set({ ownedSkins: skins }),
}));
