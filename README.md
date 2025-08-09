# 🎰 Poker in the Front

A fully-featured Texas Hold'em poker game with a 1860s Western theme, built with TypeScript and vanilla JavaScript.

## 🎮 Features

- **Authentic Texas Hold'em gameplay** with proper poker rules
- **Smart AI opponents** with distinct personalities and realistic decision-making
- **1860s Western theme** with custom SVG avatars and saloon atmosphere
- **Real-time hand analysis** showing current hand strength and win probabilities
- **Auto-fold feature** for weak hands with customizable thresholds
- **Tournament mode** with bust-out detection and restart functionality
- **Responsive design** that scales to different screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/PokerInTheFront.git
   cd PokerInTheFront
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Select your character** from the Western-themed avatars
2. **Make your moves** - Check, Call, Raise, Fold, or go All-In
3. **Watch the AI** make realistic decisions based on hand strength and position
4. **Win the tournament** by being the last player standing!

## 🧠 AI Opponents

- **Silas "Smoky" McGraw** - Cautious and calculating
- **Martha "Dead-Eye" Jensen** - Aggressive sharpshooter  
- **Samuel "The Banker" Whitmore** - Balanced risk-taker

Each AI has unique personality traits affecting their:
- Aggression level
- Hand selection tightness  
- Bluffing frequency
- Position awareness

## 🎨 Technical Features

- **Truly random card dealing** using seedable PRNG
- **Advanced hand evaluation** with proper 7-card poker logic
- **Efficient state management** with reactive UI updates
- **Performance optimized** with minimal re-renders
- **Memory leak prevention** with coordinated timer management

## 🛠️ Built With

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Vanilla JS** - No heavy frameworks, pure performance
- **CSS Grid & Flexbox** - Responsive layout system
- **SVG Graphics** - Scalable Western-themed artwork

## 📁 Project Structure

```
src/
├── game/           # Core game logic
│   ├── types.ts    # Game state interfaces
│   ├── state.ts    # Game state management
│   ├── betting.ts  # Betting actions and validation
│   ├── evaluator.ts # Poker hand evaluation
│   └── ...
├── ui/             # User interface
│   ├── render.ts   # Main UI rendering
│   ├── svg/        # SVG graphics and avatars
│   └── ...
├── bots/           # AI opponent logic
└── main.ts         # Application entry point
```

## 🎰 Game Rules

Standard Texas Hold'em rules apply:
- Each player gets 2 hole cards
- 5 community cards (flop, turn, river)
- Best 5-card poker hand wins
- Betting rounds: pre-flop, flop, turn, river
- Standard hand rankings (high card to royal flush)

## 🤝 Contributing

Feel free to open issues or submit pull requests to improve the game!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ and lots of coffee during a 10-hour coding session!** ☕