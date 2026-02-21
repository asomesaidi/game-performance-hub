export interface Game {
  id: string;
  name: string;
  minCPU: string;
  minRAM: string;
  minGPU: string;
  minStorage: string;
  minOS: string;
  recCPU: string;
  recRAM: string;
  recGPU: string;
  recStorage: string;
  recOS: string;
  source: string;
  storageGB: number;
  minRAMGB: number;
  recRAMGB: number;
  genre: string;
}

export interface UserSpecs {
  cpu: string;
  gpu: string;
  ram: number;
  storage: number;
  storageType: 'SSD' | 'HDD';
}

export interface OptionalFilters {
  fps?: 30 | 60 | 120;
  graphics?: 'Low' | 'Medium' | 'High' | 'Ultra';
  genre?: string;
  minSize?: number;
  maxSize?: number;
  tolerance?: 'low-lag' | 'balanced' | 'best-graphics';
}

export type PerformanceLevel = 'ultra' | 'high' | 'medium' | 'low' | 'playable' | 'unplayable';

export interface PerformanceResult {
  level: PerformanceLevel;
  label: string;
  description: string;
  fps?: string;
  color: string;
}
