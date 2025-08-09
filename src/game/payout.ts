import type { GameState, Player, Pot } from './types';
import { evaluateBestOfSeven, compareEvalResults } from './evaluator';
import { cardObjectsToRankSuitEmojiString } from '../ui/cardEmoji';

export interface WinnerInfo {
  playerId: string;
  amount: number;
  potIndex: number;
  handCategory?: string;
}

export interface PotWinners {
  potIndex: number;
  potAmount: number;
  winners: WinnerInfo[];
  eligiblePlayers: string[];
}

export function computeShowdownWinners(state: GameState): WinnerInfo[] {
  if (!state.round || state.board.length === 0) {
    return [];
  }
  
  const board = state.board;
  const players = Object.values(state.players);
  const activePlayers = players.filter((p) => !p.isFolded && p.hand?.c1 && p.hand?.c2);
  
  if (activePlayers.length === 0) return [];
  
  // Evaluate all active players' hands
  const playerEvals = new Map<string, any>();
  activePlayers.forEach((p) => {
    const sevenCards = [p.hand!.c1!, p.hand!.c2!, ...board];
    
    // Debug: Log the cards being evaluated
    console.log(`🔍 Evaluating ${p.name}:`, {
      hole: `${p.hand!.c1!.rank}${p.hand!.c1!.suit} ${p.hand!.c2!.rank}${p.hand!.c2!.suit}`,
      board: board.map(c => `${c.rank}${c.suit}`).join(' '),
      allSeven: sevenCards.map(c => `${c.rank}${c.suit}`).join(' ')
    });
    
    const handEval = evaluateBestOfSeven(sevenCards);
    console.log(`🎯 ${p.name} result: ${handEval.category} [${handEval.tiebreak.join(', ')}]`);
    
    playerEvals.set(p.id, handEval);
  });
  
  const allWinners: WinnerInfo[] = [];
  
  // Process each pot (main pot + side pots)
  state.pots.forEach((pot, potIndex) => {
    if (pot.amount <= 0) return;
    
    // Find eligible players for this pot
    const eligiblePlayerIds = pot.eligiblePlayerIds || activePlayers.map(p => p.id);
    const eligibleActivePlayers = activePlayers.filter(p => eligiblePlayerIds.includes(p.id));
    
    if (eligibleActivePlayers.length === 0) return;
    
    // Rank eligible players by hand strength
    const rankedPlayers = eligibleActivePlayers.map((p) => ({
      playerId: p.id,
      handEval: playerEvals.get(p.id)!,
    }));
    
    console.log(`🔍 Pot ${potIndex} before sorting:`);
    rankedPlayers.forEach((r, idx) => {
      const player = state.players[r.playerId];
      console.log(`  ${idx + 1}. ${player?.name} - ${r.handEval.category} [${r.handEval.tiebreak.join(', ')}]`);
    });
    
    rankedPlayers.sort((a, b) => compareEvalResults(a.handEval, b.handEval)).reverse();
    
    console.log(`🔍 Pot ${potIndex} after sorting (best first):`);
    rankedPlayers.forEach((r, idx) => {
      const player = state.players[r.playerId];
      console.log(`  ${idx + 1}. ${player?.name} - ${r.handEval.category} [${r.handEval.tiebreak.join(', ')}]`);
    });
    
    // Find all players tied for the best hand
    const bestEval = rankedPlayers[0].handEval;
    const tiedWinners = rankedPlayers.filter((r) => compareEvalResults(r.handEval, bestEval) === 0);
    
    console.log(`🔍 Winners for pot ${potIndex}:`, tiedWinners.map(w => {
      const player = state.players[w.playerId];
      return `${player?.name} - ${w.handEval.category}`;
    }));
    
    // Distribute pot among tied winners
    const numWinners = tiedWinners.length;
    const baseShare = Math.floor(pot.amount / numWinners);
    const remainder = pot.amount % numWinners;
    
    tiedWinners.forEach((winner, idx) => {
      const winAmount = baseShare + (idx < remainder ? 1 : 0);
      allWinners.push({
        playerId: winner.playerId,
        amount: winAmount,
        potIndex,
        handCategory: getHandCategoryName(winner.handEval),
      });
    });
  });
  
  return allWinners;
}

export function applyWinnings(state: GameState, winners: WinnerInfo[]): void {
  // Group winnings by player (optimized for performance)
  const playerWinnings = new Map<string, number>();
  for (let i = 0; i < winners.length; i++) {
    const w = winners[i];
    const current = playerWinnings.get(w.playerId) || 0;
    playerWinnings.set(w.playerId, current + w.amount);
  }
  
  // Apply winnings to player chip stacks (optimized loop)
  for (const [playerId, amount] of playerWinnings) {
    const player = state.players[playerId];
    if (player) {
      player.chips += amount;
    }
  }
  
  // Log showdown summary
  const totalPot = winners.reduce((sum, w) => sum + w.amount, 0);
  state.devLog.push(`🎰 Showdown complete - $${totalPot} pot distributed`);
  
  // Store showdown results for UI display before clearing pots
  if (!state.handSummary) {
    state.handSummary = {
      handNumber: state.handNumber,
      finalPot: totalPot,
      winners: winners.map(w => {
        const player = state.players[w.playerId];
        return {
          playerName: player?.name || 'Unknown',
          amount: w.amount,
          handCategory: w.handCategory || 'Unknown'
        };
      })
    };
  }
  
  // Clear all pots
  state.pots = [];
  
  // Log the results
  winners.forEach((w) => {
    const player = state.players[w.playerId];
    if (player) {
      const category = w.handCategory ? ` with ${w.handCategory}` : '';
      state.devLog.push(`🏆 ${player.name} wins $${w.amount}${category}`);
    }
  });
  
  // Log final chip counts
  Object.values(state.players).forEach((p) => {
    state.devLog.push(`💰 ${p.name}: $${p.chips}`);
  });
}

function getHandCategoryName(evalResult: any): string {
  if (!evalResult || !evalResult.category) return 'Unknown';
  
  // Convert category string to display name
  const categoryMap: Record<string, string> = {
    'HighCard': 'High Card',
    'OnePair': 'Pair',
    'TwoPair': 'Two Pair',
    'ThreeKind': 'Three of a Kind',
    'Straight': 'Straight',
    'Flush': 'Flush',
    'FullHouse': 'Full House',
    'FourKind': 'Four of a Kind',
    'StraightFlush': 'Straight Flush'
  };
  
  return categoryMap[evalResult.category] || evalResult.category;
}

