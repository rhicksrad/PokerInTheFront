import { Card, Rank, Suit } from './types';
import { RNG, rngInt } from './rng';

export function createStandardDeck(): Card[] {
  const suits: Suit[] = ['C', 'D', 'H', 'S'];
  const cards: Card[] = [];
  for (const suit of suits) {
    for (let r = Rank.Two; r <= Rank.Ace; r++) {
      const rank = r as Rank;
      cards.push({ rank, suit, id: rankToString(rank) + suit });
    }
  }
  return cards;
}

export function rankToString(rank: Rank): string {
  if (rank <= 10) return String(rank);
  return { [Rank.Jack]: 'J', [Rank.Queen]: 'Q', [Rank.King]: 'K', [Rank.Ace]: 'A' }[rank] as string;
}

export function shuffleInPlace(cards: Card[], rng: RNG): void {
  // Fisher–Yates shuffle for true randomness
  for (let i = cards.length - 1; i > 0; i--) {
    const j = rngInt(rng, 0, i + 1);
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}

export function draw(cards: Card[], n: number): Card[] {
  return cards.splice(0, n);
}

// Utility function to verify deck integrity
export function verifyDeckIntegrity(deck: Card[]): boolean {
  if (deck.length !== 52) {
    console.warn('⚠️ Deck integrity check failed: Expected 52 cards, got', deck.length);
    return false;
  }
  
  const cardIds = new Set(deck.map(card => card.id));
  if (cardIds.size !== 52) {
    console.warn('⚠️ Deck integrity check failed: Duplicate cards detected');
    return false;
  }
  
  // Verify all cards are present
  const suits: Suit[] = ['C', 'D', 'H', 'S'];
  for (const suit of suits) {
    for (let r = Rank.Two; r <= Rank.Ace; r++) {
      const rank = r as Rank;
      const expectedId = rankToString(rank) + suit;
      if (!cardIds.has(expectedId)) {
        console.warn('⚠️ Deck integrity check failed: Missing card', expectedId);
        return false;
      }
    }
  }
  
  return true;
}

// Function to get remaining cards after dealing
export function getRemainingCards(dealtCards: Set<string>): Card[] {
  const fullDeck = createStandardDeck();
  return fullDeck.filter(card => !dealtCards.has(card.id));
}

