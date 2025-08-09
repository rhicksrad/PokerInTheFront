import type { GameState, HandRankCategory } from './types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats, gameState?: GameState) => boolean;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GameStats {
  handsPlayed: number;
  handsWon: number;
  totalWinnings: number;
  largestPot: number;
  currentStreak: number;
  longestStreak: number;
  handsWonByCategory: Record<HandRankCategory, number>;
  bluffsWon: number; // Won with high card
  allInsWon: number;
  royalFlushes: number;
  straightFlushes: number;
  quads: number;
  fullHouses: number;
  flushes: number;
  straights: number;
  trips: number;
  twoPairs: number;
  pairs: number;
  highCards: number;
}

export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first-hand',
    name: 'First Hand',
    description: 'Play your first hand of poker',
    icon: '🎰',
    condition: (stats) => stats.handsPlayed >= 1,
    unlocked: false
  },
  {
    id: 'big-winner',
    name: 'Big Winner',
    description: 'Win a hand with a pot of $200 or more',
    icon: '💰',
    condition: (stats) => stats.largestPot >= 200,
    unlocked: false
  },
  {
    id: 'royal-flush',
    name: 'Royal Flush',
    description: 'Get a royal flush (A, K, Q, J, 10 suited)',
    icon: '🃏',
    condition: (stats) => stats.royalFlushes >= 1,
    unlocked: false
  },
  {
    id: 'bluffer',
    name: 'Bluffer',
    description: 'Win a hand by bluffing with high card',
    icon: '🎯',
    condition: (stats) => stats.bluffsWon >= 1,
    unlocked: false
  },
  {
    id: 'hot-streak',
    name: 'Hot Streak',
    description: 'Win 5 hands in a row',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 5,
    unlocked: false
  },
  {
    id: 'saloon-regular',
    name: 'Saloon Regular',
    description: 'Play 50 hands total',
    icon: '🤠',
    condition: (stats) => stats.handsPlayed >= 50,
    unlocked: false
  },
  {
    id: 'straight-shooter',
    name: 'Straight Shooter',
    description: 'Win with a straight',
    icon: '🎯',
    condition: (stats) => stats.straights >= 1,
    unlocked: false
  },
  {
    id: 'flush-master',
    name: 'Flush Master',
    description: 'Win with a flush',
    icon: '♠️',
    condition: (stats) => stats.flushes >= 1,
    unlocked: false
  },
  {
    id: 'full-house-hero',
    name: 'Full House Hero',
    description: 'Win with a full house',
    icon: '🏠',
    condition: (stats) => stats.fullHouses >= 1,
    unlocked: false
  },
  {
    id: 'quad-squad',
    name: 'Quad Squad',
    description: 'Win with four of a kind',
    icon: '4️⃣',
    condition: (stats) => stats.quads >= 1,
    unlocked: false
  },
  {
    id: 'all-in-ace',
    name: 'All-In Ace',
    description: 'Win a hand by going all in',
    icon: '🎲',
    condition: (stats) => stats.allInsWon >= 1,
    unlocked: false
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Play 100 hands total',
    icon: '💯',
    condition: (stats) => stats.handsPlayed >= 100,
    unlocked: false
  }
];

class AchievementTracker {
  private stats: GameStats;
  private achievements: Achievement[];

  constructor() {
    this.stats = this.loadStats();
    this.achievements = this.loadAchievements();
  }

