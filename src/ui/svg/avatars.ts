// 1860s Western Saloon Characters - Authentic face-only portraits with period-appropriate features
// All SVGs are hand-crafted to match the gender, race, and personality of each character

export interface Character {
  name: string;
  nickname: string;
  description: string;
}

export const CHARACTERS: Record<string, Character> = {
  P0: { name: 'You', nickname: 'Newcomer', description: 'A fresh face at the saloon table' },
  P1: { name: 'Silas McGraw', nickname: 'Smoky', description: 'Grizzled prospector with a cigar and lucky hat' },
  P2: { name: 'Martha Jensen', nickname: 'Dead-Eye', description: 'Sharp-eyed saloon owner with a kerchief' },
  P3: { name: 'Samuel Whitmore', nickname: 'The Banker', description: 'Well-dressed gentleman with wire spectacles' },
};

export const PLAYER_CHARACTER_OPTIONS: Record<string, Character> = {
  C1: { name: 'Jake Thompson', nickname: 'Lucky', description: 'Young white cowboy with an optimistic outlook' },
  C2: { name: 'Elena Valdez', nickname: 'Rosa', description: 'Mexican woman with elegant style and sharp wit' },
  C3: { name: 'Isaiah Washington', nickname: 'Doc', description: 'Black town doctor with medical expertise and kind heart' },
  C4: { name: 'Wu Chen', nickname: 'Dragon', description: 'Chinese immigrant with railroad experience and quiet strength' },
  C5: { name: 'Sarah O\'Malley', nickname: 'Red', description: 'Irish woman with fiery hair and determined spirit' },
};

// ==================== AI BOT AVATARS ====================

// Silas "Smoky" McGraw - Grizzled white prospector with cigar and hat
function getSilasAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hat -->
      <ellipse cx="50" cy="25" rx="30" ry="8" fill="#2F2F2F"/>
      <rect x="20" y="18" width="60" height="20" fill="#3F3F3F" rx="2"/>
      <rect x="22" y="20" width="56" height="16" fill="#4F4F4F" rx="1"/>
      <circle cx="50" cy="28" r="3" fill="#8B4513"/> <!-- Hat band -->
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="25" ry="30" fill="#D2B48C"/>
      
      <!-- Eyes -->
      <ellipse cx="42" cy="55" rx="3" ry="2" fill="white"/>
      <ellipse cx="58" cy="55" rx="3" ry="2" fill="white"/>
      <circle cx="42" cy="55" r="1.5" fill="#4A4A4A"/>
      <circle cx="58" cy="55" r="1.5" fill="#4A4A4A"/>
      
      <!-- Weathered eyebrows -->
      <path d="M38 50 Q42 48 46 50" stroke="#8B7355" stroke-width="2" fill="none"/>
      <path d="M54 50 Q58 48 62 50" stroke="#8B7355" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 65 L52 65 Z" fill="#C19A6B"/>
      
      <!-- Mouth hidden by mustache -->
      <ellipse cx="50" cy="70" rx="8" ry="3" fill="#8B7355"/> <!-- Mustache -->
      
      <!-- Weathered beard -->
      <path d="M30 75 Q35 82 40 85 Q45 88 50 88 Q55 88 60 85 Q65 82 70 75" 
            fill="#8B7355" stroke="#654321" stroke-width="1"/>
      
      <!-- Cigar -->
      <rect x="65" y="68" width="15" height="3" fill="#8B4513" rx="1"/>
      <rect x="78" y="68.5" width="3" height="2" fill="#CD853F" rx="1"/>
      
      <!-- Smoke wisps -->
      <path d="M82 69 Q85 66 83 63 Q87 61 85 58" stroke="#D3D3D3" stroke-width="1" fill="none" opacity="0.7"/>
      
      <!-- Scars and lines -->
      <path d="M35 52 L40 55" stroke="#A0522D" stroke-width="1" opacity="0.6"/>
      <path d="M32 62 L38 62" stroke="#A0522D" stroke-width="1" opacity="0.4"/>
    </svg>
  `;
}

// Martha "Dead-Eye" Jensen - Sharp-eyed white woman with kerchief
function getMarthaAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Kerchief -->
      <path d="M20 35 Q50 15 80 35 Q75 25 50 20 Q25 25 20 35 Z" fill="#8B0000"/>
      <path d="M22 36 Q50 18 78 36" stroke="#A52A2A" stroke-width="1" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="22" ry="28" fill="#F5DEB3"/>
      
      <!-- Hair (slightly visible under kerchief) -->
      <path d="M28 45 Q35 42 42 45" stroke="#8B4513" stroke-width="2" fill="none"/>
      <path d="M58 45 Q65 42 72 45" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Eyes (sharp and determined) -->
      <ellipse cx="42" cy="55" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="55" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="55" r="2" fill="#4169E1"/> <!-- Piercing blue eyes -->
      <circle cx="58" cy="55" r="2" fill="#4169E1"/>
      <circle cx="42" cy="55" r="0.8" fill="black"/> <!-- Pupils -->
      <circle cx="58" cy="55" r="0.8" fill="black"/>
      
      <!-- Eye highlights -->
      <circle cx="43" cy="54" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="54" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (well-groomed) -->
      <path d="M38 50 Q42 48 46 50" stroke="#654321" stroke-width="2" fill="none"/>
      <path d="M54 50 Q58 48 62 50" stroke="#654321" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 64 L52 64 Z" fill="#DEB887"/>
      
      <!-- Mouth (determined expression) -->
      <path d="M45 70 Q50 72 55 70" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Chin and jawline -->
      <path d="M35 75 Q50 82 65 75" stroke="#DEB887" stroke-width="1" fill="none" opacity="0.3"/>
      
      <!-- Kerchief knot -->
      <ellipse cx="50" cy="38" rx="3" ry="2" fill="#8B0000"/>
      <path d="M47 40 L53 40" stroke="#A52A2A" stroke-width="1"/>
    </svg>
  `;
}

