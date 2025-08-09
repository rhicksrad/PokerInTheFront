import type { GameState, Player, PlayerId } from './types';

export type PlayerAction =
  | { type: 'Fold'; seatIndex: number }
  | { type: 'Check'; seatIndex: number }
  | { type: 'Call'; seatIndex: number }
  | { type: 'Bet'; seatIndex: number; amount: number }
  | { type: 'Raise'; seatIndex: number; amount: number }; // amount is raise size over currentBet

export function computeFacingAmount(state: GameState, playerId: PlayerId): number {
  if (!state.round) return 0;
  const currentBet = state.round.currentBet;
  const committed = state.round.committedThisStreet[playerId] ?? 0;
  return Math.max(0, currentBet - committed);
}

export function computeLegalActions(state: GameState, seatIndex: number): Set<'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise'> {
  const legal = new Set<'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise'>();
  if (!state.round) return legal;
  const player = Object.values(state.players).find((p) => p.seatIndex === seatIndex);
  if (!player || player.isFolded || player.isAllIn) return legal;
  const facing = computeFacingAmount(state, player.id);
  
  // Limit raises per street to prevent infinite loops (max 3 raises per street)
  const maxRaisesPerStreet = 3;
  const canRaise = state.round.raisesThisStreet < maxRaisesPerStreet;
  
  if (facing > 0) {
    legal.add('Fold');
    if (player.chips > 0) legal.add('Call');
    if (player.chips > facing && canRaise) legal.add('Raise');
  } else {
    legal.add('Check');
    if (player.chips > 0) legal.add('Bet');
  }
  return legal;
}

