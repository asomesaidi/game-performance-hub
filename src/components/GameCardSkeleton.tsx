import { memo } from 'react';

export const GameCardSkeleton = memo(() => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="aspect-[3/4] bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  </div>
));

GameCardSkeleton.displayName = 'GameCardSkeleton';
