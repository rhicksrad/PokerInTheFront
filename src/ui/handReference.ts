import { cardSVG } from './svg/cards';
import { Rank, type Card, type Suit } from '../game/types';

export function renderHandReference(): string {
  return `
    <div class="hand-reference">
      <div class="hand-reference-header" onclick="toggleHandReference()">
        <h4>Poker Hand Rankings</h4>
        <span class="toggle-icon">▼</span>
      </div>
      <div class="hand-rankings" id="hand-rankings-content">
        ${getHandRankingHTML(1, 'Royal Flush', [
          { rank: Rank.Ace, suit: 'S', id: 'AS' },
          { rank: Rank.King, suit: 'S', id: 'KS' },
          { rank: Rank.Queen, suit: 'S', id: 'QS' },
          { rank: Rank.Jack, suit: 'S', id: 'JS' },
          { rank: Rank.Ten, suit: 'S', id: 'TS' }
        ])}
        
        ${getHandRankingHTML(2, 'Straight Flush', [
          { rank: Rank.Nine, suit: 'H', id: '9H' },
          { rank: Rank.Eight, suit: 'H', id: '8H' },
          { rank: Rank.Seven, suit: 'H', id: '7H' },
          { rank: Rank.Six, suit: 'H', id: '6H' },
          { rank: Rank.Five, suit: 'H', id: '5H' }
        ])}
        
        ${getHandRankingHTML(3, 'Four of a Kind', [
          { rank: Rank.King, suit: 'C', id: 'KC' },
          { rank: Rank.King, suit: 'D', id: 'KD' },
          { rank: Rank.King, suit: 'H', id: 'KH' },
          { rank: Rank.King, suit: 'S', id: 'KS' },
          { rank: Rank.Three, suit: 'C', id: '3C' }
        ])}
        
        ${getHandRankingHTML(4, 'Full House', [
          { rank: Rank.Ace, suit: 'C', id: 'AC' },
          { rank: Rank.Ace, suit: 'D', id: 'AD' },
          { rank: Rank.Ace, suit: 'H', id: 'AH' },
          { rank: Rank.Seven, suit: 'S', id: '7S' },
          { rank: Rank.Seven, suit: 'C', id: '7C' }
        ])}
        
        ${getHandRankingHTML(5, 'Flush', [
          { rank: Rank.King, suit: 'D', id: 'KD' },
          { rank: Rank.Nine, suit: 'D', id: '9D' },
          { rank: Rank.Seven, suit: 'D', id: '7D' },
          { rank: Rank.Four, suit: 'D', id: '4D' },
          { rank: Rank.Two, suit: 'D', id: '2D' }
        ])}
        
        ${getHandRankingHTML(6, 'Straight', [
          { rank: Rank.Jack, suit: 'C', id: 'JC' },
          { rank: Rank.Ten, suit: 'H', id: 'TH' },
          { rank: Rank.Nine, suit: 'S', id: '9S' },
          { rank: Rank.Eight, suit: 'D', id: '8D' },
          { rank: Rank.Seven, suit: 'C', id: '7C' }
        ])}
        
        ${getHandRankingHTML(7, 'Three of a Kind', [
          { rank: Rank.Queen, suit: 'C', id: 'QC' },
          { rank: Rank.Queen, suit: 'D', id: 'QD' },
          { rank: Rank.Queen, suit: 'H', id: 'QH' },
          { rank: Rank.Eight, suit: 'S', id: '8S' },
          { rank: Rank.Four, suit: 'C', id: '4C' }
        ])}
        
        ${getHandRankingHTML(8, 'Two Pair', [
          { rank: Rank.Ace, suit: 'C', id: 'AC' },
          { rank: Rank.Ace, suit: 'D', id: 'AD' },
          { rank: Rank.Eight, suit: 'H', id: '8H' },
          { rank: Rank.Eight, suit: 'S', id: '8S' },
          { rank: Rank.Five, suit: 'C', id: '5C' }
        ])}
        
        ${getHandRankingHTML(9, 'One Pair', [
          { rank: Rank.Jack, suit: 'H', id: 'JH' },
          { rank: Rank.Jack, suit: 'S', id: 'JS' },
          { rank: Rank.Nine, suit: 'C', id: '9C' },
          { rank: Rank.Five, suit: 'D', id: '5D' },
          { rank: Rank.Two, suit: 'H', id: '2H' }
        ])}
        
        ${getHandRankingHTML(10, 'High Card', [
          { rank: Rank.Ace, suit: 'S', id: 'AS' },
          { rank: Rank.King, suit: 'H', id: 'KH' },
          { rank: Rank.Eight, suit: 'C', id: '8C' },
          { rank: Rank.Six, suit: 'D', id: '6D' },
          { rank: Rank.Two, suit: 'S', id: '2S' }
        ])}
      </div>
    </div>
  `;
}

// Global function to toggle hand reference visibility
(window as any).toggleHandReference = function() {
  const content = document.getElementById('hand-rankings-content');
  const icon = document.querySelector('.hand-reference .toggle-icon');
  
  if (content && icon) {
    const isCollapsed = content.style.display === 'none';
    
    if (isCollapsed) {
      content.style.display = 'flex';
      icon.textContent = '▼';
      // Save state to localStorage
      localStorage.setItem('hand-reference-collapsed', 'false');
    } else {
      content.style.display = 'none';
      icon.textContent = '▶';
      // Save state to localStorage
      localStorage.setItem('hand-reference-collapsed', 'true');
    }
  }
};

// Initialize collapsed state from localStorage
export function initHandReferenceState(): void {
  const isCollapsed = localStorage.getItem('hand-reference-collapsed') === 'true';
  const content = document.getElementById('hand-rankings-content');
  const icon = document.querySelector('.hand-reference .toggle-icon');
  
  if (content && icon && isCollapsed) {
    content.style.display = 'none';
    icon.textContent = '▶';
  }
}

function getHandRankingHTML(rank: number, name: string, cards: Card[]): string {
  const cardElements = cards.map(card => 
    cardSVG(card, 24, 34)
  ).join('');
  
  return `
    <div class="hand-rank-item">
      <div class="rank-number">${rank}</div>
      <div class="rank-info">
        <div class="rank-name">${name}</div>
        <div class="rank-cards">
          ${cardElements}
        </div>
      </div>
    </div>
  `;
}
