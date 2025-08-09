import type { GameState, Card } from '../game/types';
import { computeLegalActions, computeFacingAmount } from '../game/betting';
import { evaluateBestOfSeven } from '../game/evaluator';
import { createRng } from '../game/rng';

export type BotDecision = 'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise';

interface BotPersonality {
  aggression: number; // 0-1, higher = more betting/raising
  tightness: number;  // 0-1, higher = plays fewer hands  
  bluffFreq: number;  // 0-1, how often to bluff
}

/**
 * Enhanced AI Bot Decision Engine
 * 
 * Key Improvements:
 * - Much more realistic preflop hand strength evaluation
 * - Proper pot odds calculation and consideration
 * - Dynamic thresholds based on position and personality
 * - Realistic bluffing and value betting
 * - Stack depth considerations for all-in decisions
 * - Detailed logging for debugging AI decisions
 * 
 * The Banker (Samuel) now has balanced aggression (0.6) and moderate tightness (0.4),
 * making him a calculated risk-taker who won't fold every first hand.
 */

// Different bot personalities mapped to character names
const BOT_PERSONALITIES: Record<number, BotPersonality> = {
  1: { aggression: 0.4, tightness: 0.5, bluffFreq: 0.15 }, // Silas "Smoky" McGraw - Cautious but not overly tight
  2: { aggression: 0.8, tightness: 0.3, bluffFreq: 0.25 }, // Martha "Dead-Eye" Jensen - Aggressive sharpshooter
  3: { aggression: 0.6, tightness: 0.4, bluffFreq: 0.2 },  // Samuel "The Banker" Whitmore - Calculated risk-taker
};

