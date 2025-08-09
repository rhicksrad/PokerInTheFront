// Card emoji utility for displaying cards in logs
import { Card } from '../game/types';

// Unicode playing card emojis
const CARD_EMOJI_MAP: Record<string, string> = {
  // Spades (black) - A♠️ 2♠️ 3♠️ 4♠️ 5♠️ 6♠️ 7♠️ 8♠️ 9♠️ 10♠️ J♠️ Q♠️ K♠️
  'AS': '🂡', '2S': '🂢', '3S': '🂣', '4S': '🂤', '5S': '🂥', '6S': '🂦', '7S': '🂧', '8S': '🂨', '9S': '🂩', '10S': '🂪', 'JS': '🂫', 'QS': '🂭', 'KS': '🂮',
  
  // Hearts (red) - A♥️ 2♥️ 3♥️ 4♥️ 5♥️ 6♥️ 7♥️ 8♥️ 9♥️ 10♥️ J♥️ Q♥️ K♥️
  'AH': '🂱', '2H': '🂲', '3H': '🂳', '4H': '🂴', '5H': '🂵', '6H': '🂶', '7H': '🂷', '8H': '🂸', '9H': '🂹', '10H': '🂺', 'JH': '🂻', 'QH': '🂽', 'KH': '🂾',
  
  // Diamonds (red) - A♦️ 2♦️ 3♦️ 4♦️ 5♦️ 6♦️ 7♦️ 8♦️ 9♦️ 10♦️ J♦️ Q♦️ K♦️
  'AD': '🃁', '2D': '🃂', '3D': '🃃', '4D': '🃄', '5D': '🃅', '6D': '🃆', '7D': '🃇', '8D': '🃈', '9D': '🃉', '10D': '🃊', 'JD': '🃋', 'QD': '🃍', 'KD': '🃎',
  
  // Clubs (black) - A♣️ 2♣️ 3♣️ 4♣️ 5♣️ 6♣️ 7♣️ 8♣️ 9♣️ 10♣️ J♣️ Q♣️ K♣️
  'AC': '🃑', '2C': '🃒', '3C': '🃓', '4C': '🃔', '5C': '🃕', '6C': '🃖', '7C': '🃗', '8C': '🃘', '9C': '🃙', '10C': '🃚', 'JC': '🃛', 'QC': '🃝', 'KC': '🃞'
};

/**
 * Convert a card ID (like "KD", "6S") to its emoji representation
 */
export function cardToEmoji(cardId: string): string {
  return CARD_EMOJI_MAP[cardId] || cardId; // Fallback to original ID if no emoji found
}

/**
 * Convert a Card object to its emoji representation
 */
export function cardObjectToEmoji(card: Card): string {
  return cardToEmoji(card.id);
}

/**
 * Convert an array of card IDs to emoji string
 */
export function cardsToEmojiString(cardIds: string[]): string {
  return cardIds.map(cardToEmoji).join(' ');
}

/**
 * Convert an array of Card objects to emoji string
 */
export function cardObjectsToEmojiString(cards: Card[]): string {
  return cards.map(cardObjectToEmoji).join(' ');
}

// Suit emojis
const SUIT_EMOJI_MAP: Record<string, string> = {
  'S': '♠️', // Spades
  'H': '♥️', // Hearts  
  'D': '♦️', // Diamonds
  'C': '♣️'  // Clubs
};

// Rank emojis/symbols
const RANK_EMOJI_MAP: Record<string, string> = {
  'A': 'A',
  '2': '2',
  '3': '3', 
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'J': 'J',
  'Q': 'Q',
  'K': 'K'
};

/**
 * Convert a card ID to separate rank and suit emojis (e.g., "KD" -> "K♦️")
 */
export function cardToRankSuitEmoji(cardId: string): string {
  // Extract rank and suit from card ID
  let rank: string;
  let suit: string;
  
  if (cardId.startsWith('10')) {
    rank = '10';
    suit = cardId[2];
  } else {
    rank = cardId[0];
    suit = cardId[1];
  }
  
  const rankEmoji = RANK_EMOJI_MAP[rank] || rank;
  const suitEmoji = SUIT_EMOJI_MAP[suit] || suit;
  
  return `${rankEmoji}${suitEmoji}`;
}

/**
 * Convert a Card object to separate rank and suit emojis
 */
export function cardObjectToRankSuitEmoji(card: Card): string {
  return cardToRankSuitEmoji(card.id);
}

/**
 * Convert an array of card IDs to rank+suit emoji string
 */
export function cardsToRankSuitEmojiString(cardIds: string[]): string {
  return cardIds.map(cardToRankSuitEmoji).join(' ');
}

/**
 * Convert an array of Card objects to rank+suit emoji string
 */
export function cardObjectsToRankSuitEmojiString(cards: Card[]): string {
  return cards.map(cardObjectToRankSuitEmoji).join(' ');
}

