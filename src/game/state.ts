import { createStandardDeck, shuffleInPlace, draw, verifyDeckIntegrity, getRemainingCards } from './deck';
import { createRng } from './rng';
import { Card, GameState, Player, Rank, Seat } from './types';
import { cardObjectsToRankSuitEmojiString } from '../ui/cardEmoji';
import { filterPlayers, resetPlayerStatesForNewHand, getLastPlayer } from './playerUtils';

export function createInitialGameState(): GameState {
  const startingChips = 1000;
  const smallBlind = 5;
  const bigBlind = 10;
  const seats: Seat[] = [0, 1, 2, 3].map((i) => ({ index: i }));

  const players: Record<string, Player> = {
    P0: { id: 'P0', name: 'You', isHuman: true, seatIndex: 0, chips: startingChips, isFolded: false, isAllIn: false },
    P1: { id: 'P1', name: 'Silas McGraw', isHuman: false, seatIndex: 1, chips: startingChips, isFolded: false, isAllIn: false },
    P2: { id: 'P2', name: 'Martha Jensen', isHuman: false, seatIndex: 2, chips: startingChips, isFolded: false, isAllIn: false },
    P3: { id: 'P3', name: 'Samuel Whitmore', isHuman: false, seatIndex: 3, chips: startingChips, isFolded: false, isAllIn: false },
  };

  const deck: Card[] = createStandardDeck();
  void deck;

  return {
    handNumber: 1,
    smallBlind,
    bigBlind,
    buttonIndex: 0,
    seats,
    players,
    board: [],
    deck: [],
    pots: [],
    handContributions: {},
    round: undefined,
    phase: 'Idle',
    rngSeed: 42,
    devLog: ['[dev] game initialized'],
  };
}

export function advanceFakePhase(state: GameState): GameState {
  const order: GameState['phase'][] = [
    'Idle',
    'Deal',
    'Preflop',
    'Flop',
    'Turn',
    'River',
    'Showdown',
    'Payout',
    'NextHand',
  ];
  const idx = order.indexOf(state.phase);
  const next = order[(idx + 1) % order.length];
  return { ...state, phase: next, devLog: [`[dev] phase -> ${next}`, ...state.devLog].slice(0, 50) };
}

export function fakeDealBoard(state: GameState): GameState {
  const board: Card[] = [
    { rank: Rank.Ace, suit: 'S', id: 'AS' },
    { rank: Rank.King, suit: 'S', id: 'KS' },
    { rank: Rank.Queen, suit: 'S', id: 'QS' },
    { rank: Rank.Jack, suit: 'S', id: 'JS' },
    { rank: Rank.Ten, suit: 'S', id: 'TS' },
  ];
  return { ...state, board };
}

