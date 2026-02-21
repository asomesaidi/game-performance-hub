import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Game, PerformanceResult } from '@/types/game';
import { getGenreCover } from '@/lib/genreCovers';

interface GameCardProps {
  game: Game;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  performanceResult?: PerformanceResult;
}

const performanceColorMap: Record<string, string> = {
  success: 'bg-performance-ultra',
  info: 'bg-performance-high',
  warning: 'bg-performance-medium',
  destructive: 'bg-performance-low',
};

export const GameCard = memo(({ game, index, isFavorite, onToggleFavorite, performanceResult }: GameCardProps) => {
  const cover = getGenreCover(game.genre);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.5) }}
      className="group"
    >
      <Link to={`/game/${game.id}`} className="block">
        <div className="glass-card overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_hsla(190,100%,50%,0.15)]">
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={cover}
              alt={game.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />

            {/* Game name overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-bold text-foreground text-sm leading-tight drop-shadow-lg">{game.name}</h3>
            </div>

            {/* Favorite button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(game.id);
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm transition-colors hover:bg-background/80 z-10"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-foreground/60'}`}
              />
            </button>

            {/* Genre badge */}
            <span className="absolute top-3 left-3 px-2 py-1 text-[10px] font-semibold rounded-md bg-background/60 backdrop-blur-sm text-primary uppercase tracking-wider">
              {game.genre}
            </span>

            {/* Performance badge */}
            {performanceResult && (
              <div className="absolute bottom-12 left-3 right-3 px-3 py-2 rounded-lg backdrop-blur-sm bg-background/70 border border-border/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${performanceColorMap[performanceResult.color] || 'bg-muted'}`} />
                  <span className="text-[11px] font-medium text-foreground truncate">{performanceResult.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="px-3 py-2.5 flex items-center gap-2 text-[11px] text-muted-foreground">
            <HardDrive className="w-3 h-3 flex-shrink-0" />
            <span>{game.storageGB} GB</span>
            <span className="text-border">•</span>
            <span>Min {game.minRAM}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

GameCard.displayName = 'GameCard';
