import Papa from 'papaparse';
import type { Game } from '@/types/game';

const GENRE_MAP: Record<string, string> = {};
const GENRE_KEYWORDS: [string, string][] = [
  ['FIFA', 'Sports'], ['NBA', 'Sports'], ['Football', 'Sports'], ['PES', 'Sports'],
  ['Call of Duty', 'FPS'], ['Battlefield', 'FPS'], ['Counter-Strike', 'FPS'], ['Valorant', 'FPS'],
  ['Overwatch', 'FPS'], ['Doom', 'FPS'], ['Halo', 'FPS'], ['Rainbow Six', 'FPS'],
  ['GTA', 'Open World'], ['Red Dead', 'Open World'], ['Cyberpunk', 'Open World'],
  ['Assassin', 'Action RPG'], ['Witcher', 'RPG'], ['Elden Ring', 'RPG'], ['Dark Souls', 'RPG'],
  ['Minecraft', 'Sandbox'], ['Terraria', 'Sandbox'], ['Fortnite', 'Battle Royale'],
  ['PUBG', 'Battle Royale'], ['Apex', 'Battle Royale'], ['Warzone', 'Battle Royale'],
  ['Resident Evil', 'Horror'], ['Silent Hill', 'Horror'], ['Outlast', 'Horror'],
  ['Racing', 'Racing'], ['Forza', 'Racing'], ['Need for Speed', 'Racing'],
  ['Civilization', 'Strategy'], ['Total War', 'Strategy'], ['StarCraft', 'Strategy'],
  ['Sims', 'Simulation'], ['Flight', 'Simulation'], ['Farm', 'Simulation'],
  ['Mortal Kombat', 'Fighting'], ['Street Fighter', 'Fighting'], ['Tekken', 'Fighting'],
  ['League of Legends', 'MOBA'], ['Dota', 'MOBA'],
  ['World of Warcraft', 'MMO'], ['Final Fantasy', 'RPG'], ['Diablo', 'Action RPG'],
  ['Tomb Raider', 'Action Adventure'], ['Uncharted', 'Action Adventure'],
  ['Horror', 'Horror'], ['Survival', 'Survival'], ['Craft', 'Survival'],
];

function guessGenre(name: string): string {
  if (GENRE_MAP[name]) return GENRE_MAP[name];
  for (const [keyword, genre] of GENRE_KEYWORDS) {
    if (name.toLowerCase().includes(keyword.toLowerCase())) {
      return genre;
    }
  }
  return 'Action';
}

function parseRAM(val: string): number {
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function parseStorage(val: string): number {
  const match = val.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

let cachedGames: Game[] | null = null;

export async function loadGames(): Promise<Game[]> {
  if (cachedGames) return cachedGames;

  const response = await fetch('/data/games.csv');
  const csvText = await response.text();

  const result = Papa.parse(csvText, {
    header: false,
    skipEmptyLines: true,
  });

  const rows = result.data as string[][];
  // Skip header row
  const games: Game[] = rows.slice(1).map((row) => {
    const name = (row[0] || '').trim();
    return {
      id: slugify(name),
      name,
      minCPU: (row[1] || '').trim(),
      minRAM: (row[2] || '').trim(),
      minGPU: (row[3] || '').trim(),
      minStorage: (row[4] || '').trim(),
      minOS: (row[5] || '').trim(),
      recCPU: (row[6] || '').trim(),
      recRAM: (row[7] || '').trim(),
      recGPU: (row[8] || '').trim(),
      recStorage: (row[9] || '').trim(),
      recOS: (row[10] || '').trim(),
      source: (row[11] || '').trim(),
      storageGB: parseStorage(row[4] || ''),
      minRAMGB: parseRAM(row[2] || ''),
      recRAMGB: parseRAM(row[7] || ''),
      genre: guessGenre(name),
    };
  }).filter(g => g.name.length > 0);

  cachedGames = games;
  return games;
}

export function getGameById(games: Game[], id: string): Game | undefined {
  return games.find(g => g.id === id);
}

export function getUniqueGenres(games: Game[]): string[] {
  return [...new Set(games.map(g => g.genre))].sort();
}