export function decideAction(state: GameState, seatIndex: number): BotDecision {
  const legal = computeLegalActions(state, seatIndex);
  const player = Object.values(state.players).find((p) => p.seatIndex === seatIndex);
  if (!player || !player.hand?.c1 || !player.hand?.c2) {
    return legal.has('Check') ? 'Check' : 'Fold';
  }

  const personality = BOT_PERSONALITIES[seatIndex] || BOT_PERSONALITIES[3];
  const facing = computeFacingAmount(state, player.id);
  const potSize = state.pots.reduce((sum, pot) => sum + pot.amount, 0);
  const rng = createRng(state.rngSeed + seatIndex + state.handNumber); // Include hand number for variety
  
  // Evaluate hand strength
  const handStrength = evaluateHandStrength(player.hand.c1, player.hand.c2, state.board);
  const position = getPosition(seatIndex, state.buttonIndex);
  
  // Calculate pot odds and implied odds
  const potOdds = facing > 0 ? (potSize + facing) / facing : Infinity;
  const stackDepth = player.chips / state.bigBlind;
  
  console.log(`🧠 ${player.name} Analysis:`, {
    hand: `${player.hand.c1.rank}${player.hand.c1.suit} ${player.hand.c2.rank}${player.hand.c2.suit}`,
    handStrength: handStrength.toFixed(2),
    position,
    facing: `$${facing}`,
    potSize: `$${potSize}`,
    potOdds: potOdds.toFixed(1),
    personality: `agg:${personality.aggression} tight:${personality.tightness}`
  });
  
  // Position adjustment - later position can play more hands
  const positionFactor = position === 'early' ? 0.85 : position === 'late' ? 1.15 : 1.0;
  const adjustedHandStrength = Math.min(1.0, handStrength * positionFactor);
  
  // Dynamic thresholds based on personality and situation
  const basePlayThreshold = 0.15 + (personality.tightness * 0.25); // Much lower base threshold
  const aggressionThreshold = 0.5 + (personality.tightness * 0.2);
  const bluffThreshold = 0.3;
  
  // Determine if we should play this hand
  const shouldPlay = adjustedHandStrength >= basePlayThreshold;
  const isStrongHand = adjustedHandStrength >= aggressionThreshold;
  const canBluff = adjustedHandStrength < bluffThreshold && 
                   rng.next() < personality.bluffFreq && 
                   (position === 'late' || state.board.length > 0);
  
  // Special case: All-in situation
  if (facing > 0 && facing >= player.chips) {
    const callThreshold = stackDepth < 10 ? 0.3 : 0.4; // Looser when short-stacked
    return adjustedHandStrength >= callThreshold ? 'Call' : 'Fold';
  }
  
  // Facing a bet - more nuanced decision making
  if (facing > 0) {
    const callThreshold = Math.max(0.2, basePlayThreshold - (Math.log(potOdds) * 0.1));
    
    // Reduce aggression based on number of raises this street
    const raisesThisStreet = state.round?.raisesThisStreet ?? 0;
    const aggressionReduction = Math.min(0.8, raisesThisStreet * 0.2); // Reduce aggression by 20% per raise
    const adjustedAggression = Math.max(0.1, personality.aggression - aggressionReduction);
    
    // Strong hands - usually raise or call, but less likely with multiple raises
    if (isStrongHand) {
      if (rng.next() < adjustedAggression && legal.has('Raise') && raisesThisStreet < 2) {
        console.log(`🚀 ${player.name} raising with strong hand (${adjustedHandStrength.toFixed(2)}) - raises: ${raisesThisStreet}, legal: ${Array.from(legal).join(',')}`);
        return 'Raise';
      }
      console.log(`📞 ${player.name} calling with strong hand (raises: ${raisesThisStreet}, legal: ${Array.from(legal).join(',')})`);
      return legal.has('Call') ? 'Call' : 'Fold';
    }
    
    // Bluff opportunity - much less likely with multiple raises  
    if (canBluff && legal.has('Raise') && state.board.length >= 3 && raisesThisStreet < 1) {
      console.log(`🃏 ${player.name} bluffing (${adjustedHandStrength.toFixed(2)}) - raises: ${raisesThisStreet}`);
      return 'Raise';
    }
    
    // Drawing hands and pot odds
    if (shouldPlay && potOdds >= 2.5) {
      console.log(`📊 ${player.name} calling with pot odds (${potOdds.toFixed(1)}:1)`);
      return legal.has('Call') ? 'Call' : 'Fold';
    }
    
    // Marginal hands - depends on pot odds and hand strength
    if (adjustedHandStrength >= callThreshold) {
      return legal.has('Call') ? 'Call' : 'Fold';
    }
    
    console.log(`❌ ${player.name} folding weak hand (${adjustedHandStrength.toFixed(2)})`);
    return 'Fold';
  }
  
  // No bet facing us - betting/checking decision
  if (isStrongHand && rng.next() < personality.aggression && legal.has('Bet')) {
    console.log(`💪 ${player.name} betting strong hand (${adjustedHandStrength.toFixed(2)})`);
    return 'Bet';
  }
  
  if (canBluff && legal.has('Bet') && state.board.length >= 3) {
    console.log(`🎭 ${player.name} bluff betting (${adjustedHandStrength.toFixed(2)})`);
    return 'Bet';
  }
  
  // Value betting with decent hands
  if (adjustedHandStrength >= 0.4 && rng.next() < (personality.aggression * 0.7) && legal.has('Bet')) {
    console.log(`💰 ${player.name} value betting (${adjustedHandStrength.toFixed(2)})`);
    return 'Bet';
  }
  
  console.log(`✋ ${player.name} checking (${adjustedHandStrength.toFixed(2)})`);
  return legal.has('Check') ? 'Check' : 'Fold';
}

function evaluateHandStrength(c1: Card, c2: Card, board: Card[]): number {
  // Preflop hand strength
  if (board.length === 0) {
    return evaluatePreflopStrength(c1, c2);
  }
  
  // Post-flop: use actual hand evaluation
  try {
    const allCards = [c1, c2, ...board];
    // Pad with dummy cards if needed for evaluation
    while (allCards.length < 7) {
      allCards.push({ suit: 'S', rank: 2 } as Card);
    }
    
    const result = evaluateBestOfSeven(allCards.slice(0, 7));
    
    // Convert hand category to strength (0-1)
    const categoryStrengths: Record<string, number> = {
      'HighCard': 0.1,
      'OnePair': 0.25,
      'TwoPair': 0.4,
      'ThreeKind': 0.6,
      'Straight': 0.75,
      'Flush': 0.8,
      'FullHouse': 0.9,
      'FourKind': 0.95,
      'StraightFlush': 1.0
    };
    
    return categoryStrengths[result.category] || 0.1;
  } catch {
    return evaluatePreflopStrength(c1, c2);
  }
}