  private loadStats(): GameStats {
    const saved = localStorage.getItem('poker-game-stats');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      handsPlayed: 0,
      handsWon: 0,
      totalWinnings: 0,
      largestPot: 0,
      currentStreak: 0,
      longestStreak: 0,
      handsWonByCategory: {
        'StraightFlush': 0,
        'FourKind': 0,
        'FullHouse': 0,
        'Flush': 0,
        'Straight': 0,
        'ThreeKind': 0,
        'TwoPair': 0,
        'OnePair': 0,
        'HighCard': 0
      },
      bluffsWon: 0,
      allInsWon: 0,
      royalFlushes: 0,
      straightFlushes: 0,
      quads: 0,
      fullHouses: 0,
      flushes: 0,
      straights: 0,
      trips: 0,
      twoPairs: 0,
      pairs: 0,
      highCards: 0
    };
  }

  private loadAchievements(): Achievement[] {
    const saved = localStorage.getItem('poker-achievements');
    const achievementData = saved ? JSON.parse(saved) : {};
    
    return ACHIEVEMENT_DEFINITIONS.map(def => ({
      ...def,
      unlocked: achievementData[def.id]?.unlocked || false,
      unlockedAt: achievementData[def.id]?.unlockedAt ? new Date(achievementData[def.id].unlockedAt) : undefined
    }));
  }

  private saveStats(): void {
    localStorage.setItem('poker-game-stats', JSON.stringify(this.stats));
  }

  private saveAchievements(): void {
    const achievementData: Record<string, { unlocked: boolean; unlockedAt?: string }> = {};
    this.achievements.forEach(ach => {
      achievementData[ach.id] = {
        unlocked: ach.unlocked,
        unlockedAt: ach.unlockedAt?.toISOString()
      };
    });
    localStorage.setItem('poker-achievements', JSON.stringify(achievementData));
  }

  public onHandStart(): void {
    this.stats.handsPlayed++;
    this.saveStats();
    this.checkAchievements();
  }

  public onHandWon(winAmount: number, handCategory: HandRankCategory, potSize: number, wasAllIn: boolean, wasBluff: boolean): void {
    this.stats.handsWon++;
    this.stats.totalWinnings += winAmount;
    this.stats.currentStreak++;
    this.stats.longestStreak = Math.max(this.stats.longestStreak, this.stats.currentStreak);
    this.stats.largestPot = Math.max(this.stats.largestPot, potSize);
    
    // Track by hand category
    this.stats.handsWonByCategory[handCategory]++;
    
    // Update specific counters
    switch (handCategory) {
      case 'StraightFlush':
        this.stats.straightFlushes++;
        // Check if it's a royal flush (A, K, Q, J, 10 suited)
        // For now, we'll count all straight flushes as potential royals
        this.stats.royalFlushes++;
        break;
      case 'FourKind':
        this.stats.quads++;
        break;
      case 'FullHouse':
        this.stats.fullHouses++;
        break;
      case 'Flush':
        this.stats.flushes++;
        break;
      case 'Straight':
        this.stats.straights++;
        break;
      case 'ThreeKind':
        this.stats.trips++;
        break;
      case 'TwoPair':
        this.stats.twoPairs++;
        break;
      case 'OnePair':
        this.stats.pairs++;
        break;
      case 'HighCard':
        this.stats.highCards++;
        if (wasBluff) {
          this.stats.bluffsWon++;
        }
        break;
    }

    if (wasAllIn) {
      this.stats.allInsWon++;
    }

    this.saveStats();
    this.checkAchievements();
  }

  public onHandLost(): void {
    this.stats.currentStreak = 0;
    this.saveStats();
  }

  private checkAchievements(): Achievement[] {
    const newlyUnlocked: Achievement[] = [];
    
    this.achievements.forEach(achievement => {
      if (!achievement.unlocked && achievement.condition(this.stats)) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        newlyUnlocked.push(achievement);
      }
    });

    if (newlyUnlocked.length > 0) {
      this.saveAchievements();
    }

    return newlyUnlocked;
  }

  public getStats(): GameStats {
    return { ...this.stats };
  }

  public getAchievements(): Achievement[] {
    return [...this.achievements];
  }

  public getProgress(achievementId: string): number {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return 1;

    // Calculate progress based on achievement type
    switch (achievementId) {
      case 'saloon-regular':
        return Math.min(this.stats.handsPlayed / 50, 1);
      case 'century-club':
        return Math.min(this.stats.handsPlayed / 100, 1);
      case 'hot-streak':
        return Math.min(this.stats.longestStreak / 5, 1);
      case 'big-winner':
        return Math.min(this.stats.largestPot / 200, 1);
      default:
        return 0;
    }
  }
}

export const achievementTracker = new AchievementTracker();
