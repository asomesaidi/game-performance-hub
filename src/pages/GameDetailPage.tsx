import { useParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, Cpu, Monitor, MemoryStick, HardDrive, Heart, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGames, useUserSpecs, useFavorites } from '@/hooks/useGames';
import { getGameById } from '@/data/gameParser';
import { evaluatePerformance, getPerformanceBgClass } from '@/data/performanceLogic';
import { PerformanceChart } from '@/components/PerformanceChart';
import { getGameGradient, getGameInitials } from '@/lib/gameUtils';
import type { UserSpecs } from '@/types/game';

export default function GameDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { games, loading } = useGames();
  const { specs } = useUserSpecs();
  const { isFavorite, toggle } = useFavorites();
  const [imgError, setImgError] = useState(false);

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

  const gradient = getGameGradient(game.name);

  const specRows = [
    { label: 'CPU', min: game.minCPU, rec: game.recCPU, icon: Cpu },
    { label: 'GPU', min: game.minGPU, rec: game.recGPU, icon: Monitor },
    { label: 'RAM', min: game.minRAM, rec: game.recRAM, icon: MemoryStick },
    { label: 'Storage', min: game.minStorage, rec: game.recStorage, icon: HardDrive },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center" style={{ background: gradient }}>
            <span className="text-6xl font-bold text-foreground/20">{getGameInitials(game.name)}</span>
          </div>
        ) : (
          <img
            src={`https://placehold.co/1200x500/1a1a2e/00d4ff?text=${encodeURIComponent(game.name.slice(0, 20))}`}
            alt={game.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Back & Favorite */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm text-sm font-medium text-foreground hover:bg-background/70 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <button
            onClick={() => toggle(game.id)}
            className="p-2.5 rounded-xl bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all"
          >
            <Heart className={`w-5 h-5 ${isFavorite(game.id) ? 'fill-primary text-primary' : 'text-foreground/60'}`} />
          </button>
        </div>
      </div>

      <main className="container -mt-20 relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Title */}
          <div>
            <span className="inline-block px-3 py-1 rounded-md bg-primary/15 text-primary text-xs font-medium mb-3">
              {game.genre}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{game.name}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><HardDrive className="w-4 h-4" /> {game.storageGB} GB</span>
              <span className="flex items-center gap-1.5"><MemoryStick className="w-4 h-4" /> Min {game.minRAM}</span>
            </div>
          </div>

          {/* Performance Banner */}
          {performance && (
            <div className={`glass-card p-5 border-l-4 ${
              performance.color === 'success' ? 'border-l-success' :
              performance.color === 'info' ? 'border-l-info' :
              performance.color === 'warning' ? 'border-l-warning' :
              'border-l-destructive'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${getPerformanceBgClass(performance.level)}`} />
                <div>
                  <h3 className="font-semibold text-foreground">{performance.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{performance.description}</p>
                  {performance.fps && (
                    <span className="inline-block mt-2 text-xs font-mono text-primary">{performance.fps}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirements */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Minimum */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-warning mb-4">Minimum Requirements</h3>
              <div className="space-y-4">
                {specRows.map((r) => (
                  <div key={r.label} className="flex items-start gap-3">
                    <r.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                      <p className="text-sm text-foreground">{r.min || 'N/A'}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground">OS</span>
                    <p className="text-sm text-foreground">{game.minOS || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-success mb-4">Recommended Requirements</h3>
              <div className="space-y-4">
                {specRows.map((r) => (
                  <div key={r.label} className="flex items-start gap-3">
                    <r.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground">{r.label}</span>
                      <p className="text-sm text-foreground">{r.rec || 'N/A'}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-3">
                  <Monitor className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs text-muted-foreground">OS</span>
                    <p className="text-sm text-foreground">{game.recOS || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          {performance && (
            <PerformanceChart result={performance} gameName={game.name} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
