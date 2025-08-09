import type { Card, GameState, Player } from './types';
import { evaluateBestOfSeven } from './evaluator';
import { createDeck } from './deck';

export interface HandProbability {
  winProbability: number;
  tieProbability: number;
  handStrengths: {
    current: number;
    possible: { category: string; probability: number }[];
  };
  outs: {
    description: string;
    cards: Card[];
    probability: number;
  }[];
}

export function calculateHandProbabilities(gameState: GameState, playerId: string): HandProbability | null {
  const player = gameState.players[playerId];
  if (!player || !player.hand?.c1 || !player.hand?.c2) {
    return null;
  }

  const board = gameState.board;
  const holeCards = [player.hand.c1, player.hand.c2];
  const totalCards = [...holeCards, ...board];
  
  if (totalCards.length < 2 || totalCards.length > 7) {
    return null;
  }

  // For performance, we'll use a simplified calculation method
  // In a real implementation, you'd want to run Monte Carlo simulations
  
  const currentHandStrength = evaluateCurrentHand(totalCards);
  const possibleHands = calculatePossibleHands(holeCards, board);
  const outs = calculateOuts(holeCards, board);
  
  // Simplified win probability calculation
  const activePlayers = Object.values(gameState.players).filter(p => !p.isFolded).length;
  const baseWinProb = 1 / activePlayers;
  const strengthMultiplier = currentHandStrength / 10; // Normalize to 0-1
  
  let winProbability = baseWinProb * (1 + strengthMultiplier);
  winProbability = Math.min(Math.max(winProbability, 0.05), 0.95); // Clamp between 5% and 95%
  
  return {
    winProbability,
    tieProbability: 0.05, // Simplified tie probability
    handStrengths: {
      current: currentHandStrength,
      possible: possibleHands
    },
    outs
  };
}

function evaluateCurrentHand(cards: Card[]): number {
  if (cards.length < 7) {
    // For pre-flop or incomplete hands (less than 7 cards), use a simplified evaluation
    if (cards.length < 5) {
      return evaluatePreflopStrength(cards.slice(0, 2));
    }
    
    // For 5 or 6 cards, use a simplified hand strength calculation
    const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
    const suits = cards.map(c => c.suit);
    
    // Check for pairs, flushes, straights, etc.
    const rankCounts = ranks.reduce((acc: Record<number, number>, rank) => {
      acc[rank] = (acc[rank] || 0) + 1;
      return acc;
    }, {});
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const suitCounts = suits.reduce((acc: Record<string, number>, suit) => {
      acc[suit] = (acc[suit] || 0) + 1;
      return acc;
    }, {});
    
    const maxSuitCount = Math.max(...Object.values(suitCounts));
    
    // Score based on hand type
    if (counts[0] >= 4) return 9; // Four of a kind
    else if (counts[0] === 3 && counts[1] >= 2) return 8; // Full house
    else if (maxSuitCount >= 5) return 7; // Flush
    else if (counts[0] === 3) return 5; // Three of a kind
    else if (counts[0] === 2 && counts[1] === 2) return 4; // Two pair
    else if (counts[0] === 2) return 3; // One pair
    else return Math.max(ranks[0] / 14 * 2, 1); // High card
  }
  
  const evaluation = evaluateBestOfSeven(cards);
  
  // Convert evaluation to a 0-10 scale
  switch (evaluation.category) {
    case 'StraightFlush': return 9.5; // This includes Royal Flush
    case 'FourKind': return 9;
    case 'FullHouse': return 8;
    case 'Flush': return 7;
    case 'Straight': return 6;
    case 'ThreeKind': return 5;
    case 'TwoPair': return 4;
    case 'OnePair': return 3;
    case 'HighCard': return 2;
    default: return 1;
  }
}

