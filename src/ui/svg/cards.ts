import type { Card } from '../../game/types';

const SUIT_SYMBOL: Record<string, string> = {
  S: '♠',
  H: '♥',
  D: '♦',
  C: '♣',
};

const SUIT_COLOR: Record<string, string> = {
  S: '#1d1d1f',
  C: '#1d1d1f',
  H: '#c0392b',
  D: '#c0392b',
};

function rankToLabel(rank: number): string {
  if (rank <= 10) return String(rank);
  const map: Record<number, string> = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  return map[rank] ?? String(rank);
}

export function cardSVG(card: Card, width = 60, height = 84): string {
  const { suit, rank } = card;
  const suitSym = SUIT_SYMBOL[suit] ?? '?';
  const color = SUIT_COLOR[suit] ?? '#000';
  const label = rankToLabel(rank);
  const w = width; const h = height;
  const cornerSize = Math.max(8, Math.floor(w * 0.18));
  const centerSize = Math.floor(Math.min(w, h) * 0.45);
  
  // Create unique IDs for this card to avoid conflicts
  const cardId = `${suit}${rank}${w}${h}`;
  const faceId = `cardface-${cardId}`;
  const borderId = `cardborder-${cardId}`;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-label="${label}${suitSym}">
  <defs>
    <linearGradient id="${faceId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8f8f8"/>
    </linearGradient>
    <linearGradient id="${borderId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="100%" stop-color="#b8b8b8"/>
    </linearGradient>
  </defs>
  <!-- Full card background with border -->
  <rect x="0" y="0" rx="8" ry="8" width="${w}" height="${h}" fill="url(#${borderId})"/>
  <rect x="1" y="1" rx="7" ry="7" width="${w - 2}" height="${h - 2}" fill="url(#${faceId})"/>
  <!-- corners -->
  <g fill="${color}" font-family="Georgia, serif" font-weight="700" text-anchor="start">
    <text x="4" y="${cornerSize}" font-size="${cornerSize}">${label}</text>
    <text x="4" y="${cornerSize + 12}" font-size="${cornerSize * 0.9}">${suitSym}</text>
  </g>
  <g fill="${color}" font-family="Georgia, serif" font-weight="700" text-anchor="end" transform="translate(${w - 4}, ${h - 4}) rotate(180)">
    <text x="0" y="${cornerSize}" font-size="${cornerSize}">${label}</text>
    <text x="0" y="${cornerSize + 12}" font-size="${cornerSize * 0.9}">${suitSym}</text>
  </g>
  <!-- center suit -->
  <g fill="${color}" fill-opacity="0.12" text-anchor="middle" font-family="Georgia, serif" font-weight="700">
    <text x="${w / 2}" y="${h / 2 + centerSize / 3}" font-size="${centerSize}">${suitSym}</text>
  </g>
</svg>`;
}