export function beginNewHand(state: GameState): GameState {
  // Use a more robust RNG seed that includes hand number and current timestamp for better randomness
  const timeBasedSeed = Date.now() % 1000000; // Use current time for additional randomness
  const rng = createRng(state.rngSeed + state.handNumber * 1000 + timeBasedSeed);
  const deck = createStandardDeck();
  
  // Verify deck integrity before shuffling
  if (!verifyDeckIntegrity(deck)) {
    console.error('❌ Critical error: Deck integrity check failed in beginNewHand');
  }
  
  shuffleInPlace(deck, rng);
  console.log(`🎴 Hand #${state.handNumber + 1}: Fresh 52-card deck shuffled with seed ${rng.seed}`);

  const buttonIndex = state.handNumber === 1 ? state.buttonIndex : (state.buttonIndex + 1) % state.seats.length;
  const sbSeat = (buttonIndex + 1) % state.seats.length;
  const bbSeat = (buttonIndex + 2) % state.seats.length;
  
  // Prepare hand start logging
  const handStartLogs: string[] = [];
  handStartLogs.push(`🃏 Hand #${state.handNumber + 1} begins`);
  
  // Get player names for logging
  const buttonPlayer = Object.values(state.players).find(p => p.seatIndex === buttonIndex);
  const sbPlayerForLog = Object.values(state.players).find(p => p.seatIndex === sbSeat);
  const bbPlayerForLog = Object.values(state.players).find(p => p.seatIndex === bbSeat);
  
  if (buttonPlayer) handStartLogs.push(`🔘 ${buttonPlayer.name} is on the button`);
  if (sbPlayerForLog && bbPlayerForLog) {
    handStartLogs.push(`🏦 Blinds: ${sbPlayerForLog.name} ($${state.smallBlind}) • ${bbPlayerForLog.name} ($${state.bigBlind})`);
  }

  const seats: Seat[] = state.seats.map((s) => ({
    ...s,
    isButton: s.index === buttonIndex,
    isSmallBlind: s.index === sbSeat,
    isBigBlind: s.index === bbSeat,
  }));

  const playersArr = Object.values(state.players);
  const playersBySeat = new Map<number, Player>();
  for (const p of playersArr) playersBySeat.set(p.seatIndex, p);

  // Reset all players for new hand using centralized utility
  const dealt = resetPlayerStatesForNewHand(state.players);
  for (let round = 0; round < 2; round++) {
    for (let si = 0; si < seats.length; si++) {
      const p = playersBySeat.get(si);
      if (!p) continue;
      const card = draw(deck, 1)[0];
      const prev = dealt[p.id].hand ?? {};
      dealt[p.id] = { ...dealt[p.id], hand: round === 0 ? { c1: card } : { ...prev, c2: card } };
    }
  }

  console.log(`🎴 Hand #${state.handNumber + 1}: Dealt ${52 - deck.length} cards to players, ${deck.length} remaining`);
  
  // Add cards dealt message
  handStartLogs.push(`🎯 Hole cards dealt to ${Object.keys(dealt).length} players`);

  const contributed: Record<string, number> = {};
  let playersUpdated: Record<string, Player> = { ...dealt };
  const sbPlayer = playersBySeat.get(sbSeat);
  const bbPlayer = playersBySeat.get(bbSeat);
  if (sbPlayer) {
    const amt = Math.min(state.smallBlind, sbPlayer.chips);
    playersUpdated[sbPlayer.id] = { ...playersUpdated[sbPlayer.id], chips: sbPlayer.chips - amt };
    contributed[sbPlayer.id] = amt;
  }
  if (bbPlayer) {
    const amt = Math.min(state.bigBlind, bbPlayer.chips);
    playersUpdated[bbPlayer.id] = { ...playersUpdated[bbPlayer.id], chips: bbPlayer.chips - amt };
    contributed[bbPlayer.id] = amt + (contributed[bbPlayer.id] ?? 0);
  }

  const potAmount = Object.values(contributed).reduce((a, b) => a + b, 0);

  const toActStart = (bbSeat + 1) % seats.length;
  const toActQueue: number[] = [];
  for (let k = 0; k < seats.length; k++) {
    const si = (toActStart + k) % seats.length;
    const p = playersBySeat.get(si);
    if (!p || p.isBustedOut) continue;
    toActQueue.push(si);
  }

  const next: GameState = {
    ...state,
    handNumber: state.handNumber + 1, // Increment hand number for proper randomization
    buttonIndex, // Update button position
    seats,
    players: playersUpdated,
    board: [],
    pots: potAmount > 0 ? [{ amount: potAmount, contributors: contributed, eligible: Object.keys(playersUpdated) }] : [],
    handContributions: contributed,
    handSummary: undefined, // Clear previous hand results
    round: {
      street: 'Preflop',
      currentBet: state.bigBlind,
      minRaise: state.bigBlind,
      toActQueue,
      actions: [],
      committedThisStreet: contributed,
      currentTurnSeatIndex: toActQueue[0] ?? 0,
      raisesThisStreet: 0,
    },
    phase: 'Preflop',
    devLog: [...handStartLogs, `[dev] Hand #${state.handNumber + 1}: BTN=${buttonIndex}, SB=${sbSeat}, BB=${bbSeat}`, ...state.devLog].slice(0, 50),
  };

  return next;
}

export function endTurnAdvance(state: GameState): GameState {
  if (!state.round) return state;
  const { toActQueue, currentTurnSeatIndex } = state.round;
  if (toActQueue.length === 0) return state;
  const idx = toActQueue.indexOf(currentTurnSeatIndex);
  const nextIdx = (idx + 1) % toActQueue.length;
  const nextSeat = toActQueue[nextIdx];
  return {
    ...state,
    round: { ...state.round, currentTurnSeatIndex: nextSeat },
    devLog: [`[dev] turn -> seat ${nextSeat}`, ...state.devLog].slice(0, 50),
  };
}

export function revealFlop(state: GameState): GameState {
  if (!state.round) return state;
  const board: Card[] = [
    { rank: Rank.Ace, suit: 'S', id: 'AS' },
    { rank: Rank.King, suit: 'S', id: 'KS' },
    { rank: Rank.Queen, suit: 'S', id: 'QS' },
  ];
  return {
    ...state,
    board,
    phase: 'Flop',
    round: { ...state.round, street: 'Flop' },
    devLog: ['[dev] reveal flop', ...state.devLog].slice(0, 50),
  };
}

