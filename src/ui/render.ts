import type { GameState } from '../game/types';
import { computeLegalActions, computeFacingAmount } from '../game/betting';
import { getCharacterAvatarSVG } from './svg/avatars';
import { cardSVG } from './svg/cards';
import { computeShowdownWinners, applyWinnings } from '../game/payout';
import { checkBustOutConditions } from '../game/state';
import { evaluateBestOfSeven } from '../game/evaluator';
import { handHistoryTracker } from '../game/handHistory';
import { soundEngine } from './sounds';
import { renderHandReference, initHandReferenceState } from './handReference';
import { calculateHandProbabilities, formatProbability, getProbabilityDescription } from '../game/probability';

export interface StoreLike {
  subscribe: (fn: (s: GameState) => void) => void;
  newHand?: () => void;
  dispatchAction?: (a: 'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise', amount?: number) => void;
  startGame?: () => void;
  getState?: () => GameState;
  setState?: (s: GameState) => void;
  resetTournament?: () => void;
}

// Auto-fold logic for weak hands
let lastAutoFoldHandNumber = -1; // Track which hand we last auto-folded to prevent loops

// Function to update auto-fold indicator state
function updateAutoFoldIndicator() {
  const autoFoldEnabled = localStorage.getItem('poker-auto-fold-enabled') === 'true';
  const autoFoldThreshold = localStorage.getItem('poker-auto-fold-threshold') || '25';
  const autoFoldIndicator = document.querySelector('.auto-fold-indicator') as HTMLElement;
  
  if (autoFoldIndicator) {
    if (autoFoldEnabled) {
      autoFoldIndicator.style.display = 'block';
      autoFoldIndicator.className = 'auto-fold-indicator';
      autoFoldIndicator.innerHTML = `🤖 Auto-fold: <span id="auto-fold-threshold-display">${autoFoldThreshold}</span>%`;
    } else {
      autoFoldIndicator.style.display = 'block';
      autoFoldIndicator.className = 'auto-fold-indicator disabled';
      autoFoldIndicator.innerHTML = `🤖 Auto-fold: <span id="auto-fold-threshold-display">OFF</span>`;
    }
    autoFoldIndicator.title = `Click to ${autoFoldEnabled ? 'disable' : 'enable'} auto-fold feature`;
  }
}

function checkAutoFold(state: GameState, store: StoreLike) {
  // Only check during active play when it's human player's turn
  if (!state.round || state.round.currentTurnSeatIndex !== 0) return;
  if (state.phase === 'Showdown' || state.phase === 'GameOver' || state.phase === 'Idle') return;
  
  // Prevent auto-fold loops - only auto-fold once per hand
  if (lastAutoFoldHandNumber === state.handNumber) return;
  
  // Check if auto-fold is enabled
  const autoFoldEnabled = localStorage.getItem('poker-auto-fold-enabled') === 'true';
  if (!autoFoldEnabled) return;
  
  const autoFoldThreshold = parseInt(localStorage.getItem('poker-auto-fold-threshold') || '25');
  const humanPlayer = Object.values(state.players).find(p => p.seatIndex === 0);
  
  if (!humanPlayer || !humanPlayer.hand?.c1 || !humanPlayer.hand?.c2) return;
  
  // Get current hand probabilities
  const probabilities = calculateHandProbabilities(state, humanPlayer.id);
  if (!probabilities) return;
  
  const winChance = probabilities.winProbability * 100; // Convert to percentage
  

  
  // Auto-fold if win chance is below threshold
  if (winChance < autoFoldThreshold) {

    
    // Use requestAnimationFrame to ensure the UI has rendered and action buttons are available
    import('../utils/mobile').then(({ scheduleAnimation }) => {
      scheduleAnimation(() => {
        // Check if folding is a legal action
        const legal = computeLegalActions(state, 0);
        if (legal.has('Fold')) {
          console.log(`🤖 Executing auto-fold`);
          lastAutoFoldHandNumber = state.handNumber; // Mark this hand as auto-folded
          store.dispatchAction?.('Fold');
          
          // Add notification to log
          const currentState = store.getState?.();
          if (currentState && store.setState) {
            const updatedState = {
              ...currentState,
              devLog: [
                `🤖 Auto-folded weak hand (${winChance.toFixed(1)}% win chance)`,
                `Auto-folded weak hand`,
                ...currentState.devLog
              ].slice(0, 50)
            };
            store.setState(updatedState);
          }
        } else if (legal.has('Check')) {
          // If we can't fold but can check (no bet to call), do that instead
          console.log(`🤖 Can't fold, checking instead`);
          store.dispatchAction?.('Check');
        }
      }, 250); // Reduced delay, using RAF for better performance
    });
  }
}

