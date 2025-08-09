import { PLAYER_CHARACTER_OPTIONS, type Character } from './svg/avatars';
import { getCharacterAvatarSVG } from './svg/avatars';
import { achievementTracker } from '../game/achievements';

export interface StartScreenCallbacks {
  onCharacterSelected: (characterId: string) => void;
}

type StartScreenView = 'main' | 'character-select' | 'about' | 'options' | 'achievements';

let currentView: StartScreenView = 'main';
let soundEnabled = true;

export function renderStartScreen(container: HTMLElement, callbacks: StartScreenCallbacks): void {
  container.innerHTML = getStartScreenHTML();
  setupStartScreenEventListeners(container, callbacks);
}

function getStartScreenHTML(): string {
  const baseHTML = `
    <div class="start-screen">
      <div class="saloon-backdrop">
        <div class="desert-bg"></div>
        <div class="mountains"></div>
        <div class="saloon-building">
          <div class="saloon-roof"></div>
          <div class="saloon-front">
            <div class="saloon-doors"></div>
            <div class="saloon-windows"></div>
            <div class="saloon-sign">
              <div class="sign-board">
                <h1 class="game-title">POKER IN THE FRONT</h1>
                <p class="saloon-tagline">★ THE WILDEST SALOON IN THE WEST ★</p>
              </div>
            </div>
          </div>
        </div>
        <div class="dust-particles"></div>
      </div>
      
      <div class="start-content">
        <div class="start-view-content">
          ${getViewContent()}
        </div>
        
        ${currentView !== 'main' ? '<button class="back-btn western-btn"><span class="btn-icon">🔙</span> Back to Saloon</button>' : ''}
      </div>
    </div>
  `;
  return baseHTML;
}