export function revealTurn(state: GameState): GameState {
  if (!state.round) return state;
  if (state.board.length < 3) return state;
  const board = [...state.board, { rank: Rank.Jack, suit: 'S', id: 'JS' }];
  return {
    ...state,
    board,
    phase: 'Turn',
    round: { ...state.round, street: 'Turn' },
    devLog: ['[dev] reveal turn', ...state.devLog].slice(0, 50),
  };
}

export function revealRiver(state: GameState): GameState {
  if (!state.round) return state;
  if (state.board.length < 4) return state;
  const board = [...state.board, { rank: Rank.Ten, suit: 'S', id: 'TS' }];
  return {
    ...state,
    board,
    phase: 'River',
    round: { ...state.round, street: 'River' },
    devLog: ['[dev] reveal river', ...state.devLog].slice(0, 50),
  };
}

function computeNextToActQueue(state: GameState): number[] {
  const start = (state.buttonIndex + 1) % state.seats.length;
  const q: number[] = [];
  for (let k = 0; k < state.seats.length; k++) {
    const si = (start + k) % state.seats.length;
    const p = Object.values(state.players).find((pp) => pp.seatIndex === si);
    if (!p || p.isFolded || p.isAllIn || p.isBustedOut) continue;
    q.push(si);
  }
  return q;
}