// Samuel "The Banker" Whitmore - Well-dressed white gentleman with spectacles
function getSamuelAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (well-groomed, graying) -->
      <path d="M25 40 Q30 35 35 38 Q40 35 45 38 Q50 32 55 38 Q60 35 65 38 Q70 35 75 40" 
            fill="#696969" stroke="#2F2F2F" stroke-width="1"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="60" rx="24" ry="28" fill="#F5DEB3"/>
      
      <!-- Wire spectacles -->
      <circle cx="42" cy="55" r="8" fill="none" stroke="#2F2F2F" stroke-width="1.5"/>
      <circle cx="58" cy="55" r="8" fill="none" stroke="#2F2F2F" stroke-width="1.5"/>
      <path d="M50 55 L50 53" stroke="#2F2F2F" stroke-width="1.5"/> <!-- Bridge -->
      <path d="M34 55 L25 52" stroke="#2F2F2F" stroke-width="1"/> <!-- Left arm -->
      <path d="M66 55 L75 52" stroke="#2F2F2F" stroke-width="1"/> <!-- Right arm -->
      
      <!-- Eyes behind spectacles -->
      <ellipse cx="42" cy="55" rx="3" ry="2" fill="white"/>
      <ellipse cx="58" cy="55" rx="3" ry="2" fill="white"/>
      <circle cx="42" cy="55" r="1.5" fill="#654321"/> <!-- Brown eyes -->
      <circle cx="58" cy="55" r="1.5" fill="#654321"/>
      
      <!-- Eyebrows (distinguished) -->
      <path d="M36 48 Q42 46 48 48" stroke="#696969" stroke-width="2" fill="none"/>
      <path d="M52 48 Q58 46 64 48" stroke="#696969" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 60 L48 65 L52 65 Z" fill="#DEB887"/>
      
      <!-- Mouth (gentle, professional) -->
      <ellipse cx="50" cy="72" rx="6" ry="2" fill="#CD853F"/>
      
      <!-- Mustache (neatly trimmed) -->
      <ellipse cx="50" cy="68" rx="8" ry="2" fill="#696969"/>
      
      <!-- Collar and tie (visible at bottom) -->
      <rect x="40" y="85" width="20" height="10" fill="white"/>
      <rect x="48" y="85" width="4" height="15" fill="#8B0000"/>
      
      <!-- Side burns -->
      <path d="M26 58 Q28 65 30 72" stroke="#696969" stroke-width="3" fill="none"/>
      <path d="M74 58 Q72 65 70 72" stroke="#696969" stroke-width="3" fill="none"/>
    </svg>
  `;
}

// ==================== PLAYER CHARACTER OPTIONS ====================

// Jake Thompson "Lucky" - Young white cowboy
function getJakeAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Cowboy hat -->
      <ellipse cx="50" cy="20" rx="32" ry="6" fill="#8B4513"/>
      <path d="M18 20 Q20 15 25 12 Q50 8 75 12 Q80 15 82 20" fill="#A0522D"/>
      <rect x="25" y="15" width="50" height="18" fill="#654321" rx="3"/>
      <rect x="45" y="22" width="10" height="4" fill="#8B4513"/> <!-- Hat band -->
      
      <!-- Young face shape -->
      <ellipse cx="50" cy="62" rx="23" ry="26" fill="#F5DEB3"/>
      
      <!-- Hair (sandy brown, youthful) -->
      <path d="M27 42 Q32 38 38 42" stroke="#DEB887" stroke-width="3" fill="none"/>
      <path d="M62 42 Q68 38 73 42" stroke="#DEB887" stroke-width="3" fill="none"/>
      
      <!-- Eyes (bright and optimistic) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#228B22"/> <!-- Green eyes -->
      <circle cx="58" cy="57" r="2" fill="#228B22"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/> <!-- Highlight -->
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (youthful) -->
      <path d="M38 52 Q42 50 46 52" stroke="#DEB887" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#DEB887" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#DEB887"/>
      
      <!-- Mouth (optimistic smile) -->
      <path d="M44 72 Q50 75 56 72" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Clean-shaven chin -->
      <ellipse cx="50" cy="80" rx="12" ry="8" fill="#F5DEB3"/>
      
      <!-- Bandana around neck -->
      <path d="M35 88 Q50 92 65 88" fill="#FF6347" stroke="#CD5C5C" stroke-width="1"/>
    </svg>
  `;
}