export function applyPlayerAction(state: GameState, action: PlayerAction): GameState {
  if (!state.round) return state;
  const round = state.round;
  const player = Object.values(state.players).find((p) => p.seatIndex === action.seatIndex);
  if (!player) return state;

  // Helper to advance turn to next seat in queue
  function advanceTurn(actionType?: string, updatedPlayers?: Record<string, any>): { toActQueue: number[]; currentTurnSeatIndex: number } {
    const queue = [...round.toActQueue];
    const playersToCheck = updatedPlayers || state.players;
    
    // Remove current player from queue if they've completed their action
    // and won't need to act again this street (unless there's a raise)
    if (actionType === 'Fold' || actionType === 'Call' || actionType === 'Check') {
      const idx = queue.indexOf(round.currentTurnSeatIndex);
      if (idx >= 0) queue.splice(idx, 1);
    }
    
    // For Bet/Raise, player stays in queue and everyone else gets another chance
    if (actionType === 'Bet' || actionType === 'Raise') {
      // Add all active players back to queue (except current player who just bet/raised)
      const allActiveSeatIndexes = Object.values(playersToCheck)
        .filter(p => !p.isFolded && !p.isAllIn && p.seatIndex !== round.currentTurnSeatIndex)
        .map(p => p.seatIndex);
      
      // Remove current player and rebuild queue with all other active players
      const currentIdx = queue.indexOf(round.currentTurnSeatIndex);
      if (currentIdx >= 0) queue.splice(currentIdx, 1);
      
      // Add back other active players who need to respond to the bet/raise
      for (const seatIdx of allActiveSeatIndexes) {
        if (!queue.includes(seatIdx)) {
          queue.push(seatIdx);
        }
      }
    }
    
    // Always remove all-in and folded players from the final queue
    const updatedQueue = queue.filter(seatIndex => {
      const playerAtSeat = Object.values(playersToCheck).find(p => p.seatIndex === seatIndex);
      return playerAtSeat && !playerAtSeat.isAllIn && !playerAtSeat.isFolded && playerAtSeat.chips > 0;
    });
    
    if (updatedQueue.length === 0) {
      console.log('🎯 Queue empty after filtering - no more players to act');
      return { toActQueue: [], currentTurnSeatIndex: -1 };
    }
    
    // Find next player in queue
    let nextPlayerIndex = 0;
    if (updatedQueue.length > 1) {
      // Start from the player after the one who just acted
      const currentPos = updatedQueue.indexOf(round.currentTurnSeatIndex);
      if (currentPos >= 0) {
        nextPlayerIndex = (currentPos + 1) % updatedQueue.length;
      }
    }
    
    const nextSeat = updatedQueue[nextPlayerIndex] ?? -1;
    console.log(`🎯 Before ${actionType} - Queue: [${round.toActQueue.join(',')}], Current: ${action.seatIndex}`);
    console.log(`🎲 After ${actionType} - Queue: [${updatedQueue.join(',')}], Next: ${nextSeat}`);
    return { toActQueue: updatedQueue, currentTurnSeatIndex: nextSeat };
  }

  if (action.type === 'Fold') {
    const updatedPlayers = { ...state.players, [player.id]: { ...player, isFolded: true } };
    const nextTurn = advanceTurn('Fold');
    let nextState = {
      ...state,
      players: updatedPlayers,
      round: { ...round, toActQueue: nextTurn.toActQueue, currentTurnSeatIndex: nextTurn.currentTurnSeatIndex },
      devLog: [`${player.name} folded`, `[seat ${action.seatIndex}] Fold`, ...state.devLog].slice(0, 50),
    };
    // Fold win logic handled by tryCompleteStreet
    return nextState;
  }

  if (action.type === 'Check') {
    const nextTurn = advanceTurn('Check');
    return {
      ...state,
      round: { ...round, toActQueue: nextTurn.toActQueue, currentTurnSeatIndex: nextTurn.currentTurnSeatIndex },
      devLog: [`${player.name} checked`, `[seat ${action.seatIndex}] Check`, ...state.devLog].slice(0, 50),
    };
  }

  if (action.type === 'Call') {
    const facing = computeFacingAmount(state, player.id);
    const pay = Math.min(player.chips, facing);
    const updatedPlayers = { ...state.players, [player.id]: { ...player, chips: player.chips - pay, isAllIn: player.chips - pay === 0 } };
    const committed = { ...round.committedThisStreet, [player.id]: (round.committedThisStreet[player.id] ?? 0) + pay };
    const handContributions = { ...state.handContributions, [player.id]: (state.handContributions[player.id] ?? 0) + pay };
    const pots = rebuildPots(handContributions, updatedPlayers);

    const nextTurn = advanceTurn('Call', updatedPlayers);
    let nextState: GameState = {
      ...state,
      players: updatedPlayers,
      pots,
      handContributions,
      round: { ...round, committedThisStreet: committed, toActQueue: nextTurn.toActQueue, currentTurnSeatIndex: nextTurn.currentTurnSeatIndex },
      devLog: [`${player.name} called $${pay}${pay === player.chips + pay ? ' (all-in)' : ''}`, `[seat ${action.seatIndex}] Call ${pay}`, ...state.devLog].slice(0, 50),
    };
    // Fold win logic handled by tryCompleteStreet
    return nextState;
  }

  if (action.type === 'Bet') {
    if (round.currentBet !== 0) return logWarn(state, `illegal Bet: current bet already ${round.currentBet}`);
    const minBet = state.bigBlind;
    const desired = Math.max(0, Math.floor(action.amount));
    const pay = Math.min(player.chips, desired);
    if (pay < minBet && pay < player.chips) return logWarn(state, `bet too small: ${desired} (min ${minBet})`);
    const updatedPlayers = { ...state.players, [player.id]: { ...player, chips: player.chips - pay, isAllIn: player.chips - pay === 0 } };
    const committed = { ...round.committedThisStreet, [player.id]: (round.committedThisStreet[player.id] ?? 0) + pay };
    const handContributions = { ...state.handContributions, [player.id]: (state.handContributions[player.id] ?? 0) + pay };
    const pots = rebuildPots(handContributions, updatedPlayers);
    // Reset action queue to all active except bettor, starting next seat
    const { toActQueue, nextSeat } = resetQueueAfterAggression(state, action.seatIndex, updatedPlayers);
    let nextState: GameState = {
      ...state,
      players: updatedPlayers,
      pots,
      handContributions,
      round: { ...round, committedThisStreet: committed, currentBet: pay, minRaise: pay, toActQueue, currentTurnSeatIndex: nextSeat, raisesThisStreet: round.raisesThisStreet + 1 },
      devLog: [`${player.name} bet $${pay}${updatedPlayers[player.id].isAllIn ? ' (all-in)' : ''}`, `[seat ${action.seatIndex}] Bet ${pay} (aggressive action #${round.raisesThisStreet + 1})`, ...state.devLog].slice(0, 50),
    };
    // Fold win logic handled by tryCompleteStreet
    return nextState;
  }

  if (action.type === 'Raise') {
    const facing = computeFacingAmount(state, player.id);
    if (facing <= 0) return logWarn(state, 'illegal Raise: no bet to face');
    const desiredRaise = Math.max(0, Math.floor(action.amount));
    const minRaise = round.minRaise;
    const canPay = Math.min(player.chips, facing + desiredRaise);
    const isAllIn = canPay === player.chips;
    if (!isAllIn && desiredRaise < minRaise) return logWarn(state, `raise too small: ${desiredRaise} (min ${minRaise})`);
    const updatedPlayers = { ...state.players, [player.id]: { ...player, chips: player.chips - canPay, isAllIn } };
    const committed = { ...round.committedThisStreet, [player.id]: (round.committedThisStreet[player.id] ?? 0) + canPay };
    const handContributions = { ...state.handContributions, [player.id]: (state.handContributions[player.id] ?? 0) + canPay };
    const pots = rebuildPots(handContributions, updatedPlayers);
    // New currentBet is player's total committed this street (cap at round.currentBet + desiredRaise if all-in short)
    const playerCommitted = committed[player.id] ?? 0;
    const newCurrentBet = Math.max(round.currentBet, Math.min(playerCommitted, round.currentBet + desiredRaise));
    const newMinRaise = isAllIn && desiredRaise < minRaise ? round.minRaise : desiredRaise;
    const { toActQueue, nextSeat } = resetQueueAfterAggression(state, action.seatIndex, updatedPlayers);
    let nextState: GameState = {
      ...state,
      players: updatedPlayers,
      pots,
      handContributions,
      round: { ...round, committedThisStreet: committed, currentBet: newCurrentBet, minRaise: newMinRaise, toActQueue, currentTurnSeatIndex: nextSeat, raisesThisStreet: round.raisesThisStreet + 1 },
      devLog: [`${player.name} raised to $${newCurrentBet} (+$${desiredRaise})${isAllIn ? ' (all-in)' : ''}`, `[seat ${action.seatIndex}] Raise ${desiredRaise} (raise #${round.raisesThisStreet + 1})`, ...state.devLog].slice(0, 50),
    };
    // Fold win logic handled by tryCompleteStreet
    return nextState;
  }

  return state;
}