export function tryCompleteStreet(state: GameState): GameState {
  if (!state.round) return state;
  const round = state.round;
  
  // Track log messages for this street transition
  const logMessages: string[] = [];
  
  // Check if betting round is complete using centralized player filtering
  const players = filterPlayers(state);
  const totalActivePlayers = players.active.length + players.allIn.length;
  
  // Check for fold win using centralized utility
  const lastPlayer = getLastPlayer(state);
  if (lastPlayer) {
    const winMessage = `🏆 ${lastPlayer.name} wins by elimination - all other players folded!`;
    return { ...state, phase: 'Showdown', devLog: [winMessage, '[dev] win by fold', ...state.devLog].slice(0, 50) };
  }
  
  // If everyone who isn't folded is all-in, go straight to showdown
  if (players.active.length === 0 && players.allIn.length > 1) {
    console.log('🎰 All remaining players are all-in, going to showdown');
    return dealBoardForShowdown(state, '[dev] all-in showdown');
  }
  
  // If only one active player and everyone else is all-in, go to showdown
  if (players.active.length === 1 && players.allIn.length > 0) {
    console.log('🎰 One active player, rest all-in, going to showdown');
    return dealBoardForShowdown(state, '[dev] mixed showdown');
  }
  
  // Everyone must have matched the current bet
  const allMatched = players.active.every((p) => (round.committedThisStreet[p.id] ?? 0) >= round.currentBet);
  if (!allMatched) {
    return state;
  }
  
  // Check if everyone has had a chance to act
  // If the queue is empty, betting is complete
  // If there are still players in queue, they need to act
  if (round.toActQueue.length > 0) {
    return state; // Still have players to act
  }
  
  // Add debug logging
  const debugMsg = `🔄 Street complete: ${round.street} -> advancing (queue empty, all matched)`;
  console.log(debugMsg);

  // Advance to next street with random cards
  let nextBoard: Card[] = state.board;
  let nextStreet = round.street;
  let nextPhase = state.phase;
  
  // Create a new deck and remove already dealt cards
  // Use a more robust RNG seed that includes hand number, current board length, and timestamp
  const timeBasedSeed = Date.now() % 1000000;
  const rng = createRng(state.rngSeed + state.handNumber * 1000 + nextBoard.length * 100 + timeBasedSeed);
  const availableDeck = createStandardDeck();
  
  // Remove all dealt cards from available deck
  const dealtCards = new Set<string>();
  Object.values(state.players).forEach(player => {
    if (player.hand?.c1) dealtCards.add(player.hand.c1.id);
    if (player.hand?.c2) dealtCards.add(player.hand.c2.id);
  });
  state.board.forEach(card => dealtCards.add(card.id));
  
  const remainingDeck = availableDeck.filter(card => !dealtCards.has(card.id));
  
  // Verify we have the correct number of remaining cards
  const expectedRemaining = 52 - dealtCards.size;
  if (remainingDeck.length !== expectedRemaining) {
    console.warn(`⚠️ Card count mismatch: Expected ${expectedRemaining} remaining cards, got ${remainingDeck.length}`);
  }
  
  shuffleInPlace(remainingDeck, rng);
  console.log(`🎴 Street ${round.street}: Dealing from ${remainingDeck.length} remaining cards with seed ${rng.seed}`);
  
  if (round.street === 'Preflop') {
    // Deal flop - 3 cards
    const flopCards = draw(remainingDeck, 3);
    nextBoard = flopCards;
    nextStreet = 'Flop';
    nextPhase = 'Flop';
    const flopMessage = `🎴 Flop revealed: ${cardObjectsToRankSuitEmojiString(flopCards)}`;
    console.log(flopMessage);
    logMessages.push(flopMessage);
    logMessages.push(`💰 Pot: $${state.pots.reduce((sum, pot) => sum + pot.amount, 0)} • New betting round begins`);
  } else if (round.street === 'Flop') {
    // Deal turn - 1 card
    const turnCard = draw(remainingDeck, 1)[0];
    nextBoard = [...state.board, turnCard];
    nextStreet = 'Turn';
    nextPhase = 'Turn';
    const turnMessage = `🎴 Turn revealed: ${cardObjectsToRankSuitEmojiString([turnCard])} • Board: ${cardObjectsToRankSuitEmojiString(nextBoard)}`;
    console.log(turnMessage);
    logMessages.push(turnMessage);
    logMessages.push(`💰 Pot: $${state.pots.reduce((sum, pot) => sum + pot.amount, 0)} • New betting round begins`);
  } else if (round.street === 'Turn') {
    // Deal river - 1 card
    const riverCard = draw(remainingDeck, 1)[0];
    nextBoard = [...state.board, riverCard];
    nextStreet = 'River';
    nextPhase = 'River';
    const riverMessage = `🎴 River revealed: ${cardObjectsToRankSuitEmojiString([riverCard])} • Final board: ${cardObjectsToRankSuitEmojiString(nextBoard)}`;
    console.log(riverMessage);
    logMessages.push(riverMessage);
    logMessages.push(`💰 Pot: $${state.pots.reduce((sum, pot) => sum + pot.amount, 0)} • Final betting round begins`);
  } else {
    // River complete -> showdown
    const activePlayers = Object.values(state.players).filter(p => !p.isFolded && !p.isBustedOut);
    const showdownLogs = [
      '🎰 All betting complete - going to showdown!',
      `🃏 ${activePlayers.length} players remain with final board: ${cardObjectsToRankSuitEmojiString(state.board)}`
    ];
    return { ...state, phase: 'Showdown', devLog: [...showdownLogs, '[dev] showdown', ...state.devLog].slice(0, 50) };
  }

  const toActQueue = computeNextToActQueue(state);
  return {
    ...state,
    board: nextBoard,
    phase: nextPhase,
    round: {
      ...round,
      street: nextStreet,
      currentBet: 0,
      minRaise: state.bigBlind,
      committedThisStreet: {},
      toActQueue,
      currentTurnSeatIndex: toActQueue[0] ?? 0,
      raisesThisStreet: 0,
      actions: [],
    },
    devLog: [...logMessages, `[dev] advance street -> ${nextStreet}`, ...state.devLog].slice(0, 50),
  };
}

function dealBoardForShowdown(state: GameState, logMessage: string): GameState {
  // Deal the remaining board cards needed for showdown
  let nextBoard = [...state.board];
  
  // Create a new deck and remove already dealt cards
  // Use a more robust RNG seed that includes hand number, current board length, and timestamp
  const timeBasedSeed = Date.now() % 1000000;
  const rng = createRng(state.rngSeed + state.handNumber * 1000 + nextBoard.length * 100 + timeBasedSeed);
  const availableDeck = createStandardDeck();
  
  // Remove all dealt cards from available deck
  const dealtCards = new Set<string>();
  Object.values(state.players).forEach(player => {
    if (player.hand?.c1) dealtCards.add(player.hand.c1.id);
    if (player.hand?.c2) dealtCards.add(player.hand.c2.id);
  });
  state.board.forEach(card => dealtCards.add(card.id));
  
  const remainingDeck = availableDeck.filter(card => !dealtCards.has(card.id));
  
  // Verify we have the correct number of remaining cards
  const expectedRemaining = 52 - dealtCards.size;
  if (remainingDeck.length !== expectedRemaining) {
    console.warn(`⚠️ Showdown card count mismatch: Expected ${expectedRemaining} remaining cards, got ${remainingDeck.length}`);
  }
  
  shuffleInPlace(remainingDeck, rng);
  console.log(`🎴 Showdown: Dealing from ${remainingDeck.length} remaining cards with seed ${rng.seed}`);
  
  // Deal remaining cards to complete the board (need 5 total)
  const cardsNeeded = 5 - nextBoard.length;
  if (cardsNeeded > 0) {
    const additionalCards = draw(remainingDeck, cardsNeeded);
    nextBoard = [...nextBoard, ...additionalCards];
    console.log(`🎴 Showdown: Dealt ${cardsNeeded} additional cards: ${additionalCards.map(c => c.id).join(', ')}`);
  }
  
  return { 
    ...state, 
    board: nextBoard,
    phase: 'Showdown', 
    devLog: [logMessage, ...state.devLog].slice(0, 50) 
  };
}

