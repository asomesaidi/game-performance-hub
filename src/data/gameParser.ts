import Papa from 'papaparse';
import type { Game } from '@/types/game';

const GENRE_KEYWORDS: [string, string][] = [
  ['FIFA', 'Sports'], ['NBA', 'Sports'], ['Football', 'Sports'], ['PES', 'Sports'],
  ['EA Sports FC', 'Sports'], ['MLB', 'Sports'], ['Madden', 'Sports'], ['WWE', 'Sports'],
  ['Call of Duty', 'FPS'], ['Battlefield', 'FPS'], ['Counter-Strike', 'FPS'], ['Valorant', 'FPS'],
  ['Overwatch', 'FPS'], ['Doom', 'FPS'], ['Halo', 'FPS'], ['Rainbow Six', 'FPS'],
  ['Insurgency', 'FPS'], ['Squad', 'FPS'], ['Arma', 'FPS'], ['Ready or Not', 'FPS'],
  ['Wolfenstein', 'FPS'], ['Quake', 'FPS'], ['Titanfall', 'FPS'],
  ['GTA', 'Open World'], ['Grand Theft Auto', 'Open World'], ['Red Dead', 'Open World'],
  ['Cyberpunk', 'Open World'], ['Watch Dogs', 'Open World'], ['Far Cry', 'Open World'],
  ['Just Cause', 'Open World'], ['Saints Row', 'Open World'], ['Mafia', 'Open World'],
  ['Sleeping Dogs', 'Open World'], ['No Man\'s Sky', 'Open World'],
  ['Assassin', 'Action RPG'], ['Witcher', 'RPG'], ['Elden Ring', 'RPG'], ['Dark Souls', 'RPG'],
  ['Sekiro', 'Action RPG'], ['Lies of P', 'Action RPG'], ['Nioh', 'Action RPG'],
  ['Armored Core', 'Action RPG'], ['Code Vein', 'Action RPG'],
  ['Final Fantasy', 'RPG'], ['Persona', 'RPG'], ['Dragon Quest', 'RPG'], ['Octopath', 'RPG'],
  ['Tales of', 'RPG'], ['NieR', 'RPG'], ['Yakuza', 'RPG'], ['Like a Dragon', 'RPG'],
  ['Baldur\'s Gate', 'RPG'], ['Divinity', 'RPG'], ['Pillars of Eternity', 'RPG'],
  ['Pathfinder', 'RPG'], ['Disco Elysium', 'RPG'], ['Diablo', 'Action RPG'],
  ['Monster Hunter', 'Action RPG'], ['Dragon\'s Dogma', 'Action RPG'],
  ['Minecraft', 'Sandbox'], ['Terraria', 'Sandbox'], ['Starbound', 'Sandbox'],
  ['Fortnite', 'Battle Royale'], ['PUBG', 'Battle Royale'], ['Apex', 'Battle Royale'],
  ['Warzone', 'Battle Royale'], ['Fall Guys', 'Battle Royale'],
  ['Resident Evil', 'Horror'], ['Silent Hill', 'Horror'], ['Outlast', 'Horror'],
  ['Amnesia', 'Horror'], ['SOMA', 'Horror'], ['Little Nightmares', 'Horror'],
  ['Dead by Daylight', 'Horror'], ['Phasmophobia', 'Horror'], ['Alan Wake', 'Horror'],
  ['Evil Within', 'Horror'], ['Layers of Fear', 'Horror'], ['Until Dawn', 'Horror'],
  ['Racing', 'Racing'], ['Forza', 'Racing'], ['Need for Speed', 'Racing'],
  ['Gran Turismo', 'Racing'], ['F1 ', 'Racing'], ['Assetto Corsa', 'Racing'],
  ['Civilization', 'Strategy'], ['Total War', 'Strategy'], ['StarCraft', 'Strategy'],
  ['Crusader Kings', 'Strategy'], ['Europa Universalis', 'Strategy'],
  ['Hearts of Iron', 'Strategy'], ['Stellaris', 'Strategy'],
  ['Sims', 'Simulation'], ['Flight', 'Simulation'], ['Farm', 'Simulation'],
  ['Cities', 'Simulation'], ['Planet Coaster', 'Simulation'], ['Planet Zoo', 'Simulation'],
  ['Truck Simulator', 'Simulation'], ['Kerbal', 'Simulation'],
  ['Mortal Kombat', 'Fighting'], ['Street Fighter', 'Fighting'], ['Tekken', 'Fighting'],
  ['Dragon Ball Fighter', 'Fighting'], ['Guilty Gear', 'Fighting'],
  ['League of Legends', 'MOBA'], ['Dota', 'MOBA'],
  ['World of Warcraft', 'MMO'],
  ['Tomb Raider', 'Action Adventure'], ['Uncharted', 'Action Adventure'],
  ['Spider-Man', 'Action Adventure'], ['God of War', 'Action Adventure'],
  ['Horizon', 'Action Adventure'], ['Ghost of Tsushima', 'Action Adventure'],
  ['Ratchet', 'Action Adventure'], ['Devil May Cry', 'Action Adventure'],
  ['Bayonetta', 'Action Adventure'], ['Hitman', 'Action Adventure'],
  ['Metal Gear', 'Action Adventure'],
  ['Subnautica', 'Survival'], ['Forest', 'Survival'], ['Valheim', 'Survival'],
  ['Rust', 'Survival'], ['DayZ', 'Survival'], ['ARK', 'Survival'],
  ['7 Days', 'Survival'], ['Green Hell', 'Survival'], ['Raft', 'Survival'],
  ['Project Zomboid', 'Survival'], ['V Rising', 'Survival'], ['Conan Exiles', 'Survival'],
  ['Craft', 'Survival'],
  ['Horror', 'Horror'], ['Survival', 'Survival'],
];

function guessGenre(name: string): string {
  for (const [keyword, genre] of GENRE_KEYWORDS) {
    if (name.toLowerCase().includes(keyword.toLowerCase())) {
      return genre;
    }
  }
  return 'Action';
}

function parseRAM(val: string): number {
  const match = val.match(/(\d+)\s*(MB|GB)?/i);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = (match[2] || 'GB').toUpperCase();
  if (unit === 'MB') return Math.round(num / 1024 * 100) / 100;
  return num;
}

function parseStorage(val: string): number {
  const match = val.match(/(\d+)\s*(MB|GB|TB)?/i);
  if (!match) return 0;
  const num = parseInt(match[1]);
  const unit = (match[2] || 'GB').toUpperCase();
  if (unit === 'MB') return Math.round(num / 1024 * 100) / 100; // Convert MB to GB (e.g. 200MB = 0.2GB)
  if (unit === 'TB') return num * 1024;
  return num;
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
  const seen = new Set<string>();

  const games: Game[] = [];
  for (const row of rows.slice(1)) {
    const name = (row[0] || '').trim();
    if (!name) continue;

    // Deduplicate by normalized name
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(key)) continue;
    seen.add(key);

    games.push({
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
    });
  }

  cachedGames = games;
  return games;
}

export function getGameById(games: Game[], id: string): Game | undefined {
  return games.find(g => g.id === id);
}

export function getUniqueGenres(games: Game[]): string[] {
  return [...new Set(games.map(g => g.genre))].sort();
}
