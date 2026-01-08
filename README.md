# 🛡️ Grid Guard: The Global Guardian (V2.0)

An epic, cinematic tower defense game built with **React 18**, **TypeScript**, and **Vite**. Defend your grid against ever-evolving threats using strategic placement, active magic skills, and global progression.

![Grid Guard Banner](public/icon-512.png)

## 🎮 Version 2.0 Major Features

### 🌍 Multi-Map Support

Battle across different environments, each with unique paths and exclusive defenders:

- **Golem Lair (Easy)**: A winding path through ancient ruins.
- **Freeze Land (Medium)**: A treacherous spiral. Home of the **Ice Cube** defender.
- **Dragon Cave (Hard)**: The ultimate test. Home of the **Fire Tower** defender.

### 🏆 Global Achievement System

Your bravery is tracked across all maps and sessions:

- **11 Unique Challenges**: Unlock achievements like _Midas Touch_, _Economist_, or the secret _G**d Av\*\***r_.
- **Hidden Tasks**: Discover secret requirements to complete your collection.
- **Certificate of Valor**: Generate a personalized, shareable certificate of your progress.
- **Global Persistence**: Achievements save to local storage, persisting even if you switch maps.

### ⚡ Active Skills (Spells)

Turn the tide of battle with powerful manual abilities:

- **☄️ Meteor Strike**: Rain fire on the entire grid. Deals massive damage to EVERY enemy.
- **❄️ Blizzard**: Flash-freeze the battlefield. Stops all enemies in their tracks for 5 seconds.

### 🏹 Defenders (Towers)

| Tower               | Ability                 | Availability      |
| ------------------- | ----------------------- | ----------------- |
| ⚔️ **Warrior**      | High DPS Melee          | All Maps          |
| 🏹 **Archer**       | Long-range Sniper       | All Maps          |
| ⛏️ **Miner**        | Gold generation         | All Maps          |
| 🗿 **Stone Cannon** | Stun & Knockback        | Golem Lair (W16+) |
| 🧊 **Ice Cube**     | Area-of-effect Slow     | Freeze Land       |
| 🔥 **Fire Tower**   | Burn (Slow + Dmg Boost) | Dragon Cave       |

### 👾 Enemy Intelligence

Face a diverse cast of adversaries with unique behaviors and resistances:

| Entity              | Special Ability          | Best Counter              |
| ------------------- | ------------------------ | ------------------------- |
| 🛡️ **Orc Tank**     | High Durability          | Stone Cannon (Pushback)   |
| 🦅 **Flying Units** | Path-Independent Flight  | Archer / Fire Tower       |
| 🧚 **Healer**       | AoE HP Restoration       | Manual Focus / Meteor     |
| 🦹 **Thief**        | Gold Stealing (No Life)  | Warrior (Short-range dps) |
| 🐉 **Dragon**       | Overheat Burst (Death)   | Long-range Snipers        |
| 🤖 **Iron Golem**   | 50% Physical Resistance  | Fire Tower (Magic Burn)   |
| 🎭 **Phantoms**     | High Speed Teleportation | Ice Cube (Freeze Slow)    |
| 👿 **Demon Lord**   | Massive Global Pressure  | Max Level Defense Grid    |

### ♾️ Endless Mode & Boss Rush

- **Endless Mode**: Continue past Wave 25 to see how long your defenses hold. Enemies scale in HP and rewards.
- **Boss Rush (Wave 40)**: Face every boss in the game back-to-back in an ultimate survival test.

## 📱 Premium Features

- **Cinematic Loading**: A high-fidelity splash screen with Pro-Tips and smooth transitions.
- **Target Scan Mode**: One-tap upgrade interaction for fast-paced gameplay.
- **PWA Optimized**: Play offline and install to your home screen.
- **Personalized Sharing**: Enter your name on the certificate and share your score natively via the Web Share API.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/ahmadkhairul/grid-guard.git
cd grid-guard

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:8080`

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Vanilla CSS + Tailwind + Lucide Icons
- **UI Components**: Radix UI (shadcn)
- **State**: Custom Hooks & LocalStorage Persistence
- **Deployment**: Vite + Netlify/Vercel

## 🤝 Support the Developer

If you enjoy the game, consider supporting the continued development of **Grid Guard**:
[☕ Buy me a Coffee](https://ko-fi.com/ahmadkhairul)

---

Made with ❤️ by [Ahmad Khairul](https://ko-fi.com/ahmadkhairul)
