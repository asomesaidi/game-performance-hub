import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, Cpu, Monitor, MemoryStick, HardDrive, Heart, Gamepad2, Share2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useGames, useUserSpecs, useFavorites } from '@/hooks/useGames';
import { getGameById } from '@/data/gameParser';
import { evaluatePerformance, getPerformanceBgClass } from '@/data/performanceLogic';
import { PerformanceChart } from '@/components/PerformanceChart';
import { getGameCover, getGenreCover } from '@/lib/genreCovers';
import { getSteamHeaderUrl } from '@/lib/steamAppIds';
import type { UserSpecs, Game } from '@/types/game';

function RelatedGames({ currentGame, games }: { currentGame: Game; games: Game[] }) {
  const related = useMemo(
    () => games.filter(g => g.genre === currentGame.genre && g.id !== currentGame.id).slice(0, 4),
    [currentGame, games],
  );
  if (related.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Similar Games</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((g) => (
          <Link key={g.id} to={`/game/${g.id}`} className="glass-card overflow-hidden group hover:scale-[1.02] transition-transform">
            <div className="relative aspect-video overflow-hidden">
              <img src={getGameCover(g.name, g.genre)} alt={g.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
            <div className="p-2">
              <p className="text-xs font-medium text-foreground truncate">{g.name}</p>
              <p className="text-[10px] text-muted-foreground">{g.storageGB} GB • {g.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { games, loading } = useGames();
  const { specs } = useUserSpecs();
  const { isFavorite, toggle } = useFavorites();

  const game = useMemo(() => (id ? getGameById(games, id) : undefined), [games, id]);
  const performance = useMemo(
    () => (game && specs ? evaluatePerformance(game, specs as UserSpecs) : null),
    [game, specs],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Gamepad2 className="w-16 h-16 text-muted-foreground" />
        <p className="text-muted-foreground">Game not found</p>
        <Link to="/" className="text-primary text-sm hover:underline">Back to Home</Link>
      </div>
    );
  }

  const cover = getSteamHeaderUrl(game.name) || getGameCover(game.name, game.genre);
  const pageTitle = `${game.name} – System Requirements | GameSpec AI`;
  const pageDescription = `Can your PC run ${game.name}? Check minimum and recommended requirements. ${game.genre} game requiring ${game.storageGB}GB storage, ${game.minRAM} RAM minimum.`;

  const specRows = [
    { label: 'CPU', min: game.minCPU, rec: game.recCPU, icon: Cpu },
    { label: 'GPU', min: game.minGPU, rec: game.recGPU, icon: Monitor },
    { label: 'RAM', min: game.minRAM, rec: game.recRAM, icon: MemoryStick },
    { label: 'Storage', min: game.minStorage, rec: game.recStorage, icon: HardDrive },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.name,
    "genre": game.genre,
    "operatingSystem": game.minOS,
    "storageRequirements": `${game.storageGB} GB`,
    "memoryRequirements": game.minRAM,
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`/game/${game.id}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <div className="relative h-64 sm:h-80 md:h-[420px] overflow-hidden">
        <img src={cover} alt={game.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

        {/* Top bar */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background/70 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.share?.({ title: game.name, url: window.location.href }).catch(() => {});
              }}
              className="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5 text-foreground/60" />
            </button>
            <button
              onClick={() => toggle(game.id)}
              className="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all"
            >
              <Heart className={`w-5 h-5 ${isFavorite(game.id) ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-0 right-0 px-4 md:px-0">
          <div className="container">
            <span className="inline-block px-3 py-1 rounded-md bg-primary/15 text-primary text-xs font-semibold mb-3 uppercase tracking-wider">
              {game.genre}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground drop-shadow-lg">{game.name}</h1>
          </div>
        </div>
      </div>

      <main className="container py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Quick stats */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 glass-card px-4 py-2"><HardDrive className="w-4 h-4 text-primary" /> {game.storageGB} GB</span>
            <span className="flex items-center gap-1.5 glass-card px-4 py-2"><MemoryStick className="w-4 h-4 text-primary" /> Min {game.minRAM}</span>
            <span className="flex items-center gap-1.5 glass-card px-4 py-2"><Monitor className="w-4 h-4 text-primary" /> {game.minOS}</span>
          </div>

          {/* Performance Banner */}
          {performance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`glass-card p-6 border-l-4 ${
                performance.color === 'success' ? 'border-l-success' :
                performance.color === 'info' ? 'border-l-info' :
                performance.color === 'warning' ? 'border-l-warning' :
                'border-l-destructive'
              }`}
            >
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Performance on Your PC</h3>
              <div className="flex items-start gap-4">
                <div className={`w-4 h-4 rounded-full mt-0.5 flex-shrink-0 ${getPerformanceBgClass(performance.level)}`} />
                <div>
                  <p className="text-lg font-bold text-foreground">{performance.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{performance.description}</p>
                  {performance.fps && (
                    <span className="inline-block mt-2 px-3 py-1 rounded-md bg-primary/10 text-xs font-mono text-primary">{performance.fps}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {!specs && (
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">Enter your PC specs to see performance results</p>
              <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                <ExternalLink className="w-4 h-4" /> Check My PC
              </Link>
            </div>
          )}

          {/* Requirements */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-warning mb-5 uppercase tracking-wider">Minimum Requirements</h3>
              <div className="space-y-5">
                {specRows.map((r) => (
                  <div key={r.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                      <r.icon className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{r.label}</span>
                      <p className="text-sm text-foreground mt-0.5">{r.min || 'N/A'}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">OS</span>
                    <p className="text-sm text-foreground mt-0.5">{game.minOS || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-success mb-5 uppercase tracking-wider">Recommended Requirements</h3>
              <div className="space-y-5">
                {specRows.map((r) => (
                  <div key={r.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                      <r.icon className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{r.label}</span>
                      <p className="text-sm text-foreground mt-0.5">{r.rec || 'N/A'}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">OS</span>
                    <p className="text-sm text-foreground mt-0.5">{game.recOS || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {performance && (
            <PerformanceChart result={performance} gameName={game.name} />
          )}

          {/* Related Games */}
          <RelatedGames currentGame={game} games={games} />
        </motion.div>
      </main>
    </div>
  );
}
