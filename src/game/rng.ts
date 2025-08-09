// Seedable PRNG (Mulberry32) – fast and deterministic for gameplay/tests
export interface RNG {
  seed: number;
  next(): number; // in [0,1)
}

export function createRng(seed: number): RNG {
  let s = (seed >>> 0) || 1;
  return {
    get seed() {
      return s;
    },
    set seed(v: number) {
      s = (v >>> 0) || 1;
    },
    next(): number {
      // Mulberry32
      s += 0x6D2B79F5;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  } as RNG;
}

export function rngInt(rng: RNG, minInclusive: number, maxExclusive: number): number {
  return Math.floor(rng.next() * (maxExclusive - minInclusive)) + minInclusive;
}

