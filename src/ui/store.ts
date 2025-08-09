import { createInitialGameState, advanceFakePhase, fakeDealBoard, beginNewHand, endTurnAdvance, revealFlop, revealTurn, revealRiver, tryCompleteStreet, checkBustOutConditions, resetBustedPlayers } from '../game/state';
import { computeShowdownWinners, applyWinnings } from '../game/payout';
import { applyPlayerAction, computeLegalActions } from '../game/betting';
import { decideAction, type BotDecision } from '../bots/simpleBot';
import { handHistoryTracker } from '../game/handHistory';
import { soundEngine } from './sounds';
import { achievementTracker } from '../game/achievements';
import { GameTimers } from './timerManager';
import { getPlayerBySeat } from '../game/playerUtils';

import type { GameState } from '../game/types';

type Listener = (state: GameState) => void;

export function createStore() {
  let state: GameState = createInitialGameState();
  const listeners = new Set<Listener>();

  function notify() { 
    // Optimized listener notification (for loop is faster than forEach for small sets)
    for (const listener of listeners) {
      listener(state);
    }
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    listener(state);
    return () => listeners.delete(listener);
  }

  function getState() { return state; }

  function setState(next: GameState) {
    state = next;
    notify();
  }

  function newHand() {
    // Check for bust-out conditions before starting new hand
    let newState = checkBustOutConditions(state);
    if (newState.phase === 'GameOver') {
      setState(newState);
      return;
    }
    
    newState = beginNewHand(newState);
    // Reset showdown processed flag
    newState.showdownProcessed = false;
    setState(newState);
    maybeRunBots();
  }

  function startGame() {
    setState(beginNewHand(state));
    maybeRunBots();
  }

  function endTurn() { setState(endTurnAdvance(state)); }
  function devFlop() { setState(revealFlop(state)); }
  function devTurn() { setState(revealTurn(state)); }
  function devRiver() { setState(revealRiver(state)); }

  function dispatchAction(action: 'Fold' | 'Check' | 'Call' | 'Bet' | 'Raise', amount?: number) {
    const s = getState();
    if (!s.round) {
      console.warn('🤖 dispatchAction called but no round in progress');
      return;
    }
    const seatIndex = s.round.currentTurnSeatIndex;
    console.log(`🎯 Human action: ${action} by seat ${seatIndex}`);
    const legal = computeLegalActions(s, seatIndex);
    console.log(`🎯 Legal actions for human:`, Array.from(legal));
    if (!legal.has(action as any)) {
      console.warn(`🎯 Illegal human action: ${action}, legal:`, Array.from(legal));
      soundEngine.playError();
      setState({ ...s, devLog: [`⚠️ Invalid move: ${action} not allowed right now`, ...s.devLog].slice(0, 50) });
      return;
    }

    if (action === 'Fold' || action === 'Check' || action === 'Call') {
      // Play appropriate sound for action
      if (action === 'Fold') soundEngine.playFold();
      else if (action === 'Check') soundEngine.playCheck();
      else if (action === 'Call') soundEngine.playCall();

      let next = applyPlayerAction(s, { type: action as any, seatIndex });
      let actionText: string = action;
      if (action === 'Fold') actionText = 'folded';
      else if (action === 'Check') actionText = 'checked';
      else if (action === 'Call') actionText = 'called';
      
      // Check if player went all-in during the call
      const humanPlayer = Object.values(next.players).find(p => p.seatIndex === 0);
      const wentAllIn = humanPlayer?.isAllIn && !s.players[humanPlayer.id]?.isAllIn;
      if (wentAllIn && action === 'Call') {
        actionText = 'called all in';
      }
      
      // Add both dev and regular messages
      next = { ...next, devLog: [
        `🎯 You ${actionText}`, // Dev message
        `You ${actionText}`, // Regular message
        ...next.devLog
      ].slice(0, 50) };
      next = tryCompleteStreet(next);
      setState(next);
      
      // If human went all-in, force progression since they can't act anymore
      const humanPlayerAfter = Object.values(next.players).find(p => p.seatIndex === 0);
      if (humanPlayerAfter?.isAllIn && next.round) {
        setTimeout(() => maybeRunBots(), 100);
      } else {
        maybeRunBots();
      }
    } else if (action === 'Bet' || action === 'Raise') {
      const baseAmount = amount || s.bigBlind * 2;
      const humanPlayer = Object.values(s.players).find(p => p.seatIndex === 0);
      
      if (!humanPlayer) return;
      
      soundEngine.playBet();
      setTimeout(() => soundEngine.playChips(), 100);
      
      let next = applyPlayerAction(s, { type: action as any, seatIndex, amount: baseAmount });
      const wentAllIn = next.players[humanPlayer.id]?.isAllIn;
      const actionText = wentAllIn ? `went all in ($${humanPlayer.chips})` : `${action.toLowerCase()} $${baseAmount}`;
      
      next = { ...next, devLog: [
        `🎯 You ${actionText}`,
        `You ${actionText}`,
        ...next.devLog
      ].slice(0, 50) };
      
      next = tryCompleteStreet(next);
      // Check for bust-out conditions after betting action
      next = checkBustOutConditions(next);
      setState(next);
      
      setTimeout(() => maybeRunBots(), 100);
    }
  }

  function maybeRunBots() {
    // Coordinated bot processing using timer manager
    GameTimers.scheduleBotProcessing(() => {
      const s = getState();
      
      // Safety check
      if (!s.round || s.phase === 'Showdown' || s.phase === 'GameOver' || s.phase === 'Idle') {
        console.log('🤖 Bot processing stopped - phase:', s.phase);
        return;
      }
      
      // If it's human turn or no one to act, stop
      if (s.round.currentTurnSeatIndex === 0 || s.round.toActQueue.length === 0) {
        console.log('🤖 Bot processing stopped - human turn or empty queue:', {
          currentTurn: s.round.currentTurnSeatIndex,
          queueLength: s.round.toActQueue.length
        });
        return;
      }
      
      // Process one bot action at a time
      const currentBot = Object.values(s.players).find(p => p.seatIndex === s.round.currentTurnSeatIndex);
      if (!currentBot) {
        console.log('🤖 No bot found for seat', s.round.currentTurnSeatIndex, '- completing street');
        setState(tryCompleteStreet(s));
        return;
      }
      
      console.log(`🤖 Processing bot: ${currentBot.name} (seat ${s.round.currentTurnSeatIndex})`);
      
      // Check if bot can act
      if (currentBot.isFolded || currentBot.isBustedOut || currentBot.isAllIn || currentBot.chips <= 0) {
        console.log(`🤖 Bot ${currentBot.name} cannot act:`, {
          isFolded: currentBot.isFolded,
          isBustedOut: currentBot.isBustedOut,
          isAllIn: currentBot.isAllIn,
          chips: currentBot.chips
        });
        setState(tryCompleteStreet(s));
        return;
      }
      
      // Get legal actions
      const legalActions = computeLegalActions(s, s.round.currentTurnSeatIndex);
      if (legalActions.size === 0) {
        console.log(`🤖 Bot ${currentBot.name} has no legal actions`);
        setState(tryCompleteStreet(s));
        return;
      }
      
      console.log(`🤖 Bot ${currentBot.name} legal actions:`, Array.from(legalActions));
      
      // Detect stuck bot (same bot making same decision repeatedly)
      const currentAction = { seat: s.round.currentTurnSeatIndex, action: 'pending', timestamp: Date.now() };
      let isStuckBot = false;
      
      // Make bot decision with safety valve
      let decision: BotDecision;
      if (s.round && s.round.raisesThisStreet >= 3) {
        decision = legalActions.has('Call') ? 'Call' : 'Fold';
        console.log(`🤖 Safety valve activated for ${currentBot.name}: ${decision}`);
      } else {
        decision = decideAction(s, s.round.currentTurnSeatIndex);
        console.log(`🤖 ${currentBot.name} decided: ${decision}`);
      }
      
      // Validate decision is legal
      if (!legalActions.has(decision)) {
        console.warn(`🤖 ${currentBot.name} made illegal decision ${decision}, legal actions:`, Array.from(legalActions));
        decision = legalActions.has('Check') ? 'Check' : legalActions.has('Call') ? 'Call' : 'Fold';
        console.log(`🤖 Corrected to: ${decision}`);
      }
      
      // Check if this is the same action as before (stuck bot detection)
      if (typeof window !== 'undefined' && (window as any).lastBotAction) {
        const last = (window as any).lastBotAction;
        if (last.seat === currentAction.seat && last.action === decision && 
            currentAction.timestamp - last.timestamp < 2000) {
          console.log(`🚨 STUCK BOT DETECTED: ${currentBot.name} attempting ${decision} again within 2s`);
          isStuckBot = true;
          // Choose the safest legal action to break the loop
          decision = legalActions.has('Check') ? 'Check' : legalActions.has('Fold') ? 'Fold' : 'Call';
          console.log(`🛑 Stuck bot failsafe: forcing ${decision} to break loop`);
        }
      }
      
      // Store this action for next comparison
      if (typeof window !== 'undefined') {
        (window as any).lastBotAction = { ...currentAction, action: decision };
      }
      
      if (!legalActions.has(decision)) {
        console.error(`❌ Illegal decision ${decision}, folding instead`);
        const next = applyPlayerAction(s, { type: 'Fold', seatIndex: s.round.currentTurnSeatIndex });
        setState({ ...next, devLog: [`${currentBot.name} folded`, ...next.devLog].slice(0, 50) });
      } else {
        // Apply bot action
        let next;
        if (decision === 'Bet' || decision === 'Raise') {
          const amount = Math.min(currentBot.chips, s.bigBlind * 2);
          console.log(`🤖 Applying ${decision} for ${currentBot.name} with amount $${amount}`);
          next = applyPlayerAction(s, { type: decision as any, seatIndex: s.round.currentTurnSeatIndex, amount });
        } else {
          console.log(`🤖 Applying ${decision} for ${currentBot.name}`);
          next = applyPlayerAction(s, { type: decision as any, seatIndex: s.round.currentTurnSeatIndex });
        }
        
        console.log(`🤖 Action applied. New turn seat: ${next.round?.currentTurnSeatIndex}, queue length: ${next.round?.toActQueue.length}`);
        lastBotProcessTime = Date.now(); // Update timer
        
        // Play sounds
        if (decision === 'Fold') soundEngine.playFold();
        else if (decision === 'Check') soundEngine.playCheck();
        else if (decision === 'Call') soundEngine.playCall();
        else if (decision === 'Bet' || decision === 'Raise') {
          soundEngine.playBet();
          setTimeout(() => soundEngine.playChips(), 100);
        }
        
        // Add log message
        const actionText = decision === 'Fold' ? 'folded' : 
                          decision === 'Check' ? 'checked' : 
                          decision === 'Call' ? 'called' : 
                          `${decision.toLowerCase()}`;
        
        next = { ...next, devLog: [`${currentBot.name} ${actionText}`, ...next.devLog].slice(0, 50) };
        
        // Try to complete street
        next = tryCompleteStreet(next);
        // Check for bust-out conditions after bot action
        next = checkBustOutConditions(next);
        setState(next);
      }
      
      // Continue processing bots after a short delay
      setTimeout(() => maybeRunBots(), 750);
      
    }, 300);
  }
  
  // Additional failsafe - force bot action if stuck for too long
  let lastBotProcessTime = Date.now();
  let stuckBotFailsafe: any = null;
  
  function checkForStuckBots() {
    const s = getState();
    if (!s.round || s.phase === 'Showdown' || s.phase === 'GameOver' || s.phase === 'Idle') {
      return;
    }
    
    // If it's been too long and it's still a bot's turn, force an action
    if (s.round.currentTurnSeatIndex > 0 && Date.now() - lastBotProcessTime > 5000) {
      console.warn('🚨 STUCK BOT DETECTED - forcing action after 5 seconds');
      const currentBot = Object.values(s.players).find(p => p.seatIndex === s.round.currentTurnSeatIndex);
      if (currentBot && !currentBot.isFolded && !currentBot.isAllIn) {
        console.log(`🚨 Force folding stuck bot: ${currentBot.name}`);
        const next = applyPlayerAction(s, { type: 'Fold', seatIndex: s.round.currentTurnSeatIndex });
        setState({ ...next, devLog: [`${currentBot.name} folded (stuck)`, ...next.devLog].slice(0, 50) });
        lastBotProcessTime = Date.now();
      }
    }
  }
  
  // Check for stuck bots every 2 seconds
  setInterval(checkForStuckBots, 2000);

  function resetTournament() {
    console.log('🔄 Starting tournament reset...');
    
    // Reset all players and then start a new hand
    let resetState = resetBustedPlayers(state);
    console.log('🔄 After resetBustedPlayers, phase:', resetState.phase);
    
    resetState = beginNewHand(resetState);
    console.log('🔄 After beginNewHand, phase:', resetState.phase);
    console.log('🔄 Players after reset:', Object.values(resetState.players).map(p => ({ name: p.name, chips: p.chips, busted: p.isBustedOut })));
    
    resetState.showdownProcessed = false;
    setState(resetState);
    soundEngine.playNewHand();
    
    console.log('🔄 Final state set, calling maybeRunBots...');
    maybeRunBots();
  }

  return { 
    subscribe, 
    getState, 
    setState, 
    newHand, 
    startGame, 
    dispatchAction,
    resetTournament,
  };
}