export function renderApp(container: HTMLElement, store: StoreLike) {
  container.innerHTML = '';
  const page = document.createElement('div');
  page.className = 'page';
  
  // Apply safe area support and gesture prevention for iOS
  import('../utils/mobile').then(({ applySafeArea, isIOS, preventAccidentalGestures }) => {
    if (isIOS()) {
      applySafeArea(page);
    }
    // Prevent accidental gestures on the entire game area
    preventAccidentalGestures(page);
  });
  
  // Setup performance-optimized ResizeObserver for dynamic UI scaling
  import('../utils/mobile').then(({ createDebouncedResize, batchDOMOperations }) => {
    const scaleObserver = new ResizeObserver((entries) => {
      const updateScale = createDebouncedResize(() => {
        const entry = entries[0];
        if (!entry) return;
        
        // Batch DOM operations for better performance
        batchDOMOperations({
          reads: [() => {
            const { width, height } = entry.contentRect;
            const minDimension = Math.min(width, height);
            const isMobile = width <= 768;
            
            // Mobile-aware scaling
            let scale = 1;
            if (isMobile) {
              // Less aggressive scaling on mobile to maintain readability
              scale = Math.max(0.8, Math.min(1, width / 400));
            } else {
              // Desktop scaling logic
              if (minDimension < 600) {
                scale = Math.max(0.6, minDimension / 600);
              } else if (minDimension > 1200) {
                scale = Math.min(1.2, minDimension / 1000);
              }
            }
            
            // Store scale for write operation
            (window as any).__uiScale = scale;
          }],
          writes: [() => {
            const scale = (window as any).__uiScale;
            if (scale !== undefined) {
              document.documentElement.style.setProperty('--ui-scale', scale.toString());
            }
          }]
        });
      }, 50); // Reduced debounce for more responsive scaling
      
      updateScale();
    });
    
    scaleObserver.observe(container);
  });
  
  // Handle orientation changes and visual viewport on mobile
  import('../utils/mobile').then(({ handleEnhancedOrientation, handleVisualViewport, isIOS }) => {
    // Enhanced orientation handling
    const cleanupOrientation = handleEnhancedOrientation();
    
    // Visual viewport handling for iOS Safari
    let cleanupViewport: (() => void) | undefined;
    if (isIOS()) {
      cleanupViewport = handleVisualViewport();
    }
    
    // Store cleanup functions for potential later use
    (window as any).__mobileCleanup = () => {
      cleanupOrientation();
      if (cleanupViewport) cleanupViewport();
    };
  });

  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main game area';
  page.appendChild(skipLink);

  // Top bar: status + controls
  const topbar = document.createElement('div');
  topbar.className = 'topbar';
  const topInner = document.createElement('div');
  topInner.className = 'topbar-inner';
  const status = document.createElement('div');
  status.className = 'status';
  status.textContent = 'Texas Hold\'em';
  const topBtns = document.createElement('div');
  topBtns.className = 'btns';
  topBtns.innerHTML = `
    <div id="player-chips" class="player-chips"></div>
    <button id="t-restart" class="primary">Restart Game</button>
    <button id="t-sound">🔊 Sound</button>
    <span id="hands-counter" class="hands-counter">Hands: 0</span>
  `;
  topInner.appendChild(status);
  topInner.appendChild(topBtns);
  topbar.appendChild(topInner);

  // Auto-fold indicator
  const autoFoldIndicator = document.createElement('div');
  autoFoldIndicator.className = 'auto-fold-indicator';
  autoFoldIndicator.style.display = 'block'; // Always visible
  autoFoldIndicator.innerHTML = '🤖 Auto-fold: <span id="auto-fold-threshold-display">25</span>%';
  autoFoldIndicator.title = 'Click to toggle auto-fold feature';
  autoFoldIndicator.setAttribute('role', 'button');
  autoFoldIndicator.setAttribute('aria-label', 'Toggle auto-fold weak hands feature');
  autoFoldIndicator.setAttribute('tabindex', '0');
  
  // Add mobile-optimized pointer handler to toggle auto-fold
  import('../utils/mobile').then(({ addPointerListener }) => {
    addPointerListener(autoFoldIndicator, () => {
      const currentEnabled = localStorage.getItem('poker-auto-fold-enabled') === 'true';
      const newEnabled = !currentEnabled;
      localStorage.setItem('poker-auto-fold-enabled', newEnabled.toString());
      
      // Update the indicator immediately
      updateAutoFoldIndicator();
      
      console.log(`🤖 Auto-fold ${newEnabled ? 'enabled' : 'disabled'}`);
    }, { debounce: 100 });
  });
  
  // Initialize the indicator state
  setTimeout(updateAutoFoldIndicator, 100); // Small delay to ensure DOM is ready
  


  const table = document.createElement('div');
  table.className = 'table';

  // Removed duplicate pot and hud displays - info is in topbar

  const board = document.createElement('div');
  board.className = 'board';

  const seats = document.createElement('div');
  seats.className = 'seats';

  // bottom controls removed per design

  table.appendChild(board);
  table.appendChild(seats);
  

  const log = document.createElement('div');
  log.className = 'log';
  log.innerHTML = '<h3>Log</h3>';

  // Add probability display
  const probabilityDisplay = document.createElement('div');
  probabilityDisplay.className = 'probability-display';
  probabilityDisplay.style.display = 'none'; // Initially hidden

  // Add hand reference guide below the log
  const handRef = document.createElement('div');
  handRef.innerHTML = renderHandReference();
  
  // Initialize collapsed state after a short delay to ensure DOM is ready
  setTimeout(() => initHandReferenceState(), 100);

  const content = document.createElement('div');
  content.className = 'content';
  content.id = 'main-content';
  // Middle: main table area
  const middleCol = document.createElement('div');
  middleCol.appendChild(table);
  // Right: Log, probability display, and hand reference
  const rightCol = document.createElement('div');
  rightCol.className = 'right-panel-container';
  rightCol.appendChild(log);
  rightCol.appendChild(probabilityDisplay);
  rightCol.appendChild(handRef);

  content.appendChild(middleCol);
  content.appendChild(rightCol);

  page.appendChild(topbar);
  page.appendChild(autoFoldIndicator);
  page.appendChild(content);
  
  // Add rotation hint for mobile
  const rotateHint = document.createElement('div');
  rotateHint.className = 'rotate-hint';
  rotateHint.innerHTML = `
    <div>📱 ↻</div>
    <div>For the best experience,</div>
    <div>please rotate to landscape</div>
  `;
  page.appendChild(rotateHint);
  
  // Add ARIA live region for game status announcements
  const liveRegion = document.createElement('div');
  liveRegion.id = 'game-status-live';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-10000px';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  page.appendChild(liveRegion);
  
  container.appendChild(page);

  // Action buttons will be integrated into the human player's seat

  // Game over modal
  const gameOverOverlay = document.createElement('div');
  gameOverOverlay.className = 'modal-overlay';
  gameOverOverlay.id = 'game-over-overlay';
  gameOverOverlay.innerHTML = `
    <div class="modal">
      <h3 id="game-over-title">🏆 Tournament Complete!</h3>
      <div id="game-over-content"></div>
      <div class="actions">
        <button id="game-over-reset" class="primary">New Tournament</button>
        <button id="game-over-quit" class="danger">Quit to Main Menu</button>
      </div>
    </div>`;
  document.body.appendChild(gameOverOverlay);

  // Dev mode toggle
  let devMode = false;
  let soundEnabled = true;

  // Game over modal event listeners with pointer events
  import('../utils/mobile').then(({ addPointerListener }) => {
    const resetBtn = gameOverOverlay.querySelector('#game-over-reset') as HTMLButtonElement;
    const quitBtn = gameOverOverlay.querySelector('#game-over-quit') as HTMLButtonElement;
    
    addPointerListener(resetBtn, () => {
      soundEngine.playClick();
      gameOverOverlay.classList.remove('show');
      if (store.resetTournament) {
        store.resetTournament();
      }
    }, { debounce: 200 });
    
    addPointerListener(quitBtn, () => {
      soundEngine.playClick();
      gameOverOverlay.classList.remove('show');
      // Return to start screen
      const container = document.getElementById('app')!;
      import('./startScreen').then(({ renderStartScreen }) => {
        renderStartScreen(container, {
          onCharacterSelected: (characterId: string) => {
            import('../main').then(({ startGame }) => startGame());
          }
        });
      });
    }, { debounce: 200 });
  });
  
  // Top bar controls with pointer events
  import('../utils/mobile').then(({ addPointerListener }) => {
    const restartBtn = topBtns.querySelector('#t-restart') as HTMLButtonElement;
    const soundBtn = topBtns.querySelector('#t-sound') as HTMLButtonElement;
    
    addPointerListener(restartBtn, () => {
      soundEngine.playClick();
      if (store.newHand) {
        store.newHand();
        if (store.startGame) store.startGame();
      }
    }, { debounce: 200 });
    
    addPointerListener(soundBtn, () => {
      soundEnabled = !soundEnabled;
      soundEngine.setEnabled(soundEnabled);
      soundBtn.textContent = soundEnabled ? '🔊 Sound' : '🔇 Muted';
      soundBtn.className = soundEnabled ? '' : 'danger';
      if (soundEnabled) soundEngine.playClick();
    }, { debounce: 100 });
  });

  // Action button event handlers will be created dynamically in the seat rendering
  
  // Keyboard shortcuts for action buttons
  document.addEventListener('keydown', (e) => {
    const state = store.getState && store.getState();
    if (!state || !state.round || state.round.currentTurnSeatIndex !== 0) return;
    
    const legal = computeLegalActions(state, 0);
    
    switch (e.key.toLowerCase()) {
      case 'f':
        if (legal.has('Fold') || legal.has('Check')) {
          e.preventDefault();
          soundEngine.playClick();
          store.dispatchAction && store.dispatchAction('Fold');
        }
        break;
      case 'c':
        if (legal.has('Check')) {
          e.preventDefault();
          soundEngine.playClick();
          store.dispatchAction && store.dispatchAction('Check');
        } else if (legal.has('Call')) {
          e.preventDefault();
          soundEngine.playClick();
          store.dispatchAction && store.dispatchAction('Call');
        }
        break;
      case 'r':
        if (legal.has('Bet')) {
          e.preventDefault();
          const amountInput = document.querySelector('#action-amount') as HTMLInputElement;
          const amt = Number(amountInput?.value || '0');
          soundEngine.playClick();
          store.dispatchAction && store.dispatchAction('Bet', amt);
        } else if (legal.has('Raise')) {
          e.preventDefault();
          const amountInput = document.querySelector('#action-amount') as HTMLInputElement;
          const amt = Number(amountInput?.value || '0');
          soundEngine.playClick();
          store.dispatchAction && store.dispatchAction('Raise', amt);
        }
        break;
      case 'a':
        const humanPlayer = Object.values(state.players).find(p => p.seatIndex === 0);
        if (humanPlayer && humanPlayer.chips > 0) {
          e.preventDefault();
          soundEngine.playClick();
          const humanPlayerId = humanPlayer.id;
          const allInChips = humanPlayer.chips;
          const currentBet = state.round.currentBet;
          const alreadyCommitted = state.round.committedThisStreet[humanPlayerId] || 0;
          const facingAmount = Math.max(0, currentBet - alreadyCommitted);
          
          if (currentBet === 0) {
            store.dispatchAction && store.dispatchAction('Bet', allInChips);
          } else if (facingAmount > 0) {
            if (allInChips <= facingAmount) {
              store.dispatchAction && store.dispatchAction('Call');
            } else {
              const raiseAmount = allInChips - facingAmount;
              store.dispatchAction && store.dispatchAction('Raise', raiseAmount);
            }
          } else {
            store.dispatchAction && store.dispatchAction('Raise', allInChips);
          }
        }
        break;
    }
  });

  store.subscribe((s) => {
    const potTotal = s.pots.reduce((a, p) => a + p.amount, 0);
    
    // Check for auto-fold weak hands
    checkAutoFold(s, store);
    
    // Handle showdown completion (but wait for manual advancement)
    if (s.phase === 'Showdown' && s.board.length === 5 && !s.showdownProcessed) {
      // Calculate winners and apply winnings
      const winners = computeShowdownWinners(s);
      if (winners.length > 0) {
        // Apply winnings to players and mark showdown as processed
        applyWinnings(s, winners);
        let processedState: GameState = { ...s, showdownProcessed: true };
        
        // Check for bust-out conditions after winnings are applied
        processedState = checkBustOutConditions(processedState);
        
        // Update state with winnings applied immediately
        if (store.setState) {
          store.setState(processedState);
        }
        
        // No automatic progression - wait for manual "Next Hand" button click
      }
    }
    // Compute current bet and human facing amount (dev-only approximation)
    const human = Object.values(s.players).find((p) => p.isHuman);
    const currentBet = s.round ? s.round.currentBet : 0;
    const committed = human && s.round ? (s.round.committedThisStreet[human.id] ?? 0) : 0;
    const facing = Math.max(0, currentBet - committed);

    // Compute showdown info if we're in showdown phase
    let showdownWinners: Set<string> = new Set();
    const showdownHandEvals = new Map<string, any>();
    if (s.phase === 'Showdown' && s.board.length === 5) {
      const winners = computeShowdownWinners(s);
      winners.forEach(w => showdownWinners.add(w.playerId));
      
      // Evaluate all active players' hands for display (optimized)
      const activePlayers = Object.values(s.players).filter(p => !p.isFolded && p.hand?.c1 && p.hand?.c2);
      activePlayers.forEach(p => {
        if (p.hand?.c1 && p.hand?.c2) {
          try {
            const sevenCards = [p.hand.c1, p.hand.c2, ...s.board];
            
            // Debug: Log the cards being evaluated for UI display
            console.log(`🖥️ UI Evaluating ${p.name}:`, {
              hole: `${p.hand.c1.rank}${p.hand.c1.suit} ${p.hand.c2.rank}${p.hand.c2.suit}`,
              board: s.board.map(c => `${c.rank}${c.suit}`).join(' '),
              allSeven: sevenCards.map(c => `${c.rank}${c.suit}`).join(' ')
            });
            
            const handEval = evaluateBestOfSeven(sevenCards);
            console.log(`🖥️ ${p.name} UI result: ${handEval.category} [${handEval.tiebreak.join(', ')}]`);
            
            showdownHandEvals.set(p.id, handEval);
          } catch (e) {
            console.log(`❌ Error evaluating ${p.name}:`, e);
          }
        }
      });
    }

    seats.innerHTML = '';
    const seatPositions = ['s0', 's1', 's2', 's3'];
    for (let i = 0; i < 4; i++) {
      const seat = document.createElement('div');
      seat.className = 'seat';
      seat.id = seatPositions[i] || `s${i}`;
      
      const player = Object.values(s.players).find((p) => p.seatIndex === i);
      const isBusted = player?.isBustedOut || false;
      
      if (!player) {
        seat.innerHTML = '<div class="empty-seat">Empty</div>';
        seats.appendChild(seat);
        continue;
      }

      const name = player.name;
      const chips = isNaN(player.chips) ? 0 : player.chips;
      const isCurrentTurn = s.round?.currentTurnSeatIndex === i;
      const isDealer = s.buttonIndex === i;
      const isSmallBlind = s.seats.find(seat => seat.index === i)?.isSmallBlind || false;
      const isBigBlind = s.seats.find(seat => seat.index === i)?.isBigBlind || false;
      const isActing = isCurrentTurn && s.phase !== 'Idle' && s.phase !== 'Showdown';

      let seatClass = 'seat';
      if (isCurrentTurn) seatClass += ' current-turn';
      if (isDealer) seatClass += ' dealer';
      if (isSmallBlind) seatClass += ' small-blind';
      if (isBigBlind) seatClass += ' big-blind';
      if (player.isFolded) seatClass += ' folded';
      if (player.isAllIn) seatClass += ' all-in';
      if (isBusted) {
        seatClass += ' busted';
      }
      
      seat.className = seatClass;
      
      let cardsHtml = '';
      let handCategoryHtml = '';
      
      if (player && player.hand?.c1 && player.hand?.c2) {
        const isShowdown = s.phase === 'Showdown' && s.board.length === 5;
        const showBotCards = isShowdown && !player.isFolded;
        
        // Always show cards during showdown for all players who didn't fold
        if (player.seatIndex === 0 || showBotCards) {
          // Human player's cards (always visible) or bot cards during showdown
          const c1 = cardSVG(player.hand.c1 as any, 48, 68);
          const c2 = cardSVG(player.hand.c2 as any, 48, 68);
          cardsHtml = `<div class="hand"><div class="card">${c1}</div><div class="card">${c2}</div></div>`;
        } else {
          // Bot players' cards (face-down during play)
          cardsHtml = `<div class="hand"><div class="card back"></div><div class="card back"></div></div>`;
        }
        
        // Show hand category during showdown
        if (isShowdown && !player.isFolded) {
          const handEval = showdownHandEvals.get(player.id);
          if (handEval) {
            const categoryName = getHandCategoryDisplayName(handEval.category);
            handCategoryHtml = `<div class="hand-category">${categoryName}</div>`;
          }
        }
      }

      // Get avatar based on player type
      let avatarSvg = '';
      if (player.seatIndex === 0) {
        // Human player - use selected character
        const selectedCharacter = localStorage.getItem('poker-selected-character');
        avatarSvg = getCharacterAvatarSVG(selectedCharacter || 'C1', 72);
      } else {
        // Bot players - use their assigned avatars
        avatarSvg = getCharacterAvatarSVG(player.id, 72);
      }

      const badges = [];
      if (isDealer) badges.push('<span class="badge dealer">Dealer</span>');
      if (isSmallBlind) badges.push('<span class="badge sb">Small Blind</span>');
      if (isBigBlind) badges.push('<span class="badge bb">Big Blind</span>');
      if (isActing) badges.push('<span class="badge act">Acting</span>');
      if (player.isFolded) badges.push('<span class="badge folded">Folded</span>');
      if (player.isAllIn) badges.push('<span class="badge all-in">All In</span>');
      if (isBusted) badges.push('<span class="badge busted">ELIMINATED</span>');

      const act = isActing ? '<span class="acting-indicator">→</span>' : '';
      const facing = computeFacingAmount(s, player.id);

      // Horizontal layout for player and bot B
      if (i === 0 || i === 2) {
        let actionButtonsHtml = '';
        // Show action buttons only for the human player (seat 0) when it's their turn
        // For human player, include action buttons integrated within the seat
        if (i === 0) {
          const isHumanTurn = s.round && s.round.currentTurnSeatIndex === 0;
          if (isHumanTurn) {
            const legal = computeLegalActions(s, 0);
            const humanPlayer = Object.values(s.players).find(p => p.seatIndex === 0);
            const canAllIn = humanPlayer && humanPlayer.chips > 0 && !humanPlayer.isAllIn && !humanPlayer.isFolded && (legal.has('Call') || legal.has('Bet') || legal.has('Raise'));
            const facingAmount = computeFacingAmount(s, humanPlayer?.id || 'P0');

            actionButtonsHtml = `
              <div class="integrated-action-controls">
                <div class="action-info">
                  <span class="action-prompt">Your Turn</span>
                  ${facingAmount > 0 ? `<span class="facing-amount">Need $${facingAmount} to call</span>` : ''}
                </div>
                <div class="action-grid">
                  <button id="action-fold" class="action-btn compact danger" ${!legal.has('Fold') && !legal.has('Check') ? 'disabled' : ''} 
                          aria-label="Fold your hand and exit this round">
                    Fold
                  </button>
                  ${legal.has('Check') ? `
                    <button id="action-check" class="action-btn compact" ${!legal.has('Check') ? 'disabled' : ''} 
                            aria-label="Check - stay in the round without betting">
                      Check
                    </button>
                  ` : ''}
                  ${legal.has('Call') ? `
                    <button id="action-call" class="action-btn compact" ${!legal.has('Call') ? 'disabled' : ''} 
                            aria-label="Call - match the current bet to stay in">
                      Call
                    </button>
                  ` : ''}
                  <div class="bet-section">
                    <input id="action-amount" type="number" min="1" step="1" value="10" ${!legal.has('Bet') && !legal.has('Raise') ? 'disabled' : ''} 
                           aria-label="Bet amount in chips" />
                    ${legal.has('Bet') ? `
                      <button id="action-bet" class="action-btn compact primary" ${!legal.has('Bet') ? 'disabled' : ''} 
                              aria-label="Bet the specified amount">
                        Bet
                      </button>
                    ` : ''}
                    ${legal.has('Raise') ? `
                      <button id="action-raise" class="action-btn compact primary" ${!legal.has('Raise') ? 'disabled' : ''} 
                              aria-label="Raise - increase the current bet">
                        Raise
                      </button>
                    ` : ''}
                  </div>
                  ${canAllIn ? `
                    <button id="action-allin" class="action-btn compact all-in" 
                            aria-label="All In - bet all your remaining chips">
                      All In
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          } else {
            actionButtonsHtml = '';
          }
        }
        seat.innerHTML = `
          <div class="player-info">
            <div class="avatar">${avatarSvg}</div>
            <div class="name">${name} ${badges.join('')} ${act}</div>

            ${handCategoryHtml}
          </div>
          <div class="cards-and-actions">
            ${cardsHtml}
            ${actionButtonsHtml}
          </div>
        `;
      } else {
        // Vertical layout for bot A and bot C
        seat.innerHTML = `
          <div class="player-info">
            <div class="avatar">${avatarSvg}</div>
            <div class="name">${name} ${badges.join('')} ${act}</div>

            ${handCategoryHtml}
          </div>
          ${cardsHtml}
        `;
      }

      seats.appendChild(seat);

      // Add event listeners for action buttons only for the human player
      if (i === 0) {
        const foldBtn = seat.querySelector('#action-fold');
        const checkBtn = seat.querySelector('#action-check');
        const callBtn = seat.querySelector('#action-call');
        const betBtn = seat.querySelector('#action-bet');
        const raiseBtn = seat.querySelector('#action-raise');
        const allInBtn = seat.querySelector('#action-allin');
        const amountInput = seat.querySelector('#action-amount') as HTMLInputElement;

        // Use mobile-optimized pointer events for action buttons
        import('../utils/mobile').then(({ addPointerListener }) => {
          if (foldBtn) addPointerListener(foldBtn as HTMLElement, () => store.dispatchAction?.('Fold'), { debounce: 50 });
          if (checkBtn) addPointerListener(checkBtn as HTMLElement, () => store.dispatchAction?.('Check'), { debounce: 50 });
          if (callBtn) addPointerListener(callBtn as HTMLElement, () => store.dispatchAction?.('Call'), { debounce: 50 });
          if (betBtn) addPointerListener(betBtn as HTMLElement, () => {
            const amount = amountInput ? parseInt(amountInput.value) : 10;
            store.dispatchAction?.('Bet', amount);
          }, { debounce: 50 });
          if (raiseBtn) addPointerListener(raiseBtn as HTMLElement, () => {
            const amount = amountInput ? parseInt(amountInput.value) : 10;
            store.dispatchAction?.('Raise', amount);
          }, { debounce: 50 });
          if (allInBtn) addPointerListener(allInBtn as HTMLElement, () => {
            const humanPlayer = Object.values(s.players).find(p => p.seatIndex === 0);
            if (humanPlayer && humanPlayer.chips > 0) {
              const legal = computeLegalActions(s, 0);
              const facingAmount = computeFacingAmount(s, humanPlayer?.id || 'P0');
              
              console.log(`🎰 All-in clicked: betting ALL ${humanPlayer.chips} chips`);
              
              // Simplified all-in logic: always bet/raise ALL chips
              // The game engine will automatically handle the all-in flag
              if (facingAmount > 0 && legal.has('Raise')) {
                // For raise: amount is the raise over current bet, not total chips
                // All-in raise = (total chips - amount needed to call)
                const raiseAmount = Math.max(0, humanPlayer.chips - facingAmount);
                console.log(`🎰 All-in Raise by $${raiseAmount} (total: $${humanPlayer.chips}, facing: $${facingAmount})`);
                store.dispatchAction?.('Raise', raiseAmount);
              } else if (facingAmount > 0 && legal.has('Call')) {
                // Call automatically handles all-in correctly
                console.log(`🎰 All-in Call (engine will use correct amount from $${humanPlayer.chips} chips)`);
                store.dispatchAction?.('Call');
              } else if (legal.has('Bet')) {
                // If no one has bet yet, bet ALL chips
                console.log(`🎰 All-in Bet ALL $${humanPlayer.chips} chips`);
                store.dispatchAction?.('Bet', humanPlayer.chips);
              } else {
                console.log(`🎰 All-in: No valid betting action! Legal actions: [${Array.from(legal).join(',')}]`);
              }
            }
          }, { debounce: 100 });
        });
      }
    }

    board.innerHTML = '';
    
    // Add game status above community cards
    let phaseText: string = s.phase;
    if (s.phase === 'Preflop') phaseText = 'Before the Flop';
    else if (s.phase === 'Flop') phaseText = 'After the Flop';
    else if (s.phase === 'Turn') phaseText = 'After the Turn';
    else if (s.phase === 'River') phaseText = 'After the River';
    else if (s.phase === 'Showdown') phaseText = 'Revealing Cards';
    else if (s.phase === 'Idle') phaseText = 'Waiting to Start';
    
    const gameStatus = `${phaseText} • Pot: $${potTotal} • Blinds: $${s.smallBlind}/$${s.bigBlind}`;
    
    // Add status above cards
    const statusDiv = document.createElement('div');
    statusDiv.className = 'board-status';
    statusDiv.textContent = gameStatus;
    board.appendChild(statusDiv);
    
    // Add cards container
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'board-cards';
    
    const numCards = s.board.length;
    // Always render 5 slots; fill existing cards face-up, missing cards as backs
    for (let i = 0; i < 5; i++) {
      const holder = document.createElement('div');
      if (i < numCards) {
        holder.className = 'card';
        holder.innerHTML = cardSVG(s.board[i] as any, 72, 100);
      } else {
        holder.className = 'back';
      }
      cardsContainer.appendChild(holder);
    }
    
    board.appendChild(cardsContainer);

    // Filter log messages based on dev mode
    const filteredLog = devMode 
      ? s.devLog 
      : s.devLog.filter(msg => 
          !msg.includes('🤖') && // Remove dev bot actions (keep clean ones)
          !msg.includes('⚠️') && // Remove error messages  
          !msg.includes('🎯') && // Remove dev player actions (keep clean ones)
          !msg.includes('💰') && // Remove dev bet messages (keep clean ones)
          !msg.includes('🏆') && // Remove dev winner announcements (keep clean ones)
          !msg.startsWith('[') && // Remove any bracketed dev messages
          msg.trim() !== '' // Remove empty messages
        );
    
    // Add showdown information to log if we're in showdown phase
    let logContent = '<h3>Game Log</h3>';
    if (s.phase === 'Showdown' && s.handSummary) {
      logContent += '<div class="showdown-summary">';
      logContent += `<h4>🏆 Hand #${s.handSummary.handNumber} Results</h4>`;
      logContent += `<p><strong>Final Pot:</strong> $${s.handSummary.finalPot}</p>`;
      logContent += '<h5>Winners:</h5>';
      s.handSummary.winners.forEach(winner => {
        logContent += `<p>• ${winner.playerName} wins $${winner.amount} with ${winner.handCategory}</p>`;
      });
      logContent += '<div class="next-hand-controls">';
      logContent += '<button id="next-hand-btn" class="next-hand-btn primary">Next Hand →</button>';
      logContent += '</div>';
      logContent += '</div>';
    }
    
    // Add some initial content if log is empty
    if (filteredLog.length === 0) {
      logContent += '<div class="line">Welcome to Texas Hold\'em! The game is ready to begin.</div>';
      if (s.phase === 'Preflop') {
        logContent += '<div class="line">Players have been dealt their hole cards.</div>';
      }
    }
    
    logContent += filteredLog.map((l) => `<div class="line">${l}</div>`).join('');
    log.innerHTML = logContent;
    
    // Add event listener for Next Hand button if it exists
    const nextHandBtn = log.querySelector('#next-hand-btn') as HTMLButtonElement;
    if (nextHandBtn) {
      import('../utils/mobile').then(({ addPointerListener }) => {
        addPointerListener(nextHandBtn, () => {
          console.log('🎯 Manual next hand clicked');
          store.newHand?.();
        }, { debounce: 200 });
      });
    }
    
    // Action buttons are now integrated into the human player's seat

    // Keep topbar simple - just the game title
    status.textContent = 'Texas Hold\'em';
    
    // Force bot processing if it's a bot's turn (stuck bot prevention)
    if (s.round && s.round.currentTurnSeatIndex > 0 && 
        s.phase !== 'Showdown' && s.phase !== 'GameOver' && s.phase !== 'Idle') {
      console.log('🎯 UI detected bot turn, ensuring maybeRunBots is called');
      import('../utils/mobile').then(({ scheduleAnimation }) => {
        scheduleAnimation(() => {
          if (store.getState && store.setState) {
            const currentState = store.getState();
            if (currentState.round && currentState.round.currentTurnSeatIndex > 0 && 
                currentState.phase !== 'Showdown' && currentState.phase !== 'GameOver' && currentState.phase !== 'Idle') {
              console.log('🎯 UI forcing maybeRunBots for stuck bot');
              // Since we can't directly call maybeRunBots from here, we'll trigger it via a dummy action
              const botSeat = currentState.round.currentTurnSeatIndex;
              const bot = Object.values(currentState.players).find(p => p.seatIndex === botSeat);
              if (bot && !bot.isFolded && !bot.isAllIn && bot.chips > 0) {
                console.log(`🎯 UI detected ${bot.name} needs to act, calling dispatchAction as failsafe`);
                // This is a UI-level failsafe - we'll just log it for now
              }
            }
          }
        }, 2000); // 2 second delay to detect stuck bots, but using RAF
      });
    }

    // Update probability display if enabled
    updateProbabilityDisplay(probabilityDisplay, s);

    // Update hands counter
    const handsCounter = document.getElementById('hands-counter');
    if (handsCounter) {
      handsCounter.textContent = `Hands: ${s.handNumber}`;
    }
    
    // Show game over modal if game is over
    if (s.phase === 'GameOver') {
      showGameOverModal(s);
      
      // Announce game over to screen readers
      const liveRegion = document.getElementById('game-status-live');
      if (liveRegion) {
        liveRegion.textContent = 'Game over. Tournament has ended.';
      }
    }
    
    // Announce phase changes to screen readers
    const liveRegion = document.getElementById('game-status-live');
    if (liveRegion && s.phase) {
      const phaseAnnouncements: Record<string, string> = {
        'PreFlop': 'Pre-flop betting round',
        'Flop': 'Flop cards revealed',
        'Turn': 'Turn card revealed', 
        'River': 'River card revealed',
        'Showdown': 'Showdown - revealing hands'
      };
      
      const announcement = phaseAnnouncements[s.phase];
      if (announcement) {
        liveRegion.textContent = announcement;
      }
    }

    // Update player chips in top bar
    const playerChipsEl = document.getElementById('player-chips');
    if (playerChipsEl) {
      const playerChipsHtml = Object.values(s.players)
        .sort((a, b) => a.seatIndex - b.seatIndex)
        .map(player => {
          const chips = isNaN(player.chips) ? 0 : player.chips;
          const isBusted = chips <= 0;
          const bustClass = isBusted ? ' busted' : '';
          return `<span class="player-chip-count${bustClass}">${player.name}: $${chips}</span>`;
        })
        .join('');
      playerChipsEl.innerHTML = playerChipsHtml;
    }

    // Update auto-fold indicator
    updateAutoFoldIndicator();

      // Show hand summary when we have handSummary data (after showdown completes)
  if (s.handSummary && s.phase === 'Idle') {
    // showHandSummary(s, s.handSummary); // This function is removed
  }
  
  // Show game over modal when tournament ends
  if (s.phase === 'GameOver' && s.winner) {
    showGameOverModal(s);
  }
  });

  // Keyboard shortcuts for quick actions when modal is open
  document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when modal is visible and it's human turn
    if (!gameOverOverlay.classList.contains('show')) return;
    
    const state = store.getState && store.getState();
    const isHumanTurn = state?.round && state.round.currentTurnSeatIndex === 0;
    if (!isHumanTurn) return;
    
    // Prevent handling if user is typing in input field
    if (e.target instanceof HTMLInputElement) return;
    
    switch (e.key.toLowerCase()) {
      case 'f':
        e.preventDefault();
        const foldBtn = gameOverOverlay.querySelector('#action-fold') as HTMLButtonElement;
        if (foldBtn && !foldBtn.disabled) {
          foldBtn.click();
          soundEngine.playClick();
        }
        break;
      case 'c':
        e.preventDefault();
        const checkBtn = gameOverOverlay.querySelector('#action-check') as HTMLButtonElement;
        const callBtn = gameOverOverlay.querySelector('#action-call') as HTMLButtonElement;
        if (checkBtn && !checkBtn.disabled) {
          checkBtn.click();
          soundEngine.playClick();
        } else if (callBtn && !callBtn.disabled) {
          callBtn.click();
          soundEngine.playClick();
        }
        break;
      case 'r':
        e.preventDefault();
        const raiseBtn = gameOverOverlay.querySelector('#action-raise') as HTMLButtonElement;
        const betBtn = gameOverOverlay.querySelector('#action-bet') as HTMLButtonElement;
        if (raiseBtn && !raiseBtn.disabled) {
          raiseBtn.click();
          soundEngine.playClick();
        } else if (betBtn && !betBtn.disabled) {
          betBtn.click();
          soundEngine.playClick();
        }
        break;
      case 'a':
        e.preventDefault();
        const allinBtn = gameOverOverlay.querySelector('#action-allin') as HTMLButtonElement;
        if (allinBtn && !allinBtn.disabled) {
          allinBtn.click();
          soundEngine.playClick();
        }
        break;
      case 'escape':
        e.preventDefault();
        const cancelBtn = gameOverOverlay.querySelector('#game-over-reset') as HTMLButtonElement;
        if (cancelBtn) {
          cancelBtn.click();
          soundEngine.playClick();
        }
        break;
    }
  });
}