function logWarn(state: GameState, msg: string): GameState {
  return { ...state, devLog: [`[warn] ${msg}`, ...state.devLog].slice(0, 50) };
}

function resetQueueAfterAggression(state: GameState, aggressorSeat: number, updatedPlayers?: Record<string, any>): { toActQueue: number[]; nextSeat: number } {
  const seats = state.seats.map((s) => s.index);
  const playersToCheck = updatedPlayers || state.players;
  
  console.log(`🔄 Rebuilding queue after aggression from seat ${aggressorSeat}`);
  
  const q: number[] = [];
  // Start from the seat after the aggressor and go around the table
  for (let k = 1; k < seats.length; k++) { // Start from k=1 to skip aggressor
    const seatIndex = (aggressorSeat + k) % seats.length;
    const p = Object.values(playersToCheck).find((pp) => pp.seatIndex === seatIndex);
    
    console.log(`🔍 Checking seat ${seatIndex}: ${p?.name || 'empty'} - folded: ${p?.isFolded}, allIn: ${p?.isAllIn}`);
    
    if (!p || p.isFolded || p.isAllIn) continue;
    q.push(seatIndex);
    console.log(`✅ Added seat ${seatIndex} (${p.name}) to queue`);
  }
  
  const nextSeat = q[0] ?? -1; // -1 indicates no one left to act
  console.log(`🎯 New queue: [${q.join(',')}], next seat: ${nextSeat}`);
  
  return { toActQueue: q, nextSeat };
}

function nextSeatIndex(current: number, seats: number[]): number {
  const idx = seats.indexOf(current);
  return seats[(idx + 1) % seats.length] ?? 0;
}

// Note: Fold win logic moved to centralized tryCompleteStreet function
// This eliminates duplicate logic and potential conflicts

// Build side pots from total hand contributions per player.
// Algorithm: sort unique contribution caps; for each layer, collect the delta from eligible players.
export function rebuildPots(handContrib: Record<PlayerId, number>, players: Record<PlayerId, Player>) {
  const activeIds = Object.keys(players).filter((id) => !players[id].isFolded);
  const caps = Array.from(new Set(activeIds.map((id) => handContrib[id] ?? 0))).filter((v) => v > 0).sort((a, b) => a - b);
  let prev = 0;
  const pots: Array<{ amount: number; contributors: Record<PlayerId, number>; eligible: string[] }> = [];
  for (const cap of caps) {
    const layerContrib: Record<PlayerId, number> = {};
    let amount = 0;
    const elig: string[] = [];
    for (const id of activeIds) {
      const c = handContrib[id] ?? 0;
      const delta = Math.max(0, Math.min(c, cap) - prev);
      if (delta > 0) {
        layerContrib[id] = delta;
        amount += delta;
        elig.push(id);
      }
    }
    if (amount > 0) pots.push({ amount, contributors: layerContrib, eligible: elig });
    prev = cap;
  }
  return pots;
}