function getViewContent(): string {
  switch (currentView) {
    case 'main':
      return `
        <div class="main-menu">
          <div class="saloon-entrance">
            <div class="swinging-doors" id="saloon-doors">
              <svg class="saloon-doors-svg" width="200" height="140" viewBox="0 0 200 140">
                <!-- Door Frame -->
                <rect x="10" y="10" width="180" height="120" fill="none" stroke="#8B4513" stroke-width="3" rx="5"/>
                
                <!-- Left Door -->
                <g class="door-left">
                  <!-- Door Panel -->
                  <rect x="15" y="15" width="85" height="110" fill="#D2691E" stroke="#8B4513" stroke-width="2" rx="3"/>
                  
                  <!-- Wood Grain Lines -->
                  <line x1="20" y1="25" x2="95" y2="25" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="35" x2="95" y2="35" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="45" x2="95" y2="45" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="65" x2="95" y2="65" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="85" x2="95" y2="85" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="20" y1="105" x2="95" y2="105" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="20" y1="115" x2="95" y2="115" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  
                  <!-- Slats -->
                  <rect x="20" y="50" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="20" y="62" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="20" y="74" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  
                  <!-- Door Handle -->
                  <circle cx="90" cy="70" r="3" fill="#DAA520" stroke="#B8860B" stroke-width="1"/>
                  <rect x="87" y="68" width="6" height="4" fill="#DAA520" stroke="#B8860B" stroke-width="1" rx="1"/>
                  
                  <!-- Hinges -->
                  <rect x="17" y="25" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="17" y="45" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="17" y="95" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                </g>
                
                <!-- Right Door -->
                <g class="door-right">
                  <!-- Door Panel -->
                  <rect x="100" y="15" width="85" height="110" fill="#D2691E" stroke="#8B4513" stroke-width="2" rx="3"/>
                  
                  <!-- Wood Grain Lines -->
                  <line x1="105" y1="25" x2="180" y2="25" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="35" x2="180" y2="35" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="45" x2="180" y2="45" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="65" x2="180" y2="65" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="85" x2="180" y2="85" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  <line x1="105" y1="105" x2="180" y2="105" stroke="#A0522D" stroke-width="1" opacity="0.5"/>
                  <line x1="105" y1="115" x2="180" y2="115" stroke="#A0522D" stroke-width="1" opacity="0.7"/>
                  
                  <!-- Slats -->
                  <rect x="105" y="50" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="105" y="62" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  <rect x="105" y="74" width="75" height="8" fill="#CD853F" stroke="#8B4513" stroke-width="1"/>
                  
                  <!-- Door Handle -->
                  <circle cx="110" cy="70" r="3" fill="#DAA520" stroke="#B8860B" stroke-width="1"/>
                  <rect x="107" y="68" width="6" height="4" fill="#DAA520" stroke="#B8860B" stroke-width="1" rx="1"/>
                  
                  <!-- Hinges -->
                  <rect x="179" y="25" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="179" y="45" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                  <rect x="179" y="95" width="4" height="8" fill="#696969" stroke="#2F4F4F" stroke-width="1" rx="1"/>
                </g>
                
                <!-- "SALOON" text above doors -->
                <text x="100" y="8" text-anchor="middle" fill="#8B4513" font-family="serif" font-size="12" font-weight="bold">SALOON</text>
                
                <!-- Decorative elements -->
                <circle cx="30" cy="5" r="2" fill="#DAA520"/>
                <circle cx="170" cy="5" r="2" fill="#DAA520"/>
              </svg>
            </div>
            <p class="entrance-text">🤠 Click the saloon doors to enter the game! 🤠</p>
          </div>
          
          <div class="menu-buttons">
            <button class="western-btn menu-btn primary" data-action="character-select">
              <div class="btn-badge">★</div>
              <div class="btn-content">
                <span class="btn-icon">🤠</span>
                <span class="btn-text">SADDLE UP & PLAY</span>
                <span class="btn-desc">Choose your gunslinger and hit the tables</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="about">
              <div class="btn-badge">?</div>
              <div class="btn-content">
                <span class="btn-icon">📜</span>
                <span class="btn-text">SALOON RULES</span>
                <span class="btn-desc">Learn the ways of the Old West poker</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="options">
              <div class="btn-badge">⚙</div>
              <div class="btn-content">
                <span class="btn-icon">🔧</span>
                <span class="btn-text">SETTINGS</span>
                <span class="btn-desc">Adjust your gaming experience</span>
              </div>
              <div class="btn-shine"></div>
            </button>
            
            <button class="western-btn menu-btn" data-action="achievements">
              <div class="btn-badge">🏆</div>
              <div class="btn-content">
                <span class="btn-icon">🎖️</span>
                <span class="btn-text">HONORS & AWARDS</span>
                <span class="btn-desc">Your legendary poker achievements</span>
              </div>
              <div class="btn-shine"></div>
            </button>
          </div>
        </div>
      `;
      
    case 'character-select':
      return `
        <div class="character-select">
          <div class="sheriff-notice">
            <div class="notice-board">
              <div class="notice-header">
                <h2 class="view-title">★ WANTED ★</h2>
                <p class="view-subtitle">POKER PLAYERS FOR HIGH STAKES GAME</p>
                <div class="notice-decoration">~ Choose Your Gunslinger ~</div>
              </div>
            </div>
          </div>
          
          <div class="character-grid">
            ${Object.entries(PLAYER_CHARACTER_OPTIONS).map(([id, character]) => `
              <div class="wanted-poster" data-character-id="${id}">
                <div class="poster-frame">
                  <div class="poster-header">
                    <div class="wanted-text">WANTED</div>
                    <div class="reward-text">FOR POKER</div>
                  </div>
                  
                  <div class="character-portrait">
                    <div class="portrait-frame">
                      ${getCharacterAvatarSVG(id, 120)}
                    </div>
                  </div>
                  
                  <div class="character-details">
                    <h3 class="character-name">${character.name}</h3>
                    <p class="character-alias">"${character.description}"</p>
                    <div class="reward-amount">REWARD: GLORY</div>
                  </div>
                  
                  <div class="poster-footer">
                    <div class="select-text">CLICK TO RECRUIT</div>
                  </div>
                  
                  <div class="poster-nails">
                    <div class="nail nail-tl"></div>
                    <div class="nail nail-tr"></div>
                    <div class="nail nail-bl"></div>
                    <div class="nail nail-br"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
    case 'about':
      return `
        <div class="rules-saloon">
          <div class="saloon-header">
            <svg width="80" height="80" viewBox="0 0 80 80" class="poker-badge">
              <!-- Poker Chip Badge -->
              <circle cx="40" cy="40" r="35" fill="#8B4513" stroke="#654321" stroke-width="3"/>
              <circle cx="40" cy="40" r="28" fill="#D2691E" stroke="#8B4513" stroke-width="2"/>
              <circle cx="40" cy="40" r="20" fill="#CD853F" stroke="#A0522D" stroke-width="1"/>
              
              <!-- Poker symbols around the edge -->
              <text x="40" y="20" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♠</text>
              <text x="60" y="45" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♥</text>
              <text x="40" y="65" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♦</text>
              <text x="20" y="45" text-anchor="middle" fill="#8B4513" font-size="8" font-weight="bold">♣</text>
              
              <!-- Center text -->
              <text x="40" y="38" text-anchor="middle" fill="#8B4513" font-size="7" font-weight="bold">TEXAS</text>
              <text x="40" y="47" text-anchor="middle" fill="#8B4513" font-size="7" font-weight="bold">HOLD'EM</text>
            </svg>
            <h2 class="saloon-title">★ SALOON RULES & LORE ★</h2>
            <p class="saloon-subtitle">~ The Laws of the Wild West Poker Table ~</p>
          </div>

          <div class="rules-scroll">
            <div class="scroll-content">
              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🤠 Welcome to the Frontier</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <p class="rule-text">Step through them swinging doors into an 1860s Western saloon where legends are made and fortunes won. Test your mettle against three cunning AI gunslingers in the most authentic Old West poker experience this side of the Mississippi.</p>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🎰 Game Features</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="features-grid">
                  <div class="feature-item">
                    <span class="feature-icon">🃏</span>
                    <span class="feature-text">Classic Texas Hold'em rules</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🤖</span>
                    <span class="feature-text">Three AI opponents with distinct personalities</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🎨</span>
                    <span class="feature-text">Hand-crafted Western SVG graphics</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">🔊</span>
                    <span class="feature-text">Immersive frontier sound effects</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span class="feature-text">Responsive design for any device</span>
                  </div>
                  <div class="feature-item">
                    <span class="feature-icon">📖</span>
                    <span class="feature-text">Built-in poker hand reference guide</span>
                  </div>
                </div>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">🎯 How to Play</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="gameplay-steps">
                  <div class="step-item">
                    <div class="step-number">1</div>
                    <div class="step-content">
                      <h4>The Deal</h4>
                      <p>Each player receives two private "hole" cards. Keep 'em close to your vest, partner!</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">2</div>
                    <div class="step-content">
                      <h4>The Flop</h4>
                      <p>Three community cards are revealed. These belong to everyone at the table.</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">3</div>
                    <div class="step-content">
                      <h4>The Turn & River</h4>
                      <p>One more card each round, for a total of five community cards.</p>
                    </div>
                  </div>
                  <div class="step-item">
                    <div class="step-number">4</div>
                    <div class="step-content">
                      <h4>The Showdown</h4>
                      <p>Make the best 5-card hand using any combination of your cards and the community cards. May the best hand win!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="rule-section">
                <div class="section-header">
                  <h3 class="section-title">⭐ Frontier Code</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="frontier-code">
                  <p class="code-line">★ No accounts needed - just pure poker skill</p>
                  <p class="code-line">★ No real money - only bragging rights</p>
                  <p class="code-line">★ Respect your opponents - they're crafty varmints</p>
                  <p class="code-line">★ May fortune favor the bold!</p>
                </div>
              </div>

              <div class="version-badge">
                <span class="version-text">Version 1.0 • Authentic Western Experience</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
    case 'options':
      return `
        <div class="settings-saloon">
          <div class="saloon-header">
            <svg width="80" height="80" viewBox="0 0 80 80" class="settings-badge">
              <!-- Gear/Settings Badge -->
              <circle cx="40" cy="40" r="35" fill="#8B4513" stroke="#654321" stroke-width="3"/>
              <circle cx="40" cy="40" r="28" fill="#D2691E" stroke="#8B4513" stroke-width="2"/>
              
              <!-- Gear teeth -->
              <g fill="#CD853F" stroke="#8B4513" stroke-width="1">
                <rect x="36" y="10" width="8" height="12" rx="2"/>
                <rect x="58" y="36" width="12" height="8" rx="2"/>
                <rect x="36" y="58" width="8" height="12" rx="2"/>
                <rect x="10" y="36" width="12" height="8" rx="2"/>
                
                <rect x="55" y="18" width="8" height="8" rx="2" transform="rotate(45 59 22)"/>
                <rect x="55" y="54" width="8" height="8" rx="2" transform="rotate(45 59 58)"/>
                <rect x="17" y="54" width="8" height="8" rx="2" transform="rotate(45 21 58)"/>
                <rect x="17" y="18" width="8" height="8" rx="2" transform="rotate(45 21 22)"/>
              </g>
              
              <!-- Center circle -->
              <circle cx="40" cy="40" r="12" fill="#A0522D" stroke="#654321" stroke-width="2"/>
              <circle cx="40" cy="40" r="6" fill="#654321"/>
            </svg>
            <h2 class="saloon-title">★ SALOON SETTINGS ★</h2>
            <p class="saloon-subtitle">~ Customize Your Frontier Experience ~</p>
          </div>

          <div class="settings-scroll">
            <div class="scroll-content">
              
              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">🔊 Audio Preferences</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="sound-toggle" ${soundEnabled ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        <span class="setting-title">🎵 Sound Effects</span>
                      </label>
                    </div>
                    <p class="setting-desc">Enable atmospheric sounds from the Old West - card shuffling, chip clinking, and saloon ambiance</p>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">🎰 Gameplay Features</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="auto-fold-enable">
                        <span class="checkmark"></span>
                        <span class="setting-title">🤖 Auto-fold Weak Hands</span>
                      </label>
                    </div>
                    <p class="setting-desc">Let the house automatically fold hands with poor winning chances - saves time on obvious decisions</p>
                    <div class="slider-container" id="auto-fold-slider-container">
                      <div class="slider-header">
                        <span class="slider-icon">🎯</span>
                        <label class="slider-label">Fold hands with less than <span id="auto-fold-percentage">25</span>% win chance</label>
                      </div>
                      <div class="slider-wrapper">
                        <input type="range" class="option-slider" id="auto-fold-threshold" min="5" max="50" value="25" step="5">
                        <div class="slider-track">
                          <div class="slider-fill"></div>
                          <div class="slider-markers">
                            <span class="marker" style="left: 0%">5%</span>
                            <span class="marker" style="left: 50%">25%</span>
                            <span class="marker" style="left: 100%">50%</span>
                          </div>
                        </div>
                      </div>
                      <div class="slider-help">
                        <small>Conservative (5%) → Aggressive (50%)</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="settings-section">
                <div class="section-header">
                  <h3 class="section-title">📊 Display Options</h3>
                  <div class="section-decoration">═══════════════</div>
                </div>
                <div class="setting-panel">
                  <div class="setting-item">
                    <div class="setting-header">
                      <label class="custom-checkbox">
                        <input type="checkbox" class="option-checkbox" id="show-probabilities">
                        <span class="checkmark"></span>
                        <span class="setting-title">🎲 Hand Probabilities</span>
                      </label>
                    </div>
                    <p class="setting-desc">Show your odds of winning with the current hand - helps make informed betting decisions</p>
                  </div>
                </div>
              </div>

              <div class="settings-footer">
                <div class="sheriff-notice-mini">
                  <p>🤠 Settings are automatically saved to your local saloon records</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      `;
      
    case 'achievements':
      const achievements = achievementTracker.getAchievements();
      const stats = achievementTracker.getStats();
      
      return `
        <div class="achievements-view">
          <div class="sheriff-hall">
            <div class="hall-header">
              <svg width="60" height="60" viewBox="0 0 60 60" class="sheriff-badge">
                <!-- Sheriff Star Badge -->
                <polygon points="30,5 35,20 50,20 38,30 43,45 30,37 17,45 22,30 10,20 25,20" 
                         fill="#DAA520" stroke="#B8860B" stroke-width="2"/>
                <circle cx="30" cy="30" r="8" fill="#B8860B" stroke="#8B4513" stroke-width="1"/>
                <text x="30" y="33" text-anchor="middle" fill="#8B4513" font-size="6" font-weight="bold">HONOR</text>
              </svg>
              <h2 class="view-title">★ HALL OF HONOR ★</h2>
              <p class="view-subtitle">~ Your Legendary Poker Achievements ~</p>
            </div>
            
            <div class="achievements-content">
              <div class="sheriff-notice">
                <div class="notice-scroll">
                  <p class="achievements-note">📜 Your deeds are recorded in the town ledger (stored locally) 📜</p>
                </div>
              </div>
              
              <div class="stats-saloon">
                <div class="saloon-bar">
                  <h3 class="bar-title">🍺 SALOON STATISTICS 🍺</h3>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div class="stat-icon">🎰</div>
                      <span class="stat-value">${stats.handsPlayed}</span>
                      <span class="stat-label">Hands Played</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">🏆</div>
                      <span class="stat-value">${stats.handsWon}</span>
                      <span class="stat-label">Hands Won</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">🔥</div>
                      <span class="stat-value">${stats.longestStreak}</span>
                      <span class="stat-label">Best Streak</span>
                    </div>
                    <div class="stat-item">
                      <div class="stat-icon">💰</div>
                      <span class="stat-value">$${stats.largestPot}</span>
                      <span class="stat-label">Largest Pot</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="achievement-wall">
                <h3 class="wall-title">🎖️ BADGES OF HONOR 🎖️</h3>
                <div class="achievement-grid">
                  ${achievements.map(ach => {
                    const progress = achievementTracker.getProgress(ach.id);
                    const isUnlocked = ach.unlocked;
                    const progressPercent = Math.floor(progress * 100);
                    
                    return `
                      <div class="achievement-plaque ${isUnlocked ? 'unlocked' : 'locked'}">
                        <div class="plaque-frame">
                          <div class="plaque-header">
                            <div class="achievement-icon ${isUnlocked ? 'unlocked' : ''}">${ach.icon}</div>
                            ${isUnlocked ? '<div class="gold-shine"></div>' : ''}
                          </div>
                          
                          <div class="achievement-info">
                            <h4 class="achievement-name">${ach.name}</h4>
                            <p class="achievement-desc">${ach.description}</p>
                            
                            ${isUnlocked 
                              ? `<div class="achievement-status unlocked">
                                   <div class="unlock-ribbon">EARNED</div>
                                   <div class="unlock-date">${ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : ''}</div>
                                 </div>`
                              : progress > 0 
                                ? `<div class="achievement-progress">
                                     <div class="progress-barrel">
                                       <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                       <div class="progress-text">${progressPercent}%</div>
                                     </div>
                                   </div>`
                                : `<div class="achievement-status locked">
                                     <div class="lock-ribbon">LOCKED</div>
                                   </div>`
                            }
                          </div>
                          
                          <!-- Decorative nail corners -->
                          <div class="plaque-nails">
                            <div class="nail nail-tl"></div>
                            <div class="nail nail-tr"></div>
                            <div class="nail nail-bl"></div>
                            <div class="nail nail-br"></div>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
              
              <div class="achievement-summary">
                <div class="summary-scroll">
                  <p class="summary-text">
                    <span class="earned-count">${achievements.filter(a => a.unlocked).length}</span> of 
                    <span class="total-count">${achievements.length}</span> honors earned
                  </p>
                  <div class="summary-decoration">★ ★ ★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
    default:
      return '';
  }
}

function setupStartScreenEventListeners(container: HTMLElement, callbacks: StartScreenCallbacks): void {
  // Saloon doors click to start game with pointer events
  const saloonDoors = container.querySelector('#saloon-doors');
  if (saloonDoors && currentView === 'main') {
    import('../utils/mobile').then(({ addPointerListener, preventAccidentalGestures }) => {
      // Prevent gestures on the doors
      preventAccidentalGestures(saloonDoors as HTMLElement);
      
      addPointerListener(saloonDoors as HTMLElement, () => {
        // Use default character if none selected, or go to character selection
        const selectedCharacter = localStorage.getItem('poker-selected-character');
        if (selectedCharacter) {
          // Start game with selected character
          callbacks.onCharacterSelected(selectedCharacter);
        } else {
          // Go to character selection first
          currentView = 'character-select';
          container.innerHTML = getStartScreenHTML();
          setupStartScreenEventListeners(container, callbacks);
        }
      }, { debounce: 200 });
    });
  }
  
  // Menu button navigation with pointer events
  const menuButtons = container.querySelectorAll('.menu-btn');
  import('../utils/mobile').then(({ addPointerListener }) => {
    menuButtons.forEach(btn => {
      addPointerListener(btn as HTMLElement, () => {
        const action = (btn as HTMLElement).dataset.action as StartScreenView;
        if (action) {
          currentView = action;
          container.innerHTML = getStartScreenHTML();
          setupStartScreenEventListeners(container, callbacks);
        }
      }, { debounce: 150 });
    });
  });
  
  // Back button with pointer events
  const backBtn = container.querySelector('.back-btn');
  if (backBtn) {
    import('../utils/mobile').then(({ addPointerListener }) => {
      addPointerListener(backBtn as HTMLElement, () => {
        currentView = 'main';
        container.innerHTML = getStartScreenHTML();
        setupStartScreenEventListeners(container, callbacks);
      }, { debounce: 150 });
    });
  }
  
  // Character selection with pointer events
  if (currentView === 'character-select') {
    const characterCards = container.querySelectorAll('.wanted-poster');
    import('../utils/mobile').then(({ addPointerListener }) => {
      characterCards.forEach(card => {
        addPointerListener(card as HTMLElement, () => {
          const characterId = (card as HTMLElement).dataset.characterId;
          if (characterId) {
            characterCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            import('../utils/mobile').then(({ scheduleAnimation }) => {
              scheduleAnimation(() => {
                callbacks.onCharacterSelected(characterId);
              }, 300);
            });
          }
        }, { debounce: 200 });
        
        // Keep hover effects for desktop
        card.addEventListener('mouseenter', () => {
          card.classList.add('hover');
        });
        card.addEventListener('mouseleave', () => {
          card.classList.remove('hover');
        });
      });
    });
  }
  
  // Options handling
  if (currentView === 'options') {
            const soundToggle = container.querySelector('#sound-toggle') as HTMLInputElement;
        if (soundToggle) {
          soundToggle.addEventListener('change', () => {
            soundEnabled = soundToggle.checked;
            // Save to localStorage
            localStorage.setItem('poker-sound-enabled', soundEnabled.toString());
          });
        }

        const probabilityToggle = container.querySelector('#show-probabilities') as HTMLInputElement;
        if (probabilityToggle) {
          // Load current setting, default to true if not set
          const showProbabilities = localStorage.getItem('poker-show-probabilities') !== 'false';
          probabilityToggle.checked = showProbabilities;
          // Set default if not already set
          if (!localStorage.getItem('poker-show-probabilities')) {
            localStorage.setItem('poker-show-probabilities', 'true');
          }
          
          probabilityToggle.addEventListener('change', () => {
            localStorage.setItem('poker-show-probabilities', probabilityToggle.checked.toString());
          });
        }

        // Auto-fold feature
        const autoFoldToggle = container.querySelector('#auto-fold-enable') as HTMLInputElement;
        const autoFoldSlider = container.querySelector('#auto-fold-threshold') as HTMLInputElement;
        const autoFoldPercentage = container.querySelector('#auto-fold-percentage') as HTMLElement;
        const sliderContainer = container.querySelector('#auto-fold-slider-container') as HTMLElement;
        
        if (autoFoldToggle && autoFoldSlider && autoFoldPercentage && sliderContainer) {
          // Load current settings
          const autoFoldEnabled = localStorage.getItem('poker-auto-fold-enabled') === 'true';
          const autoFoldThreshold = parseInt(localStorage.getItem('poker-auto-fold-threshold') || '25');
          
          autoFoldToggle.checked = autoFoldEnabled;
          autoFoldSlider.value = autoFoldThreshold.toString();
          autoFoldPercentage.textContent = autoFoldThreshold.toString();
          sliderContainer.style.display = autoFoldEnabled ? 'block' : 'none';
          
          // Toggle auto-fold feature
          autoFoldToggle.addEventListener('change', () => {
            const enabled = autoFoldToggle.checked;
            localStorage.setItem('poker-auto-fold-enabled', enabled.toString());
            sliderContainer.style.display = enabled ? 'block' : 'none';
          });
          
          // Update threshold
          autoFoldSlider.addEventListener('input', () => {
            const threshold = parseInt(autoFoldSlider.value);
            autoFoldPercentage.textContent = threshold.toString();
            localStorage.setItem('poker-auto-fold-threshold', threshold.toString());
            
            // Update slider fill
            const percentage = ((threshold - 5) / (50 - 5)) * 100;
            const sliderFill = container.querySelector('.slider-fill') as HTMLElement;
            if (sliderFill) {
              sliderFill.style.width = `${percentage}%`;
            }
          });
          
          // Initialize slider fill
          const initialPercentage = ((autoFoldThreshold - 5) / (50 - 5)) * 100;
          const sliderFill = container.querySelector('.slider-fill') as HTMLElement;
          if (sliderFill) {
            sliderFill.style.width = `${initialPercentage}%`;
          }
        }
  }
}