// Elena Valdez "Rosa" - Mexican woman with elegant style
function getElenaAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (dark, elegant updo) -->
      <path d="M25 40 Q30 32 40 35 Q50 28 60 35 Q70 32 75 40 Q72 45 65 48 Q50 45 35 48 Q28 45 25 40 Z" 
            fill="#2F1B14"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="22" ry="26" fill="#D2B48C"/>
      
      <!-- Hair decoration (flower) -->
      <circle cx="65" cy="38" r="4" fill="#FF1493"/>
      <circle cx="65" cy="38" r="2" fill="#FFB6C1"/>
      <circle cx="65" cy="38" r="1" fill="#FFFF00"/>
      
      <!-- Eyes (dark and elegant) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2.5" fill="#2F1B14"/> <!-- Dark brown eyes -->
      <circle cx="58" cy="57" r="2.5" fill="#2F1B14"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyelashes -->
      <path d="M39 55 L38 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M42 54 L42 52" stroke="#2F1B14" stroke-width="1"/>
      <path d="M45 55 L46 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M55 55 L54 53" stroke="#2F1B14" stroke-width="1"/>
      <path d="M58 54 L58 52" stroke="#2F1B14" stroke-width="1"/>
      <path d="M61 55 L62 53" stroke="#2F1B14" stroke-width="1"/>
      
      <!-- Eyebrows (well-shaped) -->
      <path d="M38 51 Q42 49 46 51" stroke="#2F1B14" stroke-width="2" fill="none"/>
      <path d="M54 51 Q58 49 62 51" stroke="#2F1B14" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#C19A6B"/>
      
      <!-- Mouth (elegant) -->
      <ellipse cx="50" cy="72" rx="6" ry="2" fill="#8B4513"/>
      
      <!-- Earrings -->
      <circle cx="30" cy="62" r="2" fill="#FFD700"/>
      <circle cx="70" cy="62" r="2" fill="#FFD700"/>
      
      <!-- Shawl/dress neckline -->
      <path d="M30 88 Q50 85 70 88" stroke="#8B0000" stroke-width="3" fill="none"/>
      <path d="M32 90 Q50 87 68 90" stroke="#A52A2A" stroke-width="2" fill="none"/>
    </svg>
  `;
}

// Isaiah Washington "Doc" - Black town doctor
function getIsaiahAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Hair (short, professional) -->
      <path d="M28 40 Q35 35 42 38 Q50 32 58 38 Q65 35 72 40 Q70 45 65 48 Q50 45 35 48 Q30 45 28 40 Z" 
            fill="#1C1C1C"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="24" ry="28" fill="#704A37"/>
      
      <!-- Eyes (kind and intelligent) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#2F1B14"/> <!-- Dark brown eyes -->
      <circle cx="58" cy="57" r="2" fill="#2F1B14"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows -->
      <path d="M38 52 Q42 50 46 52" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L47 67 L53 67 Z" fill="#654321"/>
      
      <!-- Mouth (gentle, wise) -->
      <path d="M44 72 Q50 74 56 72" stroke="#2F1B14" stroke-width="2" fill="none"/>
      
      <!-- Mustache (small, well-groomed) -->
      <ellipse cx="50" cy="69" rx="6" ry="1.5" fill="#1C1C1C"/>
      
      <!-- Goatee -->
      <ellipse cx="50" cy="78" rx="4" ry="6" fill="#1C1C1C"/>
      
      <!-- Medical collar/vest -->
      <rect x="35" y="85" width="30" height="12" fill="white"/>
      <rect x="47" y="85" width="6" height="15" fill="#2F2F2F"/> <!-- Tie -->
      
      <!-- Medical bag handle (just visible) -->
      <path d="M25 85 Q27 82 30 85" stroke="#654321" stroke-width="2" fill="none"/>
    </svg>
  `;
}

