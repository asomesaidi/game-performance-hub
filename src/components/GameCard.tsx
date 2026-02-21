import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Game, PerformanceResult } from '@/types/game';
import { getGameGradient, getGameInitials } from '@/lib/gameUtils';

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
  const [imgError, setImgError] = useState(false);
  const gradient = getGameGradient(game.name);

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
            {imgError ? (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: gradient }}
              >
                <span className="text-3xl font-bold text-foreground/60 select-none">
                  {getGameInitials(game.name)}
                </span>
              </div>
            ) : (
              <img
                src={`https://placehold.co/400x533/1a1a2e/00d4ff?text=${encodeURIComponent(game.name.slice(0, 15))}`}
                alt={game.name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

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
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-md bg-background/50 backdrop-blur-sm text-foreground/80">
              {game.genre}
            </span>

            {/* Performance badge */}
            {performanceResult && (
              <div className={`absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg backdrop-blur-sm bg-background/70 border border-border/50`}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${performanceColorMap[performanceResult.color] || 'bg-muted'}`} />
                  <span className="text-xs font-medium text-foreground truncate">{performanceResult.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-foreground truncate text-sm">{game.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <HardDrive className="w-3 h-3" />
              <span>{game.storageGB} GB</span>
              <span className="text-border">•</span>
              <span>{game.minRAM}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

GameCard.displayName = 'GameCard';
