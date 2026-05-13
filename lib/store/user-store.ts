import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createBrowserClient } from '@supabase/ssr';
import type { Skin } from '@/types/sudoku';

interface UserStore {
  cosmicCoins: number;
  currentSkin: string;
  ownedSkins: string[];
  userId: string | null;
  setUserId: (id: string | null) => void;
  setCosmicCoins: (coins: number) => void;
  addCoins: (amount: number) => void;
  setCurrentSkin: (skinId: string) => void;
  addOwnedSkin: (skinId: string) => void;
  setOwnedSkins: (skins: string[]) => void;
  resetUserData: () => void;
  loadUserData: (coins: number, skin: string, ownedSkins: string[]) => void;
}

const defaultState = {
  cosmicCoins: 0,
  currentSkin: 'default',
  ownedSkins: ['default'],
  userId: null,
};

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const updateDatabase = async (userId: string | null, data: any) => {
  if (!userId) {
    console.warn('Cannot update database: userId is null', data);
    return;
  }

  try {
    console.log('Updating database:', { userId, data });
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) {
      console.error('Database update error:', error);
    } else {
      console.log('Database updated successfully');
    }
  } catch (error) {
    console.error('Failed to update database:', error);
  }
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setUserId: (id: string | null) => set({ userId: id }),

      setCosmicCoins: (coins: number) => {
        set({ cosmicCoins: coins });
        const userId = get().userId;
        updateDatabase(userId, { cosmic_coins: coins });
      },

      addCoins: (amount: number) => {
        const newCoins = get().cosmicCoins + amount;
        set({ cosmicCoins: newCoins });
        const userId = get().userId;
        updateDatabase(userId, { cosmic_coins: newCoins });
      },

      setCurrentSkin: (skinId: string) => {
        set({ currentSkin: skinId });
        const userId = get().userId;
        updateDatabase(userId, { current_skin: skinId });
      },

      addOwnedSkin: (skinId: string) => {
        const newOwnedSkins = [...new Set([...get().ownedSkins, skinId])];
        set({ ownedSkins: newOwnedSkins });
        const userId = get().userId;
        updateDatabase(userId, { owned_skins: newOwnedSkins });
      },

      setOwnedSkins: (skins: string[]) => {
        set({ ownedSkins: skins });
        const userId = get().userId;
        updateDatabase(userId, { owned_skins: skins });
      },

      resetUserData: () => set(defaultState),

      loadUserData: (coins: number, skin: string, ownedSkins: string[]) =>
        set({
          cosmicCoins: coins,
          currentSkin: skin,
          ownedSkins: ownedSkins.length > 0 ? ownedSkins : ['default'],
        }),
    }),
    {
      name: 'cosmic-sudoku-user-storage',
      partialize: (state) => ({
        cosmicCoins: state.cosmicCoins,
        currentSkin: state.currentSkin,
        ownedSkins: state.ownedSkins,
      }),
    }
  )
);
