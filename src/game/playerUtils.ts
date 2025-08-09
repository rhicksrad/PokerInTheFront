// Centralized player state utilities to eliminate duplication across the codebase
import type { GameState, Player } from './types';

export interface PlayerFilters {
  active: Player[];        // Not folded, not all-in, not busted, has chips
  allIn: Player[];        // All-in but not folded/busted  
  folded: Player[];       // Folded players
  busted: Player[];       // Busted out players
  remaining: Player[];    // Not folded and not busted (active + all-in)
  eligible: Player[];     // Can still play (not busted)
}

/**
 * Centralized function to filter players by various states
 * This replaces 10+ duplicate filter operations across the codebase
 */
export function filterPlayers(state: GameState): PlayerFilters {
  const allPlayers = Object.values(state.players);
  
  const active = allPlayers.filter(p => 
    !p.isFolded && !p.isAllIn && !p.isBustedOut && p.chips > 0
  );
  
  const allIn = allPlayers.filter(p => 
    !p.isFolded && p.isAllIn && !p.isBustedOut
  );
  
  const folded = allPlayers.filter(p => p.isFolded);
  
  const busted = allPlayers.filter(p => p.isBustedOut || p.chips <= 0);
  
  const remaining = allPlayers.filter(p => 
    !p.isFolded && !p.isBustedOut
  );
  
  const eligible = allPlayers.filter(p => !p.isBustedOut);
  
  return { active, allIn, folded, busted, remaining, eligible };
}

/**
 * Check if only one player can win (others folded/busted)
 */
export function getLastPlayer(state: GameState): Player | null {
  const filters = filterPlayers(state);
  return filters.remaining.length === 1 ? filters.remaining[0] : null;
}

/**
 * Check if all remaining players are all-in (triggering showdown)
 */
export function areAllPlayersAllIn(state: GameState): boolean {
  const filters = filterPlayers(state);
  return filters.active.length === 0 && filters.allIn.length > 1;
}

/**
 * Get human player safely
 */
export function getHumanPlayer(state: GameState): Player | null {
  return Object.values(state.players).find(p => p.isHuman) || null;
}

/**
 * Get player by seat index safely
 */
export function getPlayerBySeat(state: GameState, seatIndex: number): Player | null {
  return Object.values(state.players).find(p => p.seatIndex === seatIndex) || null;
}

/**
 * Reset player states for new hand (centralized logic)
 */
export function resetPlayerStatesForNewHand(players: Record<string, Player>): Record<string, Player> {
  const reset: Record<string, Player> = {};
  
  Object.values(players).forEach(p => {
    reset[p.id] = {
      ...p,
      isFolded: false,
      isAllIn: false,
      hand: null
    };
  });
  
  return reset;
}

/**
 * Update player chips and states efficiently
 */
export function updatePlayerChips(
  players: Record<string, Player>, 
  playerId: string, 
  chipChange: number,
  isAllIn: boolean = false
): Record<string, Player> {
  const player = players[playerId];
  if (!player) return players;
  
  const newChips = player.chips + chipChange;
  
  return {
    ...players,
    [playerId]: {
      ...player,
      chips: Math.max(0, newChips),
      isAllIn: isAllIn || newChips <= 0,
      isBustedOut: newChips <= 0
    }
  };
}
