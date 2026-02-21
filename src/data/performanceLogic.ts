import type { UserSpecs, PerformanceResult, PerformanceLevel, Game, OptionalFilters } from '@/types/game';

// GPU tier ranking (higher = better)
const GPU_TIERS: [string, number][] = [
  // NVIDIA - newest first
  ['RTX 5090', 200], ['RTX 5080', 190], ['RTX 5070 Ti', 180], ['RTX 5070', 175], ['RTX 5060 Ti', 170], ['RTX 5060', 165],
  ['RTX 4090', 160], ['RTX 4080', 150], ['RTX 4070 Ti', 145], ['RTX 4070', 140], ['RTX 4060 Ti', 135], ['RTX 4060', 130],
  ['RTX 3090 Ti', 128], ['RTX 3090', 125], ['RTX 3080 Ti', 123], ['RTX 3080', 120], ['RTX 3070 Ti', 115], ['RTX 3070', 110],
  ['RTX 3060 Ti', 105], ['RTX 3060', 100], ['RTX 3050', 90],
  ['RTX 2080 Ti', 108], ['RTX 2080 Super', 105], ['RTX 2080', 102], ['RTX 2070 Super', 98], ['RTX 2070', 95],
  ['RTX 2060 Super', 92], ['RTX 2060', 88],
  ['GTX 1080 Ti', 85], ['GTX 1080', 80], ['GTX 1070 Ti', 77], ['GTX 1070', 75],
  ['GTX 1060 6GB', 65], ['GTX 1060', 63], ['GTX 1050 Ti', 55], ['GTX 1050', 50],
  ['GTX 980 Ti', 70], ['GTX 980', 65], ['GTX 970', 60], ['GTX 960', 50], ['GTX 950', 45],
  ['GTX 770', 45], ['GTX 760', 40], ['GTX 750 Ti', 38], ['GTX 750', 35],
  ['GTX 660', 35], ['GTX 650', 28], ['GT 1030', 25], ['9800 GT', 15],
  ['NVIDIA VEGA 56', 72], ['NVIDIA VEGA 64', 78],
  // AMD
  ['RX 7900 XTX', 155], ['RX 7900 XT', 148], ['RX 7800 XT', 130], ['RX 7700 XT', 120], ['RX 7600', 100],
  ['RX 6950 XT', 140], ['RX 6900 XT', 135], ['RX 6800 XT', 125], ['RX 6800', 118],
  ['RX 6750 XT', 110], ['RX 6700 XT', 105], ['RX 6650 XT', 95], ['RX 6600 XT', 92], ['RX 6600', 88],
  ['RX 6500 XT', 55], ['RX 6400', 45],
  ['RX 5700 XT', 95], ['RX 5700', 90], ['RX 5600 XT', 85], ['RX 5500 XT', 65],
  ['RX 590', 65], ['RX 580', 60], ['RX 570', 55], ['RX 560', 42], ['RX 480', 58], ['RX 470', 52],
  ['RX VEGA 56', 72], ['RX VEGA 64', 78], ['VEGA 56', 72], ['VEGA 64', 78],
  ['R9 390', 55], ['R9 380', 48], ['R9 290', 50], ['R9 280', 42], ['R7 370', 35],
  ['Radeon HD 7950', 35], ['Radeon HD 7870', 32], ['Radeon HD 7770', 25],
  ['Intel HD 4000', 10], ['Intel HD Graphics 4000', 10], ['Intel HD 530', 15],
  ['Intel UHD 630', 18], ['Intel Iris Xe', 30], ['Intel Arc A770', 95], ['Intel Arc A750', 88],
];

