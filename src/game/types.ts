export type Suit = 'C' | 'D' | 'H' | 'S';

export enum Rank {
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace,
}

export interface Card {
  rank: Rank;
  suit: Suit;
  id: string;
}

export interface Deck {
  cards: Card[];
}

export type PlayerId = string;

export interface Hand {
  c1?: Card;
  c2?: Card;
}

export interface Player {
  id: PlayerId;
  name: string;
  isHuman: boolean;
  seatIndex: number;
  chips: number;
  hand?: Hand;
  isFolded: boolean;
  isAllIn: boolean;
  isBustedOut?: boolean;
}

export interface Seat {
  index: number;
  playerId?: PlayerId;
  isButton?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
}

export type BetActionType = 'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise' | 'PostBlind';

export interface BetAction {
  type: BetActionType;
  amount?: number;
  playerId: PlayerId;
  street?: 'Preflop' | 'Flop' | 'Turn' | 'River';
  timestamp: number;
}

export interface Pot {
  amount: number;
  contributors: Record<PlayerId, number>;
  eligible: PlayerId[];
}

export type Phase =
  | 'Idle'
  | 'Deal'
  | 'Preflop'
  | 'Flop'
  | 'Turn'
  | 'River'
  | 'Showdown'
  | 'Payout'
  | 'NextHand'
  | 'GameOver';

export interface RoundState {
  street: 'Preflop' | 'Flop' | 'Turn' | 'River';
  currentBet: number;
  minRaise: number;
  toActQueue: number[];
  actions: BetAction[];
  committedThisStreet: Record<PlayerId, number>;
  currentTurnSeatIndex: number;
  raisesThisStreet: number; // Track how many raises have occurred
}

export interface HandSummary {
  handNumber: number;
  finalPot: number;
  winners: Array<{
    playerName: string;
    amount: number;
    handCategory: string;
  }>;
}

export interface GameState {
  handNumber: number;
  smallBlind: number;
  bigBlind: number;
  buttonIndex: number;
  seats: Seat[];
  players: Record<PlayerId, Player>;
  board: Card[];
  deck: Card[];
  pots: Pot[];
  handContributions: Record<PlayerId, number>; // total chips contributed this hand
  round?: RoundState;
  phase: Phase;
  rngSeed: number;
  devLog: string[];
  handSummary?: HandSummary;
  winner?: PlayerId;
  showdownProcessed?: boolean; // Flag to prevent duplicate showdown processing
}