function rankToDisplay(id: string) {
  return id.replace('10', 'T');
}

function getAvatarSafe(seed: number): string {
  try { return getCharacterAvatarSVG(`P${seed}`, 64); } catch { return ''; }
}

function getCharacterAvatarSafe(characterId: string): string {
  try { return getCharacterAvatarSVG(characterId, 64); } catch { return getAvatarSafe(1); }
}

function getHandCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    'HighCard': 'High Card',
    'OnePair': 'Pair', 
    'TwoPair': 'Two Pair',
    'ThreeKind': 'Three of a Kind',
    'Straight': 'Straight',
    'Flush': 'Flush',
    'FullHouse': 'Full House',
    'FourKind': 'Four of a Kind',
    'StraightFlush': 'Straight Flush'
  };
  
  return categoryMap[category] || category;
}

function getCurrentHandRanking(state: GameState, playerId: string): string {
  const player = state.players[playerId];
  if (!player?.hand?.c1 || !player?.hand?.c2) {
    return 'No Cards';
  }

  // Evaluate current hand with available cards
  const playerCards = [player.hand.c1, player.hand.c2];
  const boardCards = state.board;
  
  if (boardCards.length === 0) {
    // Pre-flop: just show hole cards
    if (player.hand.c1.rank === player.hand.c2.rank) {
      const rankName = getRankDisplayName(player.hand.c1.rank);
      return `Pair of ${rankName}s`;
    } else {
      const rank1 = getRankDisplayName(player.hand.c1.rank);
      const rank2 = getRankDisplayName(player.hand.c2.rank);
      const suited = player.hand.c1.suit === player.hand.c2.suit ? ' suited' : '';
      return `${rank1}-${rank2}${suited}`;
    }
  }

  // Post-flop: evaluate best 5-card hand
  const allCards = [...playerCards, ...boardCards];
  if (allCards.length < 5) {
    // Not enough cards for full evaluation, show partial
    return getPartialHandDescription(playerCards, boardCards);
  }

  // Only use evaluateBestOfSeven when we have exactly 7 cards
  if (allCards.length !== 7) {
    // For 5 or 6 cards, use a simplified evaluation
    return getPartialHandDescription(playerCards, boardCards);
  }

  const evaluation = evaluateBestOfSeven(allCards);
  const categoryName = getHandCategoryDisplayName(evaluation.category);
  
  // Add more specific details for certain hands
  if (evaluation.category === 'OnePair' && evaluation.tiebreak[0] !== undefined) {
    const pairRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `Pair of ${pairRank}s`;
  } else if (evaluation.category === 'TwoPair' && evaluation.tiebreak[0] !== undefined && evaluation.tiebreak[1] !== undefined) {
    const highPair = getRankDisplayName(evaluation.tiebreak[0]);
    const lowPair = getRankDisplayName(evaluation.tiebreak[1]);
    return `Two Pair: ${highPair}s over ${lowPair}s`;
  } else if (evaluation.category === 'ThreeKind' && evaluation.tiebreak[0] !== undefined) {
    const tripRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `Three ${tripRank}s`;
  } else if (evaluation.category === 'FullHouse' && evaluation.tiebreak[0] !== undefined && evaluation.tiebreak[1] !== undefined) {
    const tripRank = getRankDisplayName(evaluation.tiebreak[0]);
    const pairRank = getRankDisplayName(evaluation.tiebreak[1]);
    return `Full House: ${tripRank}s over ${pairRank}s`;
  } else if (evaluation.category === 'FourKind' && evaluation.tiebreak[0] !== undefined) {
    const quadRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `Four ${quadRank}s`;
  } else if (evaluation.category === 'Straight' && evaluation.tiebreak[0] !== undefined) {
    const highRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `Straight to ${highRank}`;
  } else if (evaluation.category === 'Flush' && evaluation.tiebreak[0] !== undefined) {
    const highRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `${highRank}-high Flush`;
  } else if (evaluation.category === 'StraightFlush' && evaluation.tiebreak[0] !== undefined) {
    const highRank = getRankDisplayName(evaluation.tiebreak[0]);
    if (evaluation.tiebreak[0] === 14) {
      return 'Royal Flush';
    }
    return `Straight Flush to ${highRank}`;
  } else if (evaluation.category === 'HighCard' && evaluation.tiebreak[0] !== undefined) {
    const highRank = getRankDisplayName(evaluation.tiebreak[0]);
    return `${highRank} High`;
  }

  return categoryName;
}