const CPU_TIERS: [string, number][] = [
  // Intel newest
  ['i9-14900K', 200], ['i9-13900K', 195], ['i9-12900K', 185], ['i9-11900K', 170], ['i9-10900K', 160],
  ['i7-14700K', 185], ['i7-13700K', 180], ['i7-12700K', 170], ['i7-11700K', 155], ['i7-10700K', 145],
  ['i7-9700K', 135], ['i7-8700K', 125], ['i7-8700', 120], ['i7-7700K', 115], ['i7-7700', 110],
  ['i7-6700K', 105], ['i7-6700', 100], ['i7-4790K', 95], ['i7-4790', 92], ['i7-4770K', 90], ['i7-4770', 88],
  ['i7-3770', 80], ['i7-2600', 72],
  ['i5-14600K', 170], ['i5-13600K', 165], ['i5-12600K', 155], ['i5-11600K', 140], ['i5-10600K', 130],
  ['i5-9600K', 120], ['i5-8600K', 115], ['i5-8400', 108], ['i5-7600K', 100], ['i5-7500', 95],
  ['i5-7300U', 60], ['i5-6600K', 95], ['i5-6600', 90], ['i5-4690', 85], ['i5-4590', 82],
  ['i5-3570K', 75], ['i5-3570', 73], ['i5-3470', 70], ['i5-2500K', 68], ['i5-2500', 65],
  ['i3-12100', 110], ['i3-10100', 90], ['i3-8100', 80], ['i3-6100', 65], ['i3-3225', 50], ['i3-3210', 48],
  ['Core 2 Quad Q6600', 25], ['Core 2 Quad', 25],
  ['i5-750', 40],
  // AMD
  ['Ryzen 9 7950X', 200], ['Ryzen 9 7900X', 190], ['Ryzen 9 5950X', 185], ['Ryzen 9 5900X', 180],
  ['Ryzen 9 3950X', 170], ['Ryzen 9 3900X', 165],
  ['Ryzen 7 7800X3D', 190], ['Ryzen 7 7700X', 175], ['Ryzen 7 5800X3D', 175], ['Ryzen 7 5800X', 165],
  ['Ryzen 7 5700X', 160], ['Ryzen 7 3800X', 150], ['Ryzen 7 3700X', 145], ['Ryzen 7 2700X', 125],
  ['Ryzen 5 7600X', 160], ['Ryzen 5 5600X', 150], ['Ryzen 5 5600', 145],
  ['Ryzen 5 3600X', 135], ['Ryzen 5 3600', 130], ['Ryzen 5 2600X', 115], ['Ryzen 5 2600', 110],
  ['Ryzen 5 1600', 95], ['Ryzen 5 1500X', 90], ['Ryzen 5 1400', 85],
  ['Ryzen 3 3300X', 110], ['Ryzen 3 3200G', 80], ['Ryzen 3 3300U', 55], ['Ryzen 3 1200', 65],
  ['FX-9590', 60], ['FX-8370', 55], ['FX-8350', 53], ['FX-8310', 50], ['FX-8300', 48],
  ['FX-6300', 40], ['FX-4350', 35],
  ['Phenom II X4 965', 30], ['A10-7800', 45], ['A8-7600', 35], ['AMD A10-7800', 45], ['AMD A8-7600', 35],
];

function getGPUTier(gpu: string): number {
  const gpuLower = gpu.toLowerCase();
  let bestMatch = 0;
  let bestLen = 0;
  for (const [name, tier] of GPU_TIERS) {
    if (gpuLower.includes(name.toLowerCase()) && name.length > bestLen) {
      bestMatch = tier;
      bestLen = name.length;
    }
  }
  return bestMatch || 30; // default unknown
}

function getCPUTier(cpu: string): number {
  const cpuLower = cpu.toLowerCase();
  let bestMatch = 0;
  let bestLen = 0;
  for (const [name, tier] of CPU_TIERS) {
    if (cpuLower.includes(name.toLowerCase()) && name.length > bestLen) {
      bestMatch = tier;
      bestLen = name.length;
    }
  }
  return bestMatch || 30;
}

function parseRAMValue(ram: string): number {
  const m = ram.match(/(\d+)/);
  return m ? parseInt(m[1]) : 0;
}

