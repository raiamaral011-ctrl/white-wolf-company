'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '@/types';
import { createClient } from '@/lib/supabase/browser';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
  loading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_FAVORITES_KEY = 'white_wolf_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const syncedRef = useRef<boolean>(false);

  // Sync favorites with server
  const loadFavorites = useCallback(async (isAuth: boolean) => {
    if (isAuth) {
      try {
        const res = await fetch('/api/favorites');
        if (res.ok) {
          const data = await res.json();
          const serverIds: string[] = data.favoriteIds || [];

          // Merge with any pre-existing local storage favorites
          let localIds: string[] = [];
          try {
            const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
            if (saved) localIds = JSON.parse(saved);
          } catch {}

          const toSync = localIds.filter((id) => !serverIds.includes(id));
          if (toSync.length > 0 && !syncedRef.current) {
            syncedRef.current = true;
            await fetch('/api/favorites', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ productIds: toSync }),
            });
            const merged = Array.from(new Set([...serverIds, ...toSync]));
            setFavoriteIds(merged);
            localStorage.removeItem(LOCAL_FAVORITES_KEY);
            return;
          }

          setFavoriteIds(serverIds);
          return;
        }
      } catch (err) {
        console.error('Error fetching favorites from server:', err);
      }
    }

    // Guest fallback: load from localStorage
    try {
      const saved = localStorage.getItem(LOCAL_FAVORITES_KEY);
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      } else {
        setFavoriteIds([]);
      }
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const authed = !!session?.user;
        if (isMounted) {
          setIsAuthenticated(authed);
          await loadFavorites(authed);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          await loadFavorites(false);
          setLoading(false);
        }
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authed = !!session?.user;
      if (isMounted) {
        setIsAuthenticated(authed);
        if (event === 'SIGNED_OUT') {
          syncedRef.current = false;
          setFavoriteIds([]);
          try {
            localStorage.removeItem(LOCAL_FAVORITES_KEY);
          } catch {}
        } else {
          await loadFavorites(authed);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadFavorites]);

  // Persist guest favorites to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favoriteIds));
      } catch {}
    }
  }, [favoriteIds, isAuthenticated]);

  const toggleFavorite = async (product: Product) => {
    const isCurrentlyFav = favoriteIds.includes(product.id);
    const newFavorites = isCurrentlyFav
      ? favoriteIds.filter((id) => id !== product.id)
      : [...favoriteIds, product.id];

    // Optimistic UI update
    setFavoriteIds(newFavorites);

    if (isAuthenticated) {
      try {
        if (isCurrentlyFav) {
          await fetch(`/api/favorites?productId=${product.id}`, { method: 'DELETE' });
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id }),
          });
        }
      } catch (err) {
        console.error('Failed to sync favorite toggle with server:', err);
        // Rollback on failure
        setFavoriteIds(favoriteIds);
      }
    }
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const refreshFavorites = async () => {
    await loadFavorites(isAuthenticated);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        favoritesCount: favoriteIds.length,
        loading,
        refreshFavorites,
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
