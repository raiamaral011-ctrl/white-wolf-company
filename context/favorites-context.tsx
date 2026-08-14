'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_FAVORITES_KEY = 'white_wolf_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Fallback
    }
  }, [favoriteIds]);

  const toggleFavorite = (product: Product) => {
    setFavoriteIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        favoritesCount: favoriteIds.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de um FavoritesProvider');
  }
  return context;
}