export function checkBustOutConditions(state: GameState): GameState {
  // Check if any players are busted out (no chips left)
  const activePlayers = Object.values(state.players).filter(p => p.chips > 0);
  const bustedPlayers = Object.values(state.players).filter(p => p.chips <= 0);
  
  // Mark busted players
  let updatedPlayers = { ...state.players };
  bustedPlayers.forEach(player => {
    if (!player.isBustedOut) {
      updatedPlayers[player.id] = {
        ...player,
        isBustedOut: true,
        isFolded: true, // Busted players can't play
        chips: 0 // Ensure chips are exactly 0
      };
    }
  });
  
  // Check if human player busted out - this should end the game immediately
  const humanPlayer = Object.values(updatedPlayers).find(p => p.seatIndex === 0);
  if (humanPlayer?.isBustedOut) {
    console.log(`💀 Game Over! Human player busted out!`);
    // Find the winner (player with most chips)
    const remainingPlayers = Object.values(updatedPlayers).filter(p => !p.isBustedOut);
    const winner = remainingPlayers.length > 0 ? 
      remainingPlayers.reduce((a, b) => a.chips > b.chips ? a : b) : 
      Object.values(updatedPlayers).find(p => p.seatIndex !== 0); // Fallback to any bot
    
    return {
      ...state,
      players: updatedPlayers,
      phase: 'GameOver',
      winner: winner?.id,
      devLog: [`💀 Human player busted out! ${winner?.name || 'Unknown'} wins!`, ...state.devLog].slice(0, 50)
    };
  }
  
  // Check if only one player remains
  if (activePlayers.length <= 1) {
    // Game over - last player wins
    const winner = activePlayers[0];
    if (winner) {
      console.log(`🏆 Game Over! ${winner.name} wins the tournament!`);
      return {
        ...state,
        players: updatedPlayers,
        phase: 'GameOver',
        winner: winner.id,
        devLog: [`🏆 ${winner.name} wins the tournament!`, ...state.devLog].slice(0, 50)
      };
    }
  }
  
  // Check if we need to start a new hand but some players are busted
  if (state.phase === 'Idle' && bustedPlayers.length > 0) {
    // Filter out busted players from the next hand
    const playersForNextHand = Object.values(updatedPlayers).filter(p => !p.isBustedOut);
    
    if (playersForNextHand.length < 2) {
      // Not enough players for a hand
      const winner = playersForNextHand[0];
      if (winner) {
        console.log(`🏆 Game Over! ${winner.name} wins the tournament!`);
        return {
          ...state,
          players: updatedPlayers,
          phase: 'GameOver',
          winner: winner.id,
          devLog: [`🏆 ${winner.name} wins the tournament!`, ...state.devLog].slice(0, 50)
        };
      }
    }
  }
  
  return {
    ...state,
    players: updatedPlayers
  };
}

export function resetBustedPlayers(state: GameState): GameState {
  // Reset busted players for a new tournament
  const updatedPlayers = Object.values(state.players).map(player => ({
    ...player,
    chips: 1000, // Reset to starting chips
    isBustedOut: false,
    isFolded: false,
    isAllIn: false,
    hand: null,
    committedThisStreet: 0
  }));
  
  return {
    ...state,
    players: Object.fromEntries(updatedPlayers.map(p => [p.id, p])),
    phase: 'Idle',
    winner: null,
    handNumber: 0,
    devLog: ['🔄 Tournament reset - all players start with $1000', ...state.devLog].slice(0, 50)
  };
}

