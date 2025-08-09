// Centralized timer management to eliminate timeout chaos
// Replaces 15+ scattered setTimeout calls with a coordinated system

type TimerCallback = () => void;
type TimerId = string;

interface Timer {
  id: TimerId;
  timeoutId: number;
  callback: TimerCallback;
  delay: number;
  created: number;
}

class TimerManager {
  private timers = new Map<TimerId, Timer>();
  
  /**
   * Create a managed timeout that can be tracked and cancelled
   */
  setTimeout(callback: TimerCallback, delay: number, id?: TimerId): TimerId {
    const timerId = id || `timer_${Date.now()}_${Math.random()}`;
    
    // Cancel existing timer with same ID
    this.clearTimeout(timerId);
    
    const timeoutId = window.setTimeout(() => {
      callback();
      this.timers.delete(timerId);
    }, delay);
    
    this.timers.set(timerId, {
      id: timerId,
      timeoutId,
      callback,
      delay,
      created: Date.now()
    });
    
    return timerId;
  }
  
  /**
   * Clear a specific timer
   */
  clearTimeout(id: TimerId): void {
    const timer = this.timers.get(id);
    if (timer) {
      window.clearTimeout(timer.timeoutId);
      this.timers.delete(id);
    }
  }
  
  /**
   * Clear all timers matching a pattern
   */
  clearTimersMatching(pattern: string): void {
    for (const [id, timer] of this.timers) {
      if (id.includes(pattern)) {
        window.clearTimeout(timer.timeoutId);
        this.timers.delete(id);
      }
    }
  }
  
  /**
   * Clear all timers (useful for cleanup)
   */
  clearAll(): void {
    for (const timer of this.timers.values()) {
      window.clearTimeout(timer.timeoutId);
    }
    this.timers.clear();
  }
  
  /**
   * Get active timer count for debugging
   */
  getActiveCount(): number {
    return this.timers.size;
  }
  
  /**
   * Get timer info for debugging
   */
  getTimerInfo(): { id: string; delay: number; age: number }[] {
    const now = Date.now();
    return Array.from(this.timers.values()).map(timer => ({
      id: timer.id,
      delay: timer.delay,
      age: now - timer.created
    }));
  }
}

// Singleton instance for global use
export const timerManager = new TimerManager();

// Convenience functions for common timer patterns
export const GameTimers = {
  BOT_PROCESSING: 'bot_processing',
  AUTO_FOLD: 'auto_fold',
  UI_UPDATE: 'ui_update',
  STUCK_BOT_CHECK: 'stuck_bot_check',
  SOUND_DELAY: 'sound_delay',
  
  // Schedule bot processing with automatic cleanup
  scheduleBotProcessing: (callback: TimerCallback, delay: number = 300) => {
    timerManager.setTimeout(callback, delay, GameTimers.BOT_PROCESSING);
  },
  
  // Schedule auto-fold check
  scheduleAutoFold: (callback: TimerCallback) => {
    timerManager.setTimeout(callback, 100, GameTimers.AUTO_FOLD);
  },
  
  // Schedule UI update
  scheduleUIUpdate: (callback: TimerCallback, delay: number = 100) => {
    timerManager.setTimeout(callback, delay, GameTimers.UI_UPDATE);
  },
  
  // Clear all bot-related timers
  clearBotTimers: () => {
    timerManager.clearTimersMatching('bot');
  },
  
  // Clear all game timers (for cleanup)
  clearAllGameTimers: () => {
    timerManager.clearAll();
  }
};
