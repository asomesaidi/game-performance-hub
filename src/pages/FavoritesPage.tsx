import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ArrowLeft } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { GameCard } from '@/components/GameCard';
import { useGames, useFavorites, useUserSpecs } from '@/hooks/useGames';
import { evaluatePerformance } from '@/data/performanceLogic';
import type { UserSpecs } from '@/types/game';

const FavoritesPage = () => {
  const { games } = useGames();
  const { favorites, toggle: toggleFav } = useFavorites();
  const { specs } = useUserSpecs();

  const favoriteGames = useMemo(
    () => games.filter(g => favorites.has(g.id)),
    [games, favorites],
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>My Favorites – GameSpec AI</title>
        <meta name="description" content="Your saved favorite games on GameSpec AI." />
      </Helmet>

      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <img src={logoImg} alt="GameSpec AI" className="w-8 h-8 rounded-lg" />
            <h1 className="text-lg font-bold text-foreground">My Favorites</h1>
          </div>
          <span className="text-sm text-muted-foreground">{favoriteGames.length} games</span>
        </div>
      </header>

      <main className="container py-8">
        {favoriteGames.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No favorites yet</p>
            <Link to="/" className="text-primary text-sm hover:underline">Browse games</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteGames.map((game, i) => (
              <GameCard
                key={game.id}
                game={game}
                index={i}
                isFavorite={true}
                onToggleFavorite={toggleFav}
                performanceResult={specs ? evaluatePerformance(game, specs as UserSpecs) : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
