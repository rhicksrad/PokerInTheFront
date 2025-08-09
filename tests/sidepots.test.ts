import { describe, it, expect } from 'vitest';
import { rebuildPots } from '../src/game/betting';

describe('side pots', () => {
  it('creates layered pots for different contribution caps', () => {
    const players = {
      A: { isFolded: false },
      B: { isFolded: false },
      C: { isFolded: false },
    } as any;
    const contrib = { A: 100, B: 50, C: 200 } as any;
    const pots = rebuildPots(contrib, players);
    // caps: 50, 100, 200
    // pot0: 3 players pay 0..50 => 150
    // pot1: players with >50 pay next 50 => A 50 + C 50 => 100
    // pot2: players with >100 pay next 100 => C 100 => 100
    expect(pots.length).toBe(3);
    expect(pots[0].amount).toBe(150);
    expect(pots[1].amount).toBe(100);
    expect(pots[2].amount).toBe(100);
  });
});