function evaluatePreflopStrength(holeCards: Card[]): number {
  if (holeCards.length !== 2) return 1;
  
  const [card1, card2] = holeCards;
  const rank1 = getRankValue(card1.rank);
  const rank2 = getRankValue(card2.rank);
  const suited = card1.suit === card2.suit;
  const paired = rank1 === rank2;
  
  let strength = 0;
  
  if (paired) {
    if (rank1 >= 14) strength = 9; // AA
    else if (rank1 >= 13) strength = 8.5; // KK
    else if (rank1 >= 12) strength = 8; // QQ
    else if (rank1 >= 11) strength = 7.5; // JJ
    else if (rank1 >= 10) strength = 7; // TT
    else if (rank1 >= 8) strength = 6; // 88, 99
    else strength = 5; // Lower pairs
  } else {
    const highCard = Math.max(rank1, rank2);
    const lowCard = Math.min(rank1, rank2);
    const gap = highCard - lowCard;
    
    // High cards
    if (highCard === 14 && lowCard >= 12) strength = 7.5; // AK, AQ
    else if (highCard === 14 && lowCard >= 11) strength = 7; // AJ
    else if (highCard === 14 && lowCard >= 10) strength = 6.5; // AT
    else if (highCard >= 13 && lowCard >= 12) strength = 6; // KQ
    else if (highCard >= 13 && lowCard >= 11) strength = 5.5; // KJ
    else if (highCard >= 12 && lowCard >= 11) strength = 5; // QJ
    else if (gap <= 4 && lowCard >= 7) strength = 4; // Connected cards
    else if (highCard >= 11) strength = 3; // Face card + something
    else strength = 2; // Low cards
    
    // Suited bonus
    if (suited) strength += 0.5;
  }
  
  return Math.min(strength, 10);
}

function getRankValue(rank: number): number {
  // rank is already a number in the Card type
  return rank;
}

function calculatePossibleHands(holeCards: Card[], board: Card[]): { category: string; probability: number }[] {
  // This is a simplified calculation
  // In a real implementation, you'd simulate all possible board completions
  
  const possibleHands: { category: string; probability: number }[] = [];
  
  if (board.length < 5) {
    // Add some basic possibilities based on what's showing
    possibleHands.push(
      { category: 'High Card', probability: 0.4 },
      { category: 'One Pair', probability: 0.3 },
      { category: 'Two Pair', probability: 0.15 },
      { category: 'Three of a Kind', probability: 0.08 },
      { category: 'Straight', probability: 0.03 },
      { category: 'Flush', probability: 0.02 },
      { category: 'Full House', probability: 0.015 },
      { category: 'Four of a Kind', probability: 0.003 },
      { category: 'Straight Flush', probability: 0.001 },
      { category: 'Royal Flush', probability: 0.0001 }
    );
  }
  
  return possibleHands.filter(hand => hand.probability > 0.001);
}

function calculateOuts(holeCards: Card[], board: Card[]): { description: string; cards: Card[]; probability: number }[] {
  const outs: { description: string; cards: Card[]; probability: number }[] = [];
  
  if (board.length >= 5) {
    return outs; // No more cards to come
  }
  
  const cardsRemaining = 5 - board.length;
  const unknownCards = 52 - 2 - board.length; // 52 - hole cards - board cards
  
  // This is a simplified outs calculation
  // In practice, you'd analyze the specific hand for draws
  
  // Example: if we have a flush draw
  const suits = [...holeCards, ...board].reduce((acc, card) => {
    acc[card.suit] = (acc[card.suit] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  Object.entries(suits).forEach(([suit, count]) => {
    if (count === 4) {
      // Flush draw - 9 outs (13 cards in suit - 4 already seen)
      const probability = calculateOutProbability(9, unknownCards, cardsRemaining);
      outs.push({
        description: `Flush (${suit})`,
        cards: [], // Would need to calculate actual cards
        probability
      });
    }
  });
  
  return outs;
}

function calculateOutProbability(outs: number, unknownCards: number, cardsTocome: number): number {
  if (cardsTocome === 1) {
    return outs / unknownCards;
  } else if (cardsTocome === 2) {
    // Probability of hitting on turn OR river
    const missOnTurn = (unknownCards - outs) / unknownCards;
    const missOnRiver = (unknownCards - outs - 1) / (unknownCards - 1);
    return 1 - (missOnTurn * missOnRiver);
  }
  return 0;
}

// Utility function to get a human-readable probability description
export function getProbabilityDescription(probability: number): string {
  if (probability >= 0.8) return 'Very Strong';
  if (probability >= 0.6) return 'Strong';
  if (probability >= 0.4) return 'Moderate';
  if (probability >= 0.2) return 'Weak';
  return 'Very Weak';
}

// Utility function to format probability as percentage
export function formatProbability(probability: number): string {
  return `${(probability * 100).toFixed(1)}%`;
}
