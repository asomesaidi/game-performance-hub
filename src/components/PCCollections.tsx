import { useState, useCallback } from 'react';
import { Save, Trash2, Monitor, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserSpecs } from '@/types/game';

interface PCProfile {
  id: string;
  name: string;
  specs: UserSpecs;
}

function loadProfiles(): PCProfile[] {
  try {
    const saved = localStorage.getItem('gamespec-pc-profiles');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
}

function saveProfiles(profiles: PCProfile[]) {
  localStorage.setItem('gamespec-pc-profiles', JSON.stringify(profiles));
}

export function usePCCollections() {
  const [profiles, setProfiles] = useState<PCProfile[]>(loadProfiles);

  const addProfile = useCallback((name: string, specs: UserSpecs) => {
    const newProfile: PCProfile = { id: Date.now().toString(), name, specs };
    const updated = [...profiles, newProfile];
    setProfiles(updated);
    saveProfiles(updated);
    return newProfile;
  }, [profiles]);

  const removeProfile = useCallback((id: string) => {
    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    saveProfiles(updated);
  }, [profiles]);

  return { profiles, addProfile, removeProfile };
}

interface PCCollectionsUIProps {
  profiles: PCProfile[];
  onSelect: (specs: UserSpecs) => void;
  onRemove: (id: string) => void;
  currentSpecs: UserSpecs | null;
  onSaveNew: (name: string) => void;
}

export function PCCollectionsUI({ profiles, onSelect, onRemove, currentSpecs, onSaveNew }: PCCollectionsUIProps) {
  const [expanded, setExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [showSave, setShowSave] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-muted/50 text-sm text-foreground hover:bg-muted transition-colors"
      >
        <span className="flex items-center gap-2">
          <Monitor className="w-4 h-4 text-primary" />
          My PC Profiles ({profiles.length})
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-2"
          >
            {profiles.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-background/50 border border-border/30 text-xs">
                <button
                  onClick={() => onSelect(p.specs)}
                  className="flex-1 text-left hover:text-primary transition-colors"
                >
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-muted-foreground">{p.specs.cpu} • {p.specs.gpu} • {p.specs.ram}GB</p>
                </button>
                <button onClick={() => onRemove(p.id)} className="p-1 hover:text-destructive transition-colors ml-2">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {currentSpecs && (
              <>
                {!showSave ? (
                  <button
                    onClick={() => setShowSave(true)}
                    className="flex items-center gap-1.5 px-3 py-2 w-full rounded-lg border border-dashed border-border/50 text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save current specs as profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="Profile name..."
                      className="flex-1 px-2 py-1.5 rounded-lg bg-background/80 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter' && newName.trim()) {
                          onSaveNew(newName.trim());
                          setNewName('');
                          setShowSave(false);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (newName.trim()) {
                          onSaveNew(newName.trim());
                          setNewName('');
                          setShowSave(false);
                        }
                      }}
                      disabled={!newName.trim()}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40"
                    >
                      Save
                    </button>
                  </div>
                )}
              </>
            )}

            {profiles.length === 0 && !currentSpecs && (
              <p className="text-[11px] text-muted-foreground px-3 py-2">
                Enter your PC specs first, then save them as a profile here.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