export function evaluatePerformance(game: Game, specs: UserSpecs, filters?: OptionalFilters): PerformanceResult {
  const userGPU = getGPUTier(specs.gpu);
  const userCPU = getCPUTier(specs.cpu);

  const minGPU = getGPUTier(game.minGPU);
  const minCPU = getCPUTier(game.minCPU);
  const recGPU = getGPUTier(game.recGPU);
  const recCPU = getCPUTier(game.recCPU);

  const minRAM = parseRAMValue(game.minRAM);
  const recRAM = parseRAMValue(game.recRAM);

  // Check storage
  if (specs.storage < game.storageGB) {
    return {
      level: 'unplayable',
      label: 'Insufficient Storage',
      description: `Requires ${game.storageGB} GB, you have ${specs.storage} GB available.`,
      color: 'destructive',
    };
  }

  // Check if below minimum
  if (specs.ram < minRAM || userGPU < minGPU * 0.7 || userCPU < minCPU * 0.7) {
    return {
      level: 'unplayable',
      label: 'Cannot Run This Game',
      description: `Your PC does not meet the minimum requirements for ${game.name}.`,
      color: 'destructive',
    };
  }

  // Score: how far above recommended
  const gpuRatio = recGPU > 0 ? userGPU / recGPU : 1;
  const cpuRatio = recCPU > 0 ? userCPU / recCPU : 1;
  const ramRatio = recRAM > 0 ? specs.ram / recRAM : 1;

  // Weighted score
  let score = gpuRatio * 0.5 + cpuRatio * 0.3 + ramRatio * 0.2;

  // SSD bonus
  const needsSSD = game.recStorage.toLowerCase().includes('ssd');
  if (needsSSD && specs.storageType === 'HDD') {
    score *= 0.9;
  }

  // Tolerance adjustment
  if (filters?.tolerance === 'best-graphics') score *= 0.85;
  if (filters?.tolerance === 'low-lag') score *= 1.1;

  let level: PerformanceLevel;
  let label: string;
  let description: string;
  let fps: string;

  if (score >= 1.3) {
    level = 'ultra';
    label = 'Runs on Ultra Settings';
    fps = '60+ FPS';
    description = `${game.name} will run on Ultra Settings at 60+ FPS on your ${specs.gpu} with ${specs.ram}GB RAM.`;
  } else if (score >= 1.0) {
    level = 'high';
    label = 'Runs on High Settings';
    fps = '60 FPS';
    description = `${game.name} will run on High Settings at ~60 FPS on your ${specs.gpu}.`;
  } else if (score >= 0.8) {
    level = 'medium';
    label = 'Runs on Medium Settings';
    fps = '30-60 FPS';
    description = `${game.name} will run on Medium Settings at 30-60 FPS.`;
  } else if (score >= 0.6) {
    level = 'low';
    label = 'Runs on Low Settings';
    fps = '30 FPS';
    description = `${game.name} will run on Low Settings at ~30 FPS.`;
  } else {
    level = 'playable';
    label = 'Playable but May Lag';
    fps = '<30 FPS';
    description = `${game.name} may run but expect frame drops and stuttering.`;
  }

  return { level, label, description, fps, color: levelToColor(level) };
}

function levelToColor(level: PerformanceLevel): string {
  switch (level) {
    case 'ultra': return 'success';
    case 'high': return 'info';
    case 'medium': return 'warning';
    case 'low': return 'warning';
    case 'playable': return 'warning';
    case 'unplayable': return 'destructive';
  }
}

export function getPerformanceBadgeClass(level: PerformanceLevel): string {
  switch (level) {
    case 'ultra': return 'performance-ultra';
    case 'high': return 'performance-high';
    case 'medium': return 'performance-medium';
    case 'low': case 'playable': case 'unplayable': return 'performance-low';
  }
}

export function getPerformanceBgClass(level: PerformanceLevel): string {
  switch (level) {
    case 'ultra': return 'bg-performance-ultra';
    case 'high': return 'bg-performance-high';
    case 'medium': return 'bg-performance-medium';
    case 'low': case 'playable': case 'unplayable': return 'bg-performance-low';
  }
}
