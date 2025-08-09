import { describe, it, expect } from 'vitest';
import { createInitialGameState, advanceFakePhase, beginNewHand } from '../src/game/state';
import { createStandardDeck, shuffleInPlace } from '../src/game/deck';
import { createRng } from '../src/game/rng';

describe('skeleton boot', () => {
  it('creates initial game state and advances phase', () => {
    const s1 = createInitialGameState();
    expect(s1.phase).toBe('Idle');
    const s2 = advanceFakePhase(s1);
    expect(s2.phase).toBe('Deal');
  });

  it('rng shuffle is deterministic for same seed', () => {
    const a = createStandardDeck();
    const b = createStandardDeck();
    const rng1 = createRng(12345);
    const rng2 = createRng(12345);
    shuffleInPlace(a, rng1);
    shuffleInPlace(b, rng2);
    expect(a.slice(0, 5).map((c) => c.id)).toEqual(b.slice(0, 5).map((c) => c.id));
  });

  it('beginNewHand deals two hole cards to each seat with players', () => {
    const s1 = createInitialGameState();
    const s2 = beginNewHand(s1);
    const players = Object.values(s2.players);
    for (const p of players) {
      expect(p.hand?.c1).toBeTruthy();
      expect(p.hand?.c2).toBeTruthy();
    }
    // Board should be empty preflop
    expect(s2.board.length).toBe(0);
    // Round is preflop with blinds posted
    expect(s2.round?.street).toBe('Preflop');
    expect(s2.round?.currentBet).toBe(s2.bigBlind);
  });
});

