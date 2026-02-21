import { useState, useEffect } from 'react';
import { X, Cpu, Monitor, MemoryStick, HardDrive, Gauge, Palette, Gamepad2, Ruler, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserSpecs, OptionalFilters } from '@/types/game';
import { CPU_MANUFACTURERS, GPU_MANUFACTURERS } from '@/lib/hardwareData';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  specs: UserSpecs | null;
  onSaveSpecs: (specs: UserSpecs) => void;
  onClearSpecs: () => void;
  optionalFilters: OptionalFilters;
  onOptionalFiltersChange: (filters: OptionalFilters) => void;
  genres: string[];
}

export function FilterPanel({
  open,
  onClose,
  specs,
  onSaveSpecs,
  onClearSpecs,
  optionalFilters,
  onOptionalFiltersChange,
  genres,
}: FilterPanelProps) {
  const [cpuBrand, setCpuBrand] = useState('');
  const [cpu, setCpu] = useState(specs?.cpu || '');
  const [gpuBrand, setGpuBrand] = useState('');
  const [gpu, setGpu] = useState(specs?.gpu || '');
  const [ram, setRam] = useState(specs?.ram?.toString() || '');
  const [storage, setStorage] = useState(specs?.storage?.toString() || '');
  const [storageType, setStorageType] = useState<'SSD' | 'HDD'>(specs?.storageType || 'SSD');

  useEffect(() => {
    if (specs) {
      setCpu(specs.cpu);
      setGpu(specs.gpu);
      setRam(specs.ram.toString());
      setStorage(specs.storage.toString());
      setStorageType(specs.storageType);
      // Try to detect brand from saved specs
      for (const m of CPU_MANUFACTURERS) {
        if (m.models.includes(specs.cpu)) { setCpuBrand(m.name); break; }
      }
      for (const m of GPU_MANUFACTURERS) {
        if (m.models.includes(specs.gpu)) { setGpuBrand(m.name); break; }
      }
    }
  }, [specs]);

  const cpuModels = CPU_MANUFACTURERS.find(m => m.name === cpuBrand)?.models || [];
  const gpuModels = GPU_MANUFACTURERS.find(m => m.name === gpuBrand)?.models || [];

  const handleSave = () => {
    if (!cpu || !gpu || !ram || !storage) return;
    onSaveSpecs({ cpu, gpu, ram: parseInt(ram), storage: parseInt(storage), storageType });
    onClose();
  };

  const handleClear = () => {
    setCpuBrand(''); setCpu(''); setGpuBrand(''); setGpu(''); setRam(''); setStorage('');
    onClearSpecs();
    onClose();
  };

  const selectClass = "w-full px-3 py-2.5 rounded-lg bg-background/80 border border-border/60 text-foreground text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all";
  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-background/80 border border-border/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all";
  const labelClass = "flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg z-50 glass-panel rounded-l-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Check My PC</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Select your hardware to see performance results</p>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Required specs */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-primary">Your System Specs</h3>

                {/* CPU Brand + Model */}
                <div className="space-y-2">
                  <label className={labelClass}><Cpu className="w-3.5 h-3.5" /> CPU Manufacturer *</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={cpuBrand}
                      onChange={(e) => { setCpuBrand(e.target.value); setCpu(''); }}
                    >
                      <option value="">Select manufacturer...</option>
                      {CPU_MANUFACTURERS.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {cpuBrand && (
                  <div>
                    <label className={labelClass}><Cpu className="w-3.5 h-3.5" /> CPU Model *</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={cpu}
                        onChange={(e) => setCpu(e.target.value)}
                      >
                        <option value="">Select CPU...</option>
                        {cpuModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* GPU Brand + Model */}
                <div className="space-y-2">
                  <label className={labelClass}><Monitor className="w-3.5 h-3.5" /> GPU Manufacturer *</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={gpuBrand}
                      onChange={(e) => { setGpuBrand(e.target.value); setGpu(''); }}
                    >
                      <option value="">Select manufacturer...</option>
                      {GPU_MANUFACTURERS.map(m => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {gpuBrand && (
                  <div>
                    <label className={labelClass}><Monitor className="w-3.5 h-3.5" /> GPU Model *</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={gpu}
                        onChange={(e) => setGpu(e.target.value)}
                      >
                        <option value="">Select GPU...</option>
                        {gpuModels.map(model => (
                          <option key={model} value={model}>{model}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}><MemoryStick className="w-3.5 h-3.5" /> RAM (GB) *</label>
                    <div className="relative">
                      <select
                        className={selectClass}
                        value={ram}
                        onChange={(e) => setRam(e.target.value)}
                      >
                        <option value="">Select...</option>
                        {[4, 8, 12, 16, 24, 32, 48, 64, 128].map(v => (
                          <option key={v} value={v}>{v} GB</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}><HardDrive className="w-3.5 h-3.5" /> Storage (GB) *</label>
                    <input className={inputClass} type="number" placeholder="500" value={storage} onChange={e => setStorage(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}><HardDrive className="w-3.5 h-3.5" /> Storage Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['SSD', 'HDD'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setStorageType(t)}
                        className={`py-2.5 rounded-lg text-sm font-medium transition-all border ${
                          storageType === t
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Optional filters */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground">Optional Filters</h3>

                <div>
                  <label className={labelClass}><Gauge className="w-3.5 h-3.5" /> Desired FPS</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([30, 60, 120] as const).map((fps) => (
                      <button
                        key={fps}
                        onClick={() => onOptionalFiltersChange({
                          ...optionalFilters,
                          fps: optionalFilters.fps === fps ? undefined : fps,
                        })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all border ${
                          optionalFilters.fps === fps
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {fps} FPS
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}><Palette className="w-3.5 h-3.5" /> Graphics Preference</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Low', 'Medium', 'High', 'Ultra'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => onOptionalFiltersChange({
                          ...optionalFilters,
                          graphics: optionalFilters.graphics === g ? undefined : g,
                        })}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          optionalFilters.graphics === g
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelClass}><Gamepad2 className="w-3.5 h-3.5" /> Genre</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={optionalFilters.genre || ''}
                      onChange={(e) => onOptionalFiltersChange({ ...optionalFilters, genre: e.target.value || undefined })}
                    >
                      <option value="">All Genres</option>
                      {genres.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}><Ruler className="w-3.5 h-3.5" /> Performance Tolerance</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: 'low-lag' as const, label: 'Low Lag' },
                      { value: 'balanced' as const, label: 'Balanced' },
                      { value: 'best-graphics' as const, label: 'Best GFX' },
                    ]).map((t) => (
                      <button
                        key={t.value}
                        onClick={() => onOptionalFiltersChange({
                          ...optionalFilters,
                          tolerance: optionalFilters.tolerance === t.value ? undefined : t.value,
                        })}
                        className={`py-2 rounded-lg text-xs font-medium transition-all border ${
                          optionalFilters.tolerance === t.value
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClear}
                  className="flex-1 py-3 rounded-xl border border-border/50 text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={handleSave}
                  disabled={!cpu || !gpu || !ram || !storage}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Apply Specs
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