function getRankDisplayName(rank: number): string {
  const rankMap: Record<number, string> = {
    2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven',
    8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Jack', 12: 'Queen', 13: 'King', 14: 'Ace'
  };
  return rankMap[rank] || String(rank);
}

function getPartialHandDescription(holeCards: any[], boardCards: any[]): string {
  // Enhanced evaluation that correctly detects trips, quads, etc.
  const allCards = [...holeCards, ...boardCards];
  
  // Count ranks to detect pairs, trips, etc.
  const ranks = allCards.map(c => c.rank);
  const rankCounts = ranks.reduce((acc, rank) => {
    acc[rank] = (acc[rank] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  // Sort counts by frequency (highest first) then by rank (highest first)
  const sortedCounts = Object.entries(rankCounts)
    .sort(([aRank, aCount], [bRank, bCount]) => {
      const aCountNum = Number(aCount);
      const bCountNum = Number(bCount);
      if (aCountNum !== bCountNum) return bCountNum - aCountNum; // Higher count first
      return Number(bRank) - Number(aRank); // Higher rank first if tied
    });
  
  if (sortedCounts.length === 0) {
    return 'No Cards';
  }
  
  const topEntry = sortedCounts[0];
  if (!topEntry) return 'No Cards';
  
  const [topRank, topCount] = topEntry;
  const topRankName = getRankDisplayName(Number(topRank));
  const topCountNum = Number(topCount);
  
  // Four of a kind
  if (topCountNum >= 4) {
    return `Four ${topRankName}s`;
  }
  
  // Three of a kind
  if (topCountNum >= 3) {
    return `Three ${topRankName}s`;
  }
  
  // Check for two pair
  if (topCountNum >= 2 && sortedCounts.length > 1) {
    const secondEntry = sortedCounts[1];
    if (secondEntry) {
      const [secondRank, secondCount] = secondEntry;
      const secondCountNum = Number(secondCount);
      if (secondCountNum >= 2) {
        const secondRankName = getRankDisplayName(Number(secondRank));
        return `Two Pair: ${topRankName}s and ${secondRankName}s`;
      }
    }
  }
  
  // One pair
  if (topCountNum >= 2) {
    return `Pair of ${topRankName}s`;
  }
  
  // High card
  return `${topRankName} High`;
}

function updateProbabilityDisplay(probabilityElement: HTMLElement, state: GameState) {
  // Check if probabilities are enabled in localStorage
  const showProbabilities = localStorage.getItem('poker-show-probabilities') !== 'false';
  
  if (!showProbabilities) {
    probabilityElement.style.display = 'none';
    return;
  }

  // Only show for human player during active play
  const humanPlayer = Object.values(state.players).find(p => p.seatIndex === 0);
  if (!humanPlayer) {
    probabilityElement.style.display = 'none';
    return;
  }

  if (!humanPlayer.hand?.c1 || !humanPlayer.hand?.c2) {
    probabilityElement.style.display = 'none';
    return;
  }

  if (state.phase === 'Idle' || state.phase === 'Showdown' || state.phase === 'GameOver') {
    probabilityElement.style.display = 'none';
    return;
  }

  const probabilities = calculateHandProbabilities(state, humanPlayer.id);
  if (!probabilities) {
    probabilityElement.style.display = 'none';
    return;
  }

  // Get current hand ranking
  const currentHandRanking = getCurrentHandRanking(state, humanPlayer.id);

  probabilityElement.style.display = 'block';
  probabilityElement.innerHTML = `
    <div class="probability-container">
      <div class="probability-header">
        <h4>Hand Analysis</h4>
        <button class="probability-toggle" onclick="toggleProbabilityDisplay()">×</button>
      </div>
      <div class="probability-content">
        <div class="probability-main">
          <div class="probability-item current-hand">
            <span class="probability-label">Current Hand:</span>
            <span class="probability-value current-hand-ranking">${currentHandRanking}</span>
          </div>
          <div class="probability-item">
            <span class="probability-label">Win Chance:</span>
            <span class="probability-value ${getProbabilityClass(probabilities.winProbability)}">${formatProbability(probabilities.winProbability)}</span>
          </div>
          <div class="probability-item">
            <span class="probability-label">Hand Strength:</span>
            <span class="probability-value">${getProbabilityDescription(probabilities.winProbability)}</span>
          </div>
        </div>
        
        ${probabilities.outs.length > 0 ? `
          <div class="probability-outs">
            <h5>Potential Improvements:</h5>
            ${probabilities.outs.map(out => `
              <div class="out-item">
                <span class="out-description">${out.description}</span>
                <span class="out-probability">${formatProbability(out.probability)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function getProbabilityClass(probability: number): string {
  if (probability >= 0.7) return 'prob-very-strong';
  if (probability >= 0.5) return 'prob-strong';
  if (probability >= 0.3) return 'prob-moderate';
  if (probability >= 0.15) return 'prob-weak';
  return 'prob-very-weak';
}

// Global function to toggle probability display
(window as any).toggleProbabilityDisplay = function() {
  localStorage.setItem('poker-show-probabilities', 'false');
  const probabilityDisplays = document.querySelectorAll('.probability-display');
  for (let i = 0; i < probabilityDisplays.length; i++) {
    (probabilityDisplays[i] as HTMLElement).style.display = 'none';
  }
};

function showGameOverModal(state: GameState) {
  const gameOverOverlay = document.getElementById('game-over-overlay')!;
  const title = document.getElementById('game-over-title')!;
  const content = document.getElementById('game-over-content')!;
  
  const humanPlayer = Object.values(state.players).find(p => p.seatIndex === 0);
  const winner = state.winner ? Object.values(state.players).find(p => p.id === state.winner) : null;
  
  if (humanPlayer?.isBustedOut) {
    title.textContent = '💀 You Busted Out!';
    content.innerHTML = `
      <p>You've been eliminated from the tournament!</p>
      <p><strong>Winner:</strong> ${winner?.name || 'Unknown'}</p>
    `;
  } else {
    title.textContent = '🏆 Tournament Complete!';
    content.innerHTML = `
      <p><strong>Winner:</strong> ${winner?.name || 'Unknown'}</p>
      <p>Congratulations on completing the tournament!</p>
    `;
  }
  
  gameOverOverlay.classList.add('show');
}

