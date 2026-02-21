import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onOpenFilter: () => void;
  hasActiveSpecs: boolean;
}

export function SearchBar({ search, onSearchChange, onOpenFilter, hasActiveSpecs }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search games..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl bg-secondary/60 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 backdrop-blur-sm transition-all text-sm"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>
      <button
        onClick={onOpenFilter}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all text-sm font-medium ${
          hasActiveSpecs
            ? 'bg-primary/20 border-primary/50 text-primary'
            : 'bg-secondary/60 border-border/50 text-foreground hover:bg-secondary'
        }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Check My PC</span>
      </button>
    </div>
  );
}
