# 🛡️ Grid Defender

An epic tower defense game built with React, TypeScript, and Vite. Defend the grid from waves of enemies using strategic tower placement and upgrades!

![Grid Defender](public/icon-512.png)

## 🎮 Features

### Core Gameplay
- **25 Waves of Enemies** - Progressive difficulty from Wave 1 to the final boss at Wave 25
- **Strategic Tower Placement** - Place defenders on a grid to stop enemy invasions
- **Tower Upgrades** - Upgrade your defenders up to level 20 for increased power
- **Multiple Enemy Types** - Face normal, fast, tank, flying, and special enemies
- **Boss Battles** - Epic boss encounters at Waves 7, 10, 15, 20, and 25

### Defenders (Towers)
| Tower | Ability | Unlock |
|-------|---------|--------|
| ⚔️ **Warrior** | Close-range melee damage | Default |
| 🏹 **Archer** | Long-range attacks | Default |
| ⛏️ **Miner** | Generates gold over time | Default |
| 🗿 **Stone Cannon** | Knockback - pushes enemies back 2 tiles | Beat Wave 15 |

### Enemy Types
| Enemy | Special Ability |
|-------|----------------|
| 👾 Normal | Basic enemy |
| 🏃 Fast | 2.2x movement speed |
| 🛡️ Tank | 12x health |
| 🦅 Flying | Takes alternate path |
| 🦹 **Thief** | Steals 1000 gold if escapes |
| 🧚 **Healer** | Heals all enemies +200 HP on spawn |
| 🦇 **Stunner** | Stuns nearby towers for 3s on death |
| 👹 **Boss** | Mini-boss with immunity phases |
| 🦍 **Iron Golem** | Wave 15 boss - extreme HP |
| 🥷 **Assassin** | Wave 20 boss - extreme speed |
| 👿 **Demon Lord** | Wave 25 final boss |

### Progressive Web App (PWA)
- ✅ **Offline Play** - Works completely offline after first visit
- ✅ **Install to Home Screen** - Install like a native app
- ✅ **Auto-Updates** - Service worker handles updates automatically
- ✅ **Mobile Optimized** - Responsive design for all screen sizes

### Game Features
- 🎯 **3 Speed Modes** - 1x, 2x, 3x game speed
- 🏆 **Achievements** - Unlock special achievements for skilled play
- 📱 **Mobile Support** - Touch-friendly controls with drag-and-drop
- 🎨 **Modern UI** - Dark theme with smooth animations
- 🔊 **Audio** - Background music and sound effects
- 💾 **Auto-Save** - Game state persists in browser

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd grid-guard

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:8080`
The game also availabel at `https://grid-guard-game.netlify.app`

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

## 🎯 How to Play

1. **Start the Game** - Click "Start Wave" to begin
2. **Place Defenders** - Click a defender in the shop, then click an empty grid cell
3. **Earn Gold** - Defeat enemies or use Miner towers to generate income
4. **Upgrade** - Click placed defenders to upgrade them for better stats
5. **Survive** - Prevent enemies from reaching the end of the path
6. **Win** - Defeat all 25 waves to achieve victory!

### Tips & Strategy
- 💰 **Use Miners Early** - Generate passive income for late-game upgrades
- 🎯 **Mix Tower Types** - Combine Warriors (melee) and Archers (range) for coverage
- ⚡ **Upgrade Strategically** - Focus upgrades on key chokepoints
- 🗿 **Unlock Stone Cannon** - Beat Wave 15 to unlock the powerful knockback tower
- 🦹 **Watch for Thieves** - Don't let them escape or you'll lose 1000 gold!
- 🧚 **Kill Healers Fast** - They heal all enemies when they spawn

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **PWA**: vite-plugin-pwa + Workbox
- **State Management**: React Hooks
- **Audio**: Web Audio API

## 📁 Project Structure

```
grid-guard/
├── src/
│   ├── components/
│   │   ├── game/          # Game components
│   │   └── ui/            # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   │   ├── useGameLoop.ts # Main game loop
│   │   ├── useGameState.ts # State management
│   │   └── useAudio.ts    # Audio system
│   ├── logic/             # Game logic
│   │   ├── updateLogic.ts # Game tick updates
│   │   └── waveLogic.ts   # Enemy spawning
│   ├── config/            # Game configuration
│   ├── types/             # TypeScript types
│   └── main.tsx           # Entry point
├── public/                # Static assets
└── index.html            # HTML template
```

## 🎨 Customization

### Adjusting Difficulty
Edit `src/config/gameConfig.ts`:
```typescript
export const MAX_WAVE = 25;        // Total waves
export const MAX_PER_TYPE = 10;    // Max towers per type
export const MAX_LEVEL = 20;       // Max upgrade level
```

### Modifying Enemies
Edit enemy stats in `ENEMY_CONFIGS` in `gameConfig.ts`

### Adding New Towers
1. Add type to `DefenderType` in `types/game.ts`
2. Add config to `DEFENDER_CONFIGS` in `gameConfig.ts`
3. Implement special abilities in `updateLogic.ts`

## 📱 PWA Installation

### Desktop
1. Visit the game in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"

### Mobile (iOS)
1. Open in Safari
2. Tap Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Open in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🎮 Play Now!

[Play Grid Defender](https://your-deployment-url.com)

---

Made with ❤️ using React + TypeScript + Vite
