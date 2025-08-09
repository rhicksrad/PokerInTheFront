import type { GameState, Card, Player, BetAction } from './types';

export interface HandAction {
  timestamp: number;
  handNumber: number;
  phase: string;
  street?: string;
  playerId: string;
  playerName: string;
  seatIndex: number;
  action: BetAction | 'Deal' | 'ShowCards' | 'WinPot';
  amount?: number;
  cards?: Card[];
  potIndex?: number;
  handCategory?: string;
}

export interface HandSummary {
  handNumber: number;
  timestamp: number;
  buttonIndex: number;
  finalPot: number;
  winners: Array<{
    playerId: string;
    playerName: string;
    amount: number;
    handCategory?: string;
  }>;
  actions: HandAction[];
  boardCards: Card[];
  players: Array<{
    id: string;
    name: string;
    seatIndex: number;
    startingChips: number;
    endingChips: number;
    holeCards?: Card[];
    finalAction?: BetAction;
  }>;
}

export class HandHistoryTracker {
  private currentHandActions: HandAction[] = [];
  private completedHands: HandSummary[] = [];
  private currentHandStartTime: number = 0;
  private playersAtStart: Map<string, number> = new Map();

  startNewHand(state: GameState): void {
    this.currentHandActions = [];
    this.currentHandStartTime = Date.now();
    this.playersAtStart.clear();
    
    // Record starting chip counts
    Object.values(state.players).forEach(player => {
      this.playersAtStart.set(player.id, player.chips);
    });

    // Record deal action
    this.addAction({
      timestamp: this.currentHandStartTime,
      handNumber: state.handNumber,
      phase: 'Deal',
      playerId: 'system',
      playerName: 'Dealer',
      seatIndex: -1,
      action: 'Deal'
    });
  }

  addAction(action: HandAction): void {
    this.currentHandActions.push(action);
  }

  recordPlayerAction(
    state: GameState, 
    playerId: string, 
    action: BetAction, 
    amount?: number
  ): void {
    const player = state.players[playerId];
    if (!player) return;

    this.addAction({
      timestamp: Date.now(),
      handNumber: state.handNumber,
      phase: state.phase,
      street: state.round?.street,
      playerId,
      playerName: player.name,
      seatIndex: player.seatIndex,
      action,
      amount
    });
  }

  recordBoardReveal(state: GameState, street: string, newCards: Card[]): void {
    this.addAction({
      timestamp: Date.now(),
      handNumber: state.handNumber,
      phase: state.phase,
      street,
      playerId: 'system',
      playerName: 'Dealer',
      seatIndex: -1,
      action: 'Deal',
      cards: newCards
    });
  }

  recordShowdown(state: GameState, winners: Array<{
    playerId: string;
    amount: number;
    handCategory?: string;
  }>): void {
    // Record cards being shown
    Object.values(state.players).forEach(player => {
      if (!player.isFolded && player.hand?.c1 && player.hand?.c2) {
        this.addAction({
          timestamp: Date.now(),
          handNumber: state.handNumber,
          phase: 'Showdown',
          playerId: player.id,
          playerName: player.name,
          seatIndex: player.seatIndex,
          action: 'ShowCards',
          cards: [player.hand.c1, player.hand.c2]
        });
      }
    });

    // Record winnings
    winners.forEach((winner, index) => {
      const player = state.players[winner.playerId];
      if (player) {
        this.addAction({
          timestamp: Date.now(),
          handNumber: state.handNumber,
          phase: 'Showdown',
          playerId: winner.playerId,
          playerName: player.name,
          seatIndex: player.seatIndex,
          action: 'WinPot',
          amount: winner.amount,
          potIndex: index,
          handCategory: winner.handCategory
        });
      }
    });
  }

  completeHand(state: GameState): void {
    const handSummary: HandSummary = {
      handNumber: state.handNumber,
      timestamp: this.currentHandStartTime,
      buttonIndex: state.buttonIndex,
      finalPot: state.pots.reduce((sum, pot) => sum + pot.amount, 0),
      winners: this.currentHandActions
        .filter(action => action.action === 'WinPot')
        .map(action => ({
          playerId: action.playerId,
          playerName: action.playerName,
          amount: action.amount || 0,
          handCategory: action.handCategory
        })),
      actions: [...this.currentHandActions],
      boardCards: [...state.board],
      players: Object.values(state.players).map(player => ({
        id: player.id,
        name: player.name,
        seatIndex: player.seatIndex,
        startingChips: this.playersAtStart.get(player.id) || 0,
        endingChips: player.chips,
        holeCards: player.hand ? [player.hand.c1, player.hand.c2] : undefined,
        finalAction: this.getPlayerFinalAction(player.id)
      }))
    };

    this.completedHands.push(handSummary);
    this.currentHandActions = [];
  }

  private getPlayerFinalAction(playerId: string): BetAction | undefined {
    const playerActions = this.currentHandActions
      .filter(action => action.playerId === playerId && 
               ['Fold', 'Check', 'Call', 'Bet', 'Raise'].includes(action.action as string))
      .reverse();
    
    return playerActions[0]?.action as BetAction;
  }

  getCompletedHands(): HandSummary[] {
    return [...this.completedHands];
  }

  getCurrentHandActions(): HandAction[] {
    return [...this.currentHandActions];
  }

  exportToJSON(): string {
    return JSON.stringify({
      metadata: {
        exportTime: new Date().toISOString(),
        totalHands: this.completedHands.length,
        gameType: 'Texas Hold\'em',
        stakes: 'Play Money'
      },
      hands: this.completedHands
    }, null, 2);
  }

  exportToCSV(): string {
    const headers = [
      'Hand#', 'Timestamp', 'Phase', 'Street', 'Player', 'Seat', 'Action', 'Amount', 'Cards'
    ];
    
    const rows = this.completedHands.flatMap(hand =>
      hand.actions.map(action => [
        hand.handNumber,
        new Date(action.timestamp).toISOString(),
        action.phase,
        action.street || '',
        action.playerName,
        action.seatIndex,
        action.action,
        action.amount || '',
        action.cards ? action.cards.map(c => `${c.rank}${c.suit}`).join(',') : ''
      ])
    );

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  clear(): void {
    this.completedHands = [];
    this.currentHandActions = [];
    this.playersAtStart.clear();
  }
}

// Global instance
export const handHistoryTracker = new HandHistoryTracker();
