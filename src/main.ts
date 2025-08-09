import './styles/app.css';
import './types';
import { createStore } from './ui/store';
import { renderApp } from './ui/render';
import { renderStartScreen } from './ui/startScreen';
import { PLAYER_CHARACTER_OPTIONS } from './ui/svg/avatars';
import './ui/controls';

const container = document.getElementById('app')!;
let selectedCharacter: string | null = null;

// Show start screen first
console.log('Rendering start screen...');
try {
  renderStartScreen(container, {
    onCharacterSelected: (characterId: string) => {
      console.log('Character selected:', characterId);
      selectedCharacter = characterId;
      // Save selected character to localStorage for avatar persistence
      localStorage.setItem('poker-selected-character', characterId);
      startGame();
    }
  });
  console.log('Start screen rendered successfully');
} catch (error) {
  console.error('Error rendering start screen:', error);
}

export function startGame() {
  console.log('Starting game...');
  try {
    // Clear container and start the actual game
    container.innerHTML = '';
    
    const store = createStore();
    console.log('Store created');
    renderApp(container, store);
    console.log('App rendered');

  // Update player name if character was selected
  if (selectedCharacter && (store as any).getState) {
    const state = (store as any).getState();
    const humanPlayer = Object.values(state.players).find((p: any) => p.seatIndex === 0);
    if (humanPlayer && (store as any).setState) {
      const character = PLAYER_CHARACTER_OPTIONS[selectedCharacter];
      (store as any).setState({
        ...state,
        players: {
          ...state.players,
          [(humanPlayer as any).id]: {
            ...humanPlayer,
            name: character?.name || 'Player'
          }
        }
      });
    }
  }

    // Auto-start a hand
    if ((store as any).startGame) {
      (store as any).startGame();
      console.log('Game started');
    }
  } catch (error) {
    console.error('Error starting game:', error);
  }
}


