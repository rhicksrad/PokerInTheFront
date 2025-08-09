import { describe, it, expect } from 'vitest';
import { evaluateBestOfSeven, compareEvalResults } from '../src/game/evaluator';
import { Rank } from '../src/game/types';

function C(rank: number, suit: 'S'|'H'|'D'|'C') {
  const map: Record<string, number> = { S: 0, H: 1, D: 2, C: 3 };
  const idMap: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' } as any;
  const rStr = rank <= 10 ? String(rank) : idMap[rank] ?? String(rank);
  return { rank, suit, id: rStr + suit } as any;
}

describe('evaluator 7-card', () => {
  it('detects straight flush > four of a kind', () => {
    const sf = evaluateBestOfSeven([
      C(Rank.Ten, 'S'), C(Rank.Jack, 'S'), C(Rank.Queen, 'S'), C(Rank.King, 'S'), C(Rank.Ace, 'S'), C(2, 'D'), C(3, 'C')
    ]);
    const fk = evaluateBestOfSeven([
      C(9, 'S'), C(9, 'H'), C(9, 'D'), C(9, 'C'), C(3, 'S'), C(4, 'H'), C(5, 'D')
    ]);
    expect(compareEvalResults(sf, fk)).toBeGreaterThan(0);
  });

  it('handles wheel straight A-5', () => {
    const st = evaluateBestOfSeven([
      C(Rank.Ace, 'S'), C(2, 'S'), C(3, 'H'), C(4, 'D'), C(5, 'C'), C(9, 'S'), C(12, 'H')
    ]);
    expect(st.category).toBe('Straight');
    expect(st.tiebreak[0]).toBe(5);
  });

  it('two pair vs one pair', () => {
    const tp = evaluateBestOfSeven([
      C(7, 'S'), C(7, 'H'), C(5, 'D'), C(5, 'C'), C(2, 'S'), C(9, 'H'), C(11, 'D')
    ]);
    const op = evaluateBestOfSeven([
      C(7, 'S'), C(7, 'D'), C(8, 'C'), C(4, 'H'), C(3, 'S'), C(2, 'H'), C(9, 'D')
    ]);
    expect(compareEvalResults(tp, op)).toBeGreaterThan(0);
  });
});

