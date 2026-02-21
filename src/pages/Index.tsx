import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Monitor, MemoryStick, HardDrive, Gamepad2, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { GameCard } from '@/components/GameCard';
import { GameCardSkeleton } from '@/components/GameCardSkeleton';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { useGames, useFilteredGames, useInfiniteScroll, useFavorites, useUserSpecs } from '@/hooks/useGames';
import { getUniqueGenres } from '@/data/gameParser';
import { evaluatePerformance } from '@/data/performanceLogic';
import type { OptionalFilters, UserSpecs } from '@/types/game';

const Index = () => {
  const { games, loading } = useGames();
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [optionalFilters, setOptionalFilters] = useState<OptionalFilters>({});
  const { specs, save: saveSpecs, clear: clearSpecs } = useUserSpecs();
  const { favorites, toggle: toggleFav, isFavorite } = useFavorites();

  const genres = useMemo(() => getUniqueGenres(games), [games]);

  const filtered = useFilteredGames(
    games,
    search,
    optionalFilters.genre || '',
    optionalFilters.minSize,
    optionalFilters.maxSize,
  );

  const { visibleCount, loaderRef, hasMore } = useInfiniteScroll(filtered.length, 24);
  const visibleGames = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  // Performance results cache
  const performanceMap = useMemo(() => {
    if (!specs) return new Map();
    const map = new Map();
    for (const game of visibleGames) {
      map.set(game.id, evaluatePerformance(game, specs as UserSpecs, optionalFilters));
    }
    return map;
  }, [visibleGames, specs, optionalFilters]);

  // Trending = first 8 games
  const trendingGames = useMemo(() => games.slice(0, 8), [games]);

  // Top for your PC
  const topForPC = useMemo(() => {
    if (!specs) return [];
    return games
      .map(g => ({ game: g, result: evaluatePerformance(g, specs as UserSpecs) }))
      .filter(r => r.result.level === 'ultra' || r.result.level === 'high')
      .slice(0, 8)
      .map(r => r.game);
  }, [games, specs]);

  const favoriteGames = useMemo(
    () => games.filter(g => favorites.has(g.id)),
    [games, favorites],
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">GameSpec AI</h1>
                <p className="text-xs text-muted-foreground">Can My PC Run It?</p>
              </div>
            </div>
            {specs && (
              <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Cpu className="w-3 h-3" /> {(specs as UserSpecs).cpu}</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {(specs as UserSpecs).gpu}</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1"><MemoryStick className="w-3 h-3" /> {(specs as UserSpecs).ram}GB</span>
              </div>
            )}
          </div>
          <SearchBar
            search={search}
            onSearchChange={setSearch}
            onOpenFilter={() => setFilterOpen(true)}
            hasActiveSpecs={!!specs}
          />
        </div>
      </header>

      <main className="container py-8 space-y-12">
        {/* Top for Your PC section */}
        {specs && topForPC.length > 0 && !search && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Top Games For Your PC</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {topForPC.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i}
                  isFavorite={isFavorite(game.id)}
                  onToggleFavorite={toggleFav}
                  performanceResult={evaluatePerformance(game, specs as UserSpecs)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Trending */}
        {!search && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Trending Games</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <GameCardSkeleton key={i} />)
                : trendingGames.map((game, i) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      index={i}
                      isFavorite={isFavorite(game.id)}
                      onToggleFavorite={toggleFav}
                      performanceResult={performanceMap.get(game.id)}
                    />
                  ))
              }
            </div>
          </section>
        )}

        {/* Favorites */}
        {favoriteGames.length > 0 && !search && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Your Favorites</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {favoriteGames.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={i}
                  isFavorite={true}
                  onToggleFavorite={toggleFav}
                  performanceResult={performanceMap.get(game.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Games */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-foreground">
              {search ? `Results for "${search}"` : 'All Games'}
            </h2>
            <span className="text-xs text-muted-foreground">{filtered.length} games</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {Array.from({ length: 24 }).map((_, i) => <GameCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No games found</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {visibleGames.map((game, i) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    index={i}
                    isFavorite={isFavorite(game.id)}
                    onToggleFavorite={toggleFav}
                    performanceResult={performanceMap.get(game.id)}
                  />
                ))}
              </div>
              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-8">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Filter Panel */}
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        specs={specs}
        onSaveSpecs={saveSpecs}
        onClearSpecs={clearSpecs}
        optionalFilters={optionalFilters}
        onOptionalFiltersChange={setOptionalFilters}
        genres={genres}
      />
    </div>
  );
};

export default Index;
