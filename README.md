# 🌌 Cosmic Sudoku - Stellar Calculus

> *"Space is not emptiness — it is a system of invisible forces made visible through their effects."*

A revolutionary Sudoku experience that transforms classic puzzle-solving into an immersive cosmic journey. Built with cutting-edge web technologies and designed with Material Reality principles.

## ✨ Why Cosmic Sudoku?

### 🎨 **6 Material Reality Skins**
Each skin is not just a theme — it's a distinct material reality with unique visual physics:

- **Classic** (Free) - The original Stellar Calculus aesthetic
- **Nebula Dream** (500 coins) - Diffuse cosmic clouds with radial gradients and soft luminescence
- **Aurora Borealis** (750 coins) - Liquid iridescent waves with shifting horizontal bands
- **Black Hole** (1000 coins) - Dense gravitational warping with event horizon distortion
- **Quantum Grid** (1500 coins) - Crystalline interference patterns with green phosphor glow
- **Supernova Burst** (2000 coins) - Explosive stellar energy with sharp rays and violent light
- **Void Ceremony** (2500 coins) - Ceremonial silence with hairline grids on absolute darkness

Each skin features:
- **Unique visual effects** - Animated particles, rays, distortions, and atmospheric overlays
- **Dynamic error feedback** - Void skin inverts colors on mistakes, creating a dramatic visual response
- **Rarity-based intensity** - Common, Rare, Epic, and Legendary skins with escalating visual complexity
- **Performance-optimized** - Smooth 60fps animations using Framer Motion and GPU acceleration

### 🎮 **Advanced Gameplay Features**

- **4 Difficulty Levels** - Easy, Medium, Hard, Expert with progressively complex puzzles
- **Smart Mistake System** - 3 lives per game with visual feedback on errors
- **Notes Mode** - Toggle between number placement and note-taking (press N)
- **Intelligent Hints** - AI-powered hints with time penalty (5 minutes per hint)
- **Conflict Detection** - Real-time highlighting of invalid moves
- **Auto-completion** - Number buttons hide when all 9 instances are placed
- **Keyboard Navigation** - Full arrow key support and number input
- **Victory/Defeat Screens** - Cinematic end-game experiences with detailed statistics

### 🧠 **AI Coach Integration**

- **Real-time Strategy Tips** - Context-aware suggestions based on your current game state
- **Adaptive Difficulty** - Learns from your play style and adjusts recommendations
- **Technique Tutorials** - Teaches advanced Sudoku solving strategies
- **Performance Analysis** - Tracks your progress and identifies areas for improvement

### 💰 **Sophisticated Economy System**

Earn Cosmic Coins through skill and strategy:

**Base Rewards:**
- Easy: 50 coins
- Medium: 100 coins
- Hard: 200 coins
- Expert: 400 coins

**Performance Bonuses:**
- **Time Bonus**: Up to +100 coins for fast completion
- **Perfect Bonus**: Double base reward for zero mistakes and hints
- **Leaderboard Bonus**: 
  - 🥇 1st Place: +500 coins
  - 🥈 2nd Place: +300 coins
  - 🥉 3rd Place: +200 coins
  - Top 10: +100 coins

**Penalties:**
- Mistakes: -10 coins each
- Hints: -20 coins each

### 🏆 **Global Leaderboard System**

- **Real-time Rankings** - Compete with players worldwide
- **Difficulty-based Boards** - Separate leaderboards for each difficulty level
- **Performance Metrics** - Ranked by solve time, mistakes, and hints used
- **Authenticated Scores** - Secure score validation prevents cheating
- **Guest Mode** - Play without account, but no leaderboard access

### 🎭 **Immersive Visual Design**

- **Tension VFX** - Dynamic visual effects that respond to game pressure
- **Cosmic Backgrounds** - Animated space environments with parallax effects
- **Stellar Typography** - Custom font system (Tektur, Jura, JetBrains Mono)
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Golden Ratio Layout** - UI spacing based on φ (1.618) for visual harmony
- **Smooth Animations** - Framer Motion powers all transitions and interactions

### 🔒 **Enterprise-Grade Security**

- **Row Level Security (RLS)** - Database-level access control on all tables
- **Server-side Validation** - Game completion verified on backend
- **Anti-cheat Protection** - Prevents score manipulation and coin exploits
- **Secure Authentication** - Supabase Auth with email/password
- **Encrypted Transactions** - All currency operations use secure database functions
- **Input Sanitization** - Protection against injection attacks

### ⚡ **Performance Optimized**

- **Next.js 14 App Router** - Server components and streaming for instant loads
- **Zustand State Management** - Minimal re-renders and optimal performance
- **Lazy Loading** - Components load on-demand
- **Image Optimization** - Automatic WebP conversion and responsive images
- **Code Splitting** - Reduced bundle size for faster initial load
- **Edge Runtime** - Deploy globally for low latency

### 📊 **Statistics & Progress Tracking**

- **Game History** - View all completed games with detailed stats
- **Personal Records** - Track your best times for each difficulty
- **Achievement System** - Unlock badges for milestones
- **Win Rate Analytics** - Monitor your improvement over time
- **Coin Balance** - Real-time currency tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with custom design system
- **Fonts**: Google Fonts (Tektur, Jura, JetBrains Mono)
- **Deployment**: Vercel (recommended)

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/yourusername/cosmic-sudoku.git
cd cosmic-sudoku
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**:

Run the migration files in order:
```bash
# In Supabase SQL Editor, run these files:
supabase/migrations/00_complete_setup.sql
supabase/migrations/01_add_missing_profile_fields.sql
supabase/migrations/02_fix_profiles_table.sql
supabase/migrations/03_recreate_profiles_table.sql
supabase/migrations/04_auto_create_profiles.sql
```

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

