// Minimal background SVG ornaments to evoke a saloon: lamps and bottles
export function saloonBackdropSVG(width: number, height: number): string {
  const w = width; const h = height;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
  <defs>
    <radialGradient id="lampGlow" cx="50%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#ffd46b" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="${w}" height="${h}" fill="url(#lampGlow)"/>
  <!-- Wall lamps -->
  <g fill="#6b4a2d" stroke="#2a1b12" stroke-width="2">
    <rect x="${w*0.15}" y="${h*0.05}" width="40" height="14" rx="7"/>
    <rect x="${w*0.75}" y="${h*0.05}" width="40" height="14" rx="7"/>
  </g>
  <!-- Bottles on shelf -->
  <g transform="translate(${w*0.1}, ${h*0.85})">
    <rect x="0" y="0" width="${w*0.8}" height="6" fill="#6b4a2d" />
    <g>
      <rect x="20" y="-30" width="10" height="30" fill="#35654d"/>
      <rect x="60" y="-40" width="12" height="40" fill="#274d7a"/>
      <rect x="100" y="-25" width="9" height="25" fill="#7a2b2b"/>
    </g>
  </g>
</svg>`;
}