function evaluatePreflopStrength(c1: Card, c2: Card): number {
  const r1 = c1.rank;
  const r2 = c2.rank;
  const suited = c1.suit === c2.suit;
  const gap = Math.abs(r1 - r2);
  const highCard = Math.max(r1, r2);
  const lowCard = Math.min(r1, r2);
  
  // Premium pairs (AA, KK, QQ, JJ)
  if (r1 === r2) {
    if (r1 >= 14) return 0.95; // AA
    if (r1 >= 13) return 0.92; // KK  
    if (r1 >= 12) return 0.88; // QQ
    if (r1 >= 11) return 0.82; // JJ
    if (r1 >= 9) return 0.65;  // 99-TT
    if (r1 >= 7) return 0.50;  // 77-88
    if (r1 >= 5) return 0.35;  // 55-66
    return 0.25; // 22-44
  }
  
  // Premium hands (AK, AQ, AJ)
  if (highCard >= 14) { // Ace high
    if (lowCard >= 13) return suited ? 0.87 : 0.78; // AK
    if (lowCard >= 12) return suited ? 0.75 : 0.65; // AQ
    if (lowCard >= 11) return suited ? 0.68 : 0.55; // AJ
    if (lowCard >= 10) return suited ? 0.60 : 0.45; // AT
    if (lowCard >= 9) return suited ? 0.50 : 0.35;  // A9
    if (lowCard >= 7) return suited ? 0.42 : 0.28;  // A7-A8
    if (lowCard >= 5) return suited ? 0.38 : 0.22;  // A5-A6 (wheel aces)
    return suited ? 0.35 : 0.18; // A2-A4
  }
  
  // King high hands
  if (highCard >= 13) { // King high
    if (lowCard >= 12) return suited ? 0.70 : 0.58; // KQ
    if (lowCard >= 11) return suited ? 0.62 : 0.48; // KJ
    if (lowCard >= 10) return suited ? 0.55 : 0.40; // KT
    if (lowCard >= 9) return suited ? 0.45 : 0.30;  // K9
    return suited ? 0.35 : 0.22; // K2-K8
  }
  
  // Queen high hands
  if (highCard >= 12) { // Queen high
    if (lowCard >= 11) return suited ? 0.60 : 0.45; // QJ
    if (lowCard >= 10) return suited ? 0.52 : 0.38; // QT
    if (lowCard >= 9) return suited ? 0.45 : 0.32;  // Q9
    return suited ? 0.32 : 0.20; // Q2-Q8
  }
  
  // Jack high hands
  if (highCard >= 11) { // Jack high
    if (lowCard >= 10) return suited ? 0.50 : 0.36; // JT
    if (lowCard >= 9) return suited ? 0.42 : 0.28;  // J9
    return suited ? 0.30 : 0.18; // J2-J8
  }
  
  // Ten high hands
  if (highCard >= 10) { // Ten high
    if (lowCard >= 9) return suited ? 0.40 : 0.26;  // T9
    if (lowCard >= 8) return suited ? 0.36 : 0.24;  // T8
    return suited ? 0.28 : 0.16; // T2-T7
  }
  
  // Connected cards (potential straights)
  if (gap <= 1 && lowCard >= 6) {
    return suited ? 0.40 : 0.26; // 67+, 78+, etc.
  }
  if (gap <= 1 && lowCard >= 4) {
    return suited ? 0.32 : 0.20; // 45, 56, etc.
  }
  if (gap <= 2 && lowCard >= 7) {
    return suited ? 0.35 : 0.22; // 79, 8T, etc.
  }
  
  // One gap connectors
  if (gap === 2 && lowCard >= 6) {
    return suited ? 0.30 : 0.18; // 68, 79, etc.
  }
  
  // Suited cards (flush potential)
  if (suited) {
    if (lowCard >= 8) return 0.32; // High suited cards
    if (lowCard >= 6) return 0.28; // Medium suited cards
    if (lowCard >= 4) return 0.24; // Low suited cards
    return 0.20; // Very low suited cards
  }
  
  // Two high cards
  if (lowCard >= 9) return 0.25; // 9T, 9J, etc.
  
  // Everything else is pretty weak
  return 0.15; // Weak offsuit hands
}

function getPosition(seatIndex: number, buttonIndex: number): 'early' | 'middle' | 'late' {
  const positions = 4;
  let relative = (seatIndex - buttonIndex + positions) % positions;
  
  if (relative <= 1) return 'late';   // Button and cutoff
  if (relative === 2) return 'middle'; // Middle position
  return 'early'; // Early position
}