## 🎮 How to Play

1. **Start a Game** - Click "Play" on the main menu
2. **Select Difficulty** - Choose from Easy, Medium, Hard, or Expert
3. **Solve the Puzzle** - Fill empty cells with numbers 1-9
4. **Use Notes Mode** - Press 'N' to toggle between numbers and notes
5. **Get Hints** - Click the hint button if stuck (costs time penalty)
6. **Complete the Game** - Earn coins based on performance
7. **Buy Skins** - Visit the shop to unlock new visual themes
8. **Compete** - Check the leaderboard to see your global ranking

### Keyboard Shortcuts

- **1-9**: Enter number in selected cell
- **0/Backspace/Delete**: Clear selected cell
- **N**: Toggle notes mode
- **Arrow Keys**: Navigate between cells
- **Escape**: Deselect cell

## 🗄️ Database Schema

### Core Tables

- **profiles** - User profiles with coins, skins, and stats
- **games** - Game history with scores and performance metrics
- **leaderboard** - Global rankings by difficulty
- **user_skins** - Purchased skins inventory

### Security

All tables use Row Level Security (RLS) policies:
- Users can only read/write their own data
- Leaderboard is publicly readable
- Admin operations require service role

## 📁 Project Structure

```
cosmic-sudoku/
├── app/
│   ├── page.tsx                    # Main menu
│   ├── game/page.tsx               # Game page
│   ├── shop/page.tsx               # Skins shop
│   ├── stats/page.tsx              # Statistics page
│   ├── login/page.tsx              # Login page
│   ├── signup/page.tsx             # Signup page
│   └── api/
│       ├── validate/route.ts       # Server-side validation
│       └── leaderboard/route.ts    # Leaderboard API
├── components/
│   ├── game/
│   │   ├── sudoku-grid.tsx         # Main game grid
│   │   ├── sudoku-cell.tsx         # Individual cell
│   │   ├── game-timer.tsx          # Timer component
│   │   ├── game-controls.tsx       # Control buttons
│   │   ├── ai-coach.tsx            # AI coaching system
│   │   ├── difficulty-selector.tsx # Difficulty selection
│   │   ├── victory-screen.tsx      # Win screen
│   │   ├── defeat-screen.tsx       # Loss screen
│   │   ├── skin-effects.tsx        # Visual effects
│   │   ├── tension-vfx.tsx         # Tension effects
│   │   └── cosmic-background.tsx   # Background animations
│   ├── skins/
│   │   └── skin-provider.tsx       # Skin context provider
│   └── error-boundary.tsx          # Error handling
├── lib/
│   ├── sudoku/
│   │   └── generator.ts            # Puzzle generation
│   ├── validation/
│   │   └── sudoku-validator.ts     # Validation logic
│   ├── leaderboard/
│   │   └── leaderboard-utils.ts    # Leaderboard utilities
│   ├── skins/
│   │   └── material-skins.ts       # Skin definitions
│   └── store/
│       ├── game-store.ts           # Game state (Zustand)
│       └── user-store.ts           # User state (Zustand)
├── supabase/
│   └── migrations/                 # Database migrations
├── types/
│   └── sudoku.ts                   # TypeScript types
└── public/                         # Static assets
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Import to Vercel**:
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your repository
- Add environment variables
- Deploy

3. **Configure Environment Variables**:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Alternative: Manual Deployment

```bash
npm run build
npm start
```

## 🎨 Customization

### Adding New Skins

1. Edit `lib/skins/material-skins.ts`:
```typescript
{
  id: 'your-skin',
  name: 'Your Skin Name',
  description: 'Description of visual physics',
  price: 1000,
  rarity: 'epic',
  background: { /* colors */ },
  grid: { /* styles */ },
  numbers: { /* colors */ },
  effects: { /* animation config */ }
}
```

2. Add visual effects in `components/game/skin-effects.tsx`

### Modifying Difficulty

Edit `lib/sudoku/generator.ts` to adjust:
- Number of clues (empty cells)
- Puzzle complexity algorithms
- Time limits

### Customizing Economy

Adjust coin rewards in `app/game/page.tsx`:
```typescript
const baseCoins = {
  easy: 50,
  medium: 100,
  hard: 200,
  expert: 400,
};
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Supabase connection failed"
- **Solution**: Check `.env.local` has correct credentials
- Verify Supabase project is active

**Issue**: "Coins not updating"
- **Solution**: Check RLS policies in Supabase dashboard
- Ensure user is authenticated

**Issue**: "Skins not loading"
- **Solution**: Clear browser cache
- Check `user_skins` table has correct data

**Issue**: "Leaderboard empty"
- **Solution**: Complete at least one game while logged in
- Check `leaderboard` table permissions

## 🔮 Roadmap

### Coming Soon
- [ ] Real-time multiplayer duels
- [ ] Daily challenges with special rewards
- [ ] Achievement notifications
- [ ] Social features (friends, challenges)
- [ ] Mobile app (React Native)
- [ ] Puzzle editor for custom games
- [ ] Tournament mode
- [ ] Seasonal events

### In Progress
- [x] AI Coach system
- [x] Global leaderboards
- [x] Material Reality skins
- [x] Advanced statistics

## 📄 License

MIT License - Free to use for personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **Design Philosophy**: Inspired by Material Reality principles
- **Sudoku Algorithm**: Based on backtracking and constraint propagation
- **Visual Design**: Influenced by cosmic aesthetics and golden ratio
- **Typography**: Google Fonts (Tektur, Jura, JetBrains Mono)

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/cosmic-sudoku/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cosmic-sudoku/discussions)
- **Email**: support@cosmicsudoku.com

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**

🌟 **Star this repo if you enjoy the game!**

*"Each cell is a celestial coordinate in the infinite system"*
