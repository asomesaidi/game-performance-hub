import { useState, useEffect, useCallback, useRef } from 'react';
import { loadGames } from '@/data/gameParser';
import type { Game } from '@/types/game';

export function useGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGames()
      .then(setGames)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { games, loading, error };
}

export function useFilteredGames(
  games: Game[],
  search: string,
  genre: string,
  minSize?: number,
  maxSize?: number,
) {
  const [filtered, setFiltered] = useState<Game[]>(games);

  useEffect(() => {
    let result = games;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((g) => g.name.toLowerCase().includes(q));
    }
    if (genre) {
      result = result.filter((g) => g.genre === genre);
    }
    if (minSize !== undefined) {
      result = result.filter((g) => g.storageGB >= minSize);
    }
    if (maxSize !== undefined) {
      result = result.filter((g) => g.storageGB <= maxSize);
    }
    setFiltered(result);
  }, [games, search, genre, minSize, maxSize]);

  return filtered;
}

export function useInfiniteScroll(totalItems: number, itemsPerPage = 24) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + itemsPerPage, totalItems));
  }, [totalItems, itemsPerPage]);

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [totalItems, itemsPerPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );
    const el = loaderRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, [loadMore]);

  return { visibleCount, loaderRef, hasMore: visibleCount < totalItems };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('gamespec-favorites');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('gamespec-favorites', JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { favorites, toggle, isFavorite: (id: string) => favorites.has(id) };
}

export function useUserSpecs() {
  const [specs, setSpecs] = useState(() => {
    try {
      const saved = localStorage.getItem('gamespec-specs');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const save = useCallback((s: any) => {
    setSpecs(s);
    localStorage.setItem('gamespec-specs', JSON.stringify(s));
  }, []);

  const clear = useCallback(() => {
    setSpecs(null);
    localStorage.removeItem('gamespec-specs');
  }, []);

  return { specs, save, clear };
}
