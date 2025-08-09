// Simple sound effects using Web Audio API
// All sounds are procedurally generated to avoid external dependencies

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled = true;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudio();
  }

  private initAudio() {
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      // Don't create context immediately - wait for user interaction
      document.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
      }, { once: true });
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined' && 'AudioContext' in window) {
      try {
        this.audioContext = new AudioContext();
      } catch (e) {
        console.log('Audio not available');
        return null;
      }
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(frequency: number, duration: number, volume = 0.1, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.type = type;

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silently fail if audio doesn't work
    }
  }

  // Card dealing sound - soft whoosh
  playCardDeal() {
    this.playTone(150, 0.15, 0.05, 'triangle');
    setTimeout(() => this.playTone(120, 0.1, 0.03, 'triangle'), 50);
  }

  // Card flip sound - quick click
  playCardFlip() {
    this.playTone(800, 0.05, 0.08, 'square');
    setTimeout(() => this.playTone(600, 0.05, 0.05, 'square'), 20);
  }

  // Chip/money sound - gentle clink
  playChips() {
    this.playTone(440, 0.1, 0.06, 'triangle');
    setTimeout(() => this.playTone(660, 0.08, 0.04, 'triangle'), 30);
  }

  // Button click - soft pop
  playClick() {
    this.playTone(300, 0.05, 0.04, 'square');
  }

  // Fold sound - descending tone
  playFold() {
    this.playTone(220, 0.2, 0.04, 'sine');
    setTimeout(() => this.playTone(180, 0.15, 0.03, 'sine'), 80);
  }

  // Check sound - neutral beep
  playCheck() {
    this.playTone(400, 0.08, 0.05, 'triangle');
  }

  // Call sound - confident tone
  playCall() {
    this.playTone(500, 0.12, 0.06, 'triangle');
  }

  // Bet/Raise sound - rising tone
  playBet() {
    this.playTone(350, 0.08, 0.06, 'square');
    setTimeout(() => this.playTone(450, 0.1, 0.05, 'square'), 60);
  }

  // Win sound - happy ascending tones
  playWin() {
    this.playTone(523, 0.15, 0.08, 'triangle'); // C
    setTimeout(() => this.playTone(659, 0.15, 0.07, 'triangle'), 100); // E
    setTimeout(() => this.playTone(784, 0.2, 0.06, 'triangle'), 200); // G
  }

  // Showdown sound - dramatic chord
  playShowdown() {
    this.playTone(262, 0.3, 0.05, 'triangle'); // C
    this.playTone(330, 0.3, 0.04, 'triangle'); // E
    this.playTone(392, 0.3, 0.04, 'triangle'); // G
  }

  // New hand sound - fresh start
  playNewHand() {
    this.playTone(200, 0.1, 0.06, 'sine');
    setTimeout(() => this.playTone(250, 0.1, 0.05, 'sine'), 80);
    setTimeout(() => this.playTone(300, 0.12, 0.04, 'sine'), 160);
  }

  // Error sound - gentle warning
  playError() {
    this.playTone(150, 0.1, 0.06, 'sawtooth');
    setTimeout(() => this.playTone(120, 0.15, 0.04, 'sawtooth'), 80);
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();
