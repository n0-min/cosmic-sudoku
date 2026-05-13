'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { getSkinById } from '@/lib/skins/material-skins';

export function SkinProvider({ children }: { children: React.ReactNode }) {
  const { currentSkin } = useUserStore();
  const skin = getSkinById(currentSkin);

  useEffect(() => {
    // Apply skin CSS variables
    const root = document.documentElement;

    // Background
    root.style.setProperty('--skin-bg-base', skin.background.base);
    root.style.setProperty('--skin-bg-gradient', skin.background.gradient.join(', '));

    // Grid
    root.style.setProperty('--skin-grid-border', skin.grid.border);
    root.style.setProperty('--skin-grid-border-glow', skin.grid.borderGlow);
    root.style.setProperty('--skin-grid-cell-bg', skin.grid.cellBg);
    root.style.setProperty('--skin-grid-cell-hover', skin.grid.cellBgHover);
    root.style.setProperty('--skin-grid-selected', skin.grid.selectedCell);
    root.style.setProperty('--skin-grid-selected-glow', skin.grid.selectedGlow);

    // Numbers
    root.style.setProperty('--skin-number-given', skin.numbers.given);
    root.style.setProperty('--skin-number-user', skin.numbers.user);
    root.style.setProperty('--skin-number-selected', skin.numbers.selected);

    // Apply skin class to body
    document.body.className = document.body.className.replace(/skin-\w+/g, '');
    if (skin.id !== 'default') {
      document.body.classList.add(`skin-${skin.id}`);
    }

    // Apply Void Ceremony global black/white theme
    if (skin.id === 'void') {
      document.body.classList.add('void-theme');
    } else {
      document.body.classList.remove('void-theme');
    }

    // Apply animation class
    if (skin.effects.animation) {
      document.body.classList.add(`animate-${skin.effects.animation}`);
    }

    return () => {
      // Cleanup animation class
      if (skin.effects.animation) {
        document.body.classList.remove(`animate-${skin.effects.animation}`);
      }
    };
  }, [currentSkin, skin]);

  return <>{children}</>;
}
