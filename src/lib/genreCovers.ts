import openWorldCover from '@/assets/covers/open-world.jpg';
import fpsCover from '@/assets/covers/fps.jpg';
import rpgCover from '@/assets/covers/rpg.jpg';
import battleRoyaleCover from '@/assets/covers/battle-royale.jpg';
import horrorCover from '@/assets/covers/horror.jpg';
import racingCover from '@/assets/covers/racing.jpg';
import sandboxCover from '@/assets/covers/sandbox.jpg';
import sportsCover from '@/assets/covers/sports.jpg';
import strategyCover from '@/assets/covers/strategy.jpg';
import actionAdventureCover from '@/assets/covers/action-adventure.jpg';
import fightingCover from '@/assets/covers/fighting.jpg';
import simulationCover from '@/assets/covers/simulation.jpg';
import mobaCover from '@/assets/covers/moba.jpg';
import survivalCover from '@/assets/covers/survival.jpg';
import mmoCover from '@/assets/covers/mmo.jpg';
import actionCover from '@/assets/covers/action.jpg';
import { getSteamImageUrl } from '@/lib/steamAppIds';

const genreCoverMap: Record<string, string> = {
  'Open World': openWorldCover,
  'FPS': fpsCover,
  'RPG': rpgCover,
  'Battle Royale': battleRoyaleCover,
  'Horror': horrorCover,
  'Racing': racingCover,
  'Sandbox': sandboxCover,
  'Sports': sportsCover,
  'Strategy': strategyCover,
  'Action Adventure': actionAdventureCover,
  'Fighting': fightingCover,
  'Simulation': simulationCover,
  'MOBA': mobaCover,
  'Survival': survivalCover,
  'MMO': mmoCover,
  'Action': actionCover,
  'Action RPG': actionCover,
};

export function getGameCover(gameName: string, genre: string): string {
  // Try real Steam image first
  const steamUrl = getSteamImageUrl(gameName);
  if (steamUrl) return steamUrl;
  // Fallback to genre cover
  return genreCoverMap[genre] || actionCover;
}

// Keep backward compat
export function getGenreCover(genre: string): string {
  return genreCoverMap[genre] || actionCover;
}
