import { Card, Rank, Suit } from './types';

export type HandRankCategory =
  | 'HighCard'
  | 'OnePair'
  | 'TwoPair'
  | 'ThreeKind'
  | 'Straight'
  | 'Flush'
  | 'FullHouse'
  | 'FourKind'
  | 'StraightFlush';

export interface EvalResult {
  category: HandRankCategory;
  tiebreak: number[]; // high to low for comparison
}

const CATEGORY_ORDER: Record<HandRankCategory, number> = {
  HighCard: 0,
  OnePair: 1,
  TwoPair: 2,
  ThreeKind: 3,
  Straight: 4,
  Flush: 5,
  FullHouse: 6,
  FourKind: 7,
  StraightFlush: 8,
};

export function compareEvalResults(a: EvalResult, b: EvalResult): number {
  const ca = CATEGORY_ORDER[a.category];
  const cb = CATEGORY_ORDER[b.category];
  
  if (ca !== cb) {
    return ca - cb;
  }
  
  const len = Math.max(a.tiebreak.length, b.tiebreak.length);
  for (let i = 0; i < len; i++) {
    const va = a.tiebreak[i] ?? 0;
    const vb = b.tiebreak[i] ?? 0;
    if (va !== vb) {
      return va - vb;
    }
  }
  return 0;
}

export function evaluateBestOfSeven(cards: Card[]): EvalResult {
  if (cards.length !== 7) throw new Error('evaluateBestOfSeven requires 7 cards');
  const rankCounts = new Map<number, number>();
  const suitToCards = new Map<Suit, Card[]>();
  for (const c of cards) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1);
    const arr = suitToCards.get(c.suit) ?? [];
    arr.push(c);
    suitToCards.set(c.suit, arr);
  }

  // Flush detection
  let flushSuit: Suit | undefined;
  for (const [s, arr] of suitToCards.entries()) {
    if (arr.length >= 5) { flushSuit = s; break; }
  }

  // Straight detection helper on a set of ranks
  const uniqueRanks = Array.from(new Set(cards.map((c) => c.rank))).sort((a, b) => a - b);
  const straightHigh = findStraightHigh(uniqueRanks);

  // Straight flush
  if (flushSuit) {
    const flushRanks = Array.from(new Set((suitToCards.get(flushSuit) ?? []).map((c) => c.rank))).sort((a, b) => a - b);
    const sfHigh = findStraightHigh(flushRanks);
    if (sfHigh > 0) {
      return { category: 'StraightFlush', tiebreak: [sfHigh] };
    }
  }

  // Four of a kind
  const quads = findOfAKind(rankCounts, 4);
  if (quads) {
    const kicker = highestExcluding(uniqueRanks, [quads]);
    return { category: 'FourKind', tiebreak: [quads, kicker] };
  }

  // Full house (best trip + best pair from remaining)
  const trips = findAllOfAKind(rankCounts, 3);
  if (trips.length) {
    const remainingPairs = findAllPairs(rankCounts, trips[0]);
    if (remainingPairs.length) {
      return { category: 'FullHouse', tiebreak: [trips[0], remainingPairs[0]] };
    }
    if (trips.length >= 2) {
      // Use second trip as pair
      return { category: 'FullHouse', tiebreak: [trips[0], trips[1]] };
    }
  }

  // Flush
  if (flushSuit) {
    const flushRanksDesc = (suitToCards.get(flushSuit) ?? []).map((c) => c.rank).sort((a, b) => b - a);
    const top5 = flushRanksDesc.slice(0, 5);
    return { category: 'Flush', tiebreak: top5 };
  }

  // Straight
  if (straightHigh > 0) {
    return { category: 'Straight', tiebreak: [straightHigh] };
  }

  // Three of a kind
  if (trips.length) {
    const kickers = topKickersExcluding(uniqueRanks, [trips[0]], 2);
    return { category: 'ThreeKind', tiebreak: [trips[0], ...kickers] };
  }

  // Two pair
  const pairs = findAllPairs(rankCounts);
  if (pairs.length >= 2) {
    const [p1, p2] = pairs.slice(0, 2);
    const kicker = highestExcluding(uniqueRanks, [p1, p2]);
    return { category: 'TwoPair', tiebreak: [p1, p2, kicker] };
  }

  // One pair
  if (pairs.length === 1) {
    const [p1] = pairs;
    const kickers = topKickersExcluding(uniqueRanks, [p1], 3);
    return { category: 'OnePair', tiebreak: [p1, ...kickers] };
  }

  // High card
  const highs = [...uniqueRanks].sort((a, b) => b - a).slice(0, 5);
  return { category: 'HighCard', tiebreak: highs };
}

function findStraightHigh(sortedRanksAsc: number[]): number {
  if (sortedRanksAsc.length === 0) return 0;
  // Handle wheel A-2-3-4-5: if Ace present, treat as rank 1
  const ranks = [...sortedRanksAsc];
  if (ranks[ranks.length - 1] === Rank.Ace) ranks.unshift(1);
  let run = 1;
  let bestHigh = 0;
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i] === ranks[i - 1]) continue;
    if (ranks[i] === ranks[i - 1] + 1) {
      run++;
      if (run >= 5) bestHigh = ranks[i];
    } else {
      run = 1;
    }
  }
  // Map rank 5 high (from wheel) back to 5 as the high indicator. Already is 5.
  return bestHigh;
}

function findOfAKind(rankCounts: Map<number, number>, n: number): number | undefined {
  const ranksDesc = Array.from(rankCounts.entries())
    .filter(([, c]) => c >= n)
    .map(([r]) => r)
    .sort((a, b) => b - a);
  return ranksDesc[0];
}

function findAllOfAKind(rankCounts: Map<number, number>, n: number): number[] {
  return Array.from(rankCounts.entries())
    .filter(([, c]) => c >= n)
    .map(([r]) => r)
    .sort((a, b) => b - a);
}

function findAllPairs(rankCounts: Map<number, number>, excludeRank?: number): number[] {
  return Array.from(rankCounts.entries())
    .filter(([r, c]) => c >= 2 && r !== excludeRank)
    .map(([r]) => r)
    .sort((a, b) => b - a);
}

function highestExcluding(uniqueRanksAsc: number[], exclude: number[]): number {
  for (let i = uniqueRanksAsc.length - 1; i >= 0; i--) {
    const r = uniqueRanksAsc[i];
    if (!exclude.includes(r)) return r;
  }
  return 0;
}

function topKickersExcluding(uniqueRanksAsc: number[], exclude: number[], k: number): number[] {
  const res: number[] = [];
  for (let i = uniqueRanksAsc.length - 1; i >= 0 && res.length < k; i--) {
    const r = uniqueRanksAsc[i];
    if (!exclude.includes(r)) res.push(r);
  }
  return res;
}