// Wu Chen "Dragon" - Chinese immigrant
function getWuAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Traditional hat -->
      <path d="M20 35 Q50 25 80 35" fill="#2F2F2F"/>
      <ellipse cx="50" cy="32" rx="25" ry="8" fill="#1C1C1C"/>
      
      <!-- Hair (traditional queue/braid suggestion) -->
      <path d="M30 45 Q35 42 40 45" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      <path d="M60 45 Q65 42 70 45" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="22" ry="26" fill="#DEB887"/>
      
      <!-- Eyes (almond-shaped, wise) -->
      <path d="M38 57 Q42 55 46 57 Q42 59 38 57 Z" fill="white"/>
      <path d="M54 57 Q58 55 62 57 Q58 59 54 57 Z" fill="white"/>
      <circle cx="42" cy="57" r="1.5" fill="#2F1B14"/>
      <circle cx="58" cy="57" r="1.5" fill="#2F1B14"/>
      
      <!-- Eyebrows (straight, dignified) -->
      <path d="M38 53 L46 53" stroke="#1C1C1C" stroke-width="2"/>
      <path d="M54 53 L62 53" stroke="#1C1C1C" stroke-width="2"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 65 L52 65 Z" fill="#CD853F"/>
      
      <!-- Mouth (stoic expression) -->
      <path d="M46 71 L54 71" stroke="#8B4513" stroke-width="2"/>
      
      <!-- Mustache (thin, traditional) -->
      <path d="M44 69 Q50 68 56 69" stroke="#1C1C1C" stroke-width="1.5" fill="none"/>
      
      <!-- Small goatee -->
      <path d="M49 76 Q50 80 51 76" stroke="#1C1C1C" stroke-width="2" fill="none"/>
      
      <!-- Traditional Chinese collar -->
      <rect x="40" y="88" width="20" height="8" fill="#8B0000"/>
      <path d="M40 88 Q50 85 60 88" stroke="#FFD700" stroke-width="1"/>
    </svg>
  `;
}

// Sarah O'Malley "Red" - Irish woman with fiery red hair
function getSarahAvatar(size = 72): string {
  const w = size; const h = size;
  return `
    <svg width="${w}" height="${h}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Background circle -->
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#654321" stroke-width="2"/>
      
      <!-- Fiery red hair -->
      <path d="M25 35 Q30 28 38 32 Q45 25 50 28 Q55 25 62 32 Q70 28 75 35 Q78 42 75 48 Q70 52 62 50 Q55 55 50 52 Q45 55 38 50 Q30 52 25 48 Q22 42 25 35 Z" 
            fill="#B22222"/>
      <path d="M27 38 Q32 30 40 35" stroke="#DC143C" stroke-width="2" fill="none"/>
      <path d="M60 35 Q68 30 73 38" stroke="#DC143C" stroke-width="2" fill="none"/>
      <path d="M35 45 Q40 40 45 45" stroke="#FF4500" stroke-width="1" fill="none"/>
      <path d="M55 45 Q60 40 65 45" stroke="#FF4500" stroke-width="1" fill="none"/>
      
      <!-- Face shape -->
      <ellipse cx="50" cy="62" rx="21" ry="25" fill="#FFE4E1"/>
      
      <!-- Freckles -->
      <circle cx="45" cy="60" r="0.5" fill="#D2691E" opacity="0.6"/>
      <circle cx="48" cy="58" r="0.4" fill="#D2691E" opacity="0.6"/>
      <circle cx="52" cy="58" r="0.4" fill="#D2691E" opacity="0.6"/>
      <circle cx="55" cy="60" r="0.5" fill="#D2691E" opacity="0.6"/>
      <circle cx="46" cy="65" r="0.3" fill="#D2691E" opacity="0.6"/>
      <circle cx="54" cy="65" r="0.3" fill="#D2691E" opacity="0.6"/>
      
      <!-- Eyes (bright green, determined) -->
      <ellipse cx="42" cy="57" rx="4" ry="3" fill="white"/>
      <ellipse cx="58" cy="57" rx="4" ry="3" fill="white"/>
      <circle cx="42" cy="57" r="2" fill="#228B22"/> <!-- Bright green eyes -->
      <circle cx="58" cy="57" r="2" fill="#228B22"/>
      <circle cx="43" cy="56" r="0.5" fill="white" opacity="0.8"/>
      <circle cx="59" cy="56" r="0.5" fill="white" opacity="0.8"/>
      
      <!-- Eyebrows (red, expressive) -->
      <path d="M38 52 Q42 50 46 52" stroke="#B22222" stroke-width="2" fill="none"/>
      <path d="M54 52 Q58 50 62 52" stroke="#B22222" stroke-width="2" fill="none"/>
      
      <!-- Nose -->
      <path d="M50 62 L48 66 L52 66 Z" fill="#F0C0C0"/>
      
      <!-- Mouth (determined smile) -->
      <path d="M44 71 Q50 73 56 71" stroke="#8B4513" stroke-width="2" fill="none"/>
      
      <!-- Irish shawl -->
      <path d="M28 85 Q35 82 42 85" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M58 85 Q65 82 72 85" stroke="#228B22" stroke-width="3" fill="none"/>
      <path d="M30 88 Q50 85 70 88" stroke="#32CD32" stroke-width="2" fill="none"/>
    </svg>
  `;
}

// ==================== MAIN AVATAR FUNCTION ====================

export function getCharacterAvatarSVG(characterId: string, size = 72): string {
  switch (characterId) {
    // AI Bots
    case 'P1': return getSilasAvatar(size);
    case 'P2': return getMarthaAvatar(size);
    case 'P3': return getSamuelAvatar(size);
    
    // Player character options
    case 'C1': return getJakeAvatar(size);
    case 'C2': return getElenaAvatar(size);
    case 'C3': return getIsaiahAvatar(size);
    case 'C4': return getWuAvatar(size);
    case 'C5': return getSarahAvatar(size);
    
    // Default fallback
    default: return getJakeAvatar(size);
  }
}

// Backwards compatibility exports
export { getSilasAvatar, getMarthaAvatar, getSamuelAvatar };