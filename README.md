# 🚀 Cosmic Sudoku Mastery

A high-performance Sudoku web platform with space progression theme, AI coaching, and real-time duels.

## ⚠️ IMPORTANT: Path Issue

**The project is currently in a directory with Cyrillic characters (`судоку`) which causes Next.js build errors.**

To fix this, move the project to a path with only ASCII characters:

```bash
# Move the project to a path without Cyrillic characters
cd C:\Users\User\Desktop
move судоку\cosmic-sudoku cosmic-sudoku
cd cosmic-sudoku
npm run build
```

Or create a fresh copy:
```bash
cd C:\Users\User\Desktop
mkdir cosmic-sudoku-game
xcopy судоку\cosmic-sudoku cosmic-sudoku-game /E /I
cd cosmic-sudoku-game
npm install
npm run build
```

## 🌟 Features

- **Space Progression System**: Journey from Earth (Levels 1-10) → Moon → Mars → Interstellar Space (100+)
- **Tension VFX**: Dynamic visual effects when time is running out (screen shake, color shifts, glitch effects)
- **AI Coach**: Get strategic hints powered by Claude 3.5 Sonnet via OpenRouter
- **Real-time Duels**: 1v1 matchmaking with live progress tracking
- **Leaderboards**: Global and city-based rankings
- **Achievement System**: Unlock cosmic themes (Nebula, Black Hole, Supernova)
- **Anti-Cheat**: Server-side validation and Row Level Security

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (Auth, Database, Realtime)
- **AI**: OpenRouter API (Claude 3.5 Sonnet)
- **State Management**: Zustand
- **Security**: Zod validation, DOMPurify (XSS protection), RLS policies

## 📦 Installation

1. **Ensure the project is in an ASCII-only path** (see warning above)

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

4. **Set up Supabase**:
   - Create a new Supabase project at https://supabase.com
   - Run the SQL in `supabase/schema.sql` in the SQL Editor
   - Run the SQL in `supabase/functions.sql` in the SQL Editor
   - Enable Email authentication in Authentication settings

5. **Get OpenRouter API Key**:
   - Sign up at https://openrouter.ai
   - Create an API key
   - Add it to `.env.local`

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Build

```bash
npm run build
npm start
```

## 🔒 Security Features

### Anti-Cheat Measures
- Server-side Sudoku validation
- Timer verification (prevents client-side manipulation)
- Puzzle tampering detection
- Zod schema validation on all API routes

### Database Security
- Row Level Security (RLS) on all tables
- Users can only write their own scores
- XSS protection with DOMPurify on leaderboard usernames
- Secure API key handling via environment variables

### Input Sanitization
- All user inputs validated with Zod
- Leaderboard data sanitized before rendering
- Protected against SQL injection via Supabase client

## 🎮 Game Mechanics

### Scoring System
```
Base Score: 1000
+ Time Bonus: max(0, 1200 - seconds)
- Mistake Penalty: mistakes × 50
- Hint Penalty: hints × 100
× Difficulty Multiplier: easy(1), medium(1.5), hard(2), expert(3)
```

### Progression
- Complete puzzles to earn points
- Level up every 1000 points
- Unlock new cosmic themes and achievements

## 📁 Project Structure

```
cosmic-sudoku/
├── app/
│   ├── api/
│   │   ├── validate/       # Server-side puzzle validation
│   │   ├── leaderboard/    # Leaderboard with RLS
│   │   └── ai-coach/       # AI hint generation
│   ├── globals.css         # Global styles + VFX animations
│   └── page.tsx            # Main game page
├── components/
│   ├── game/
│   │   ├── sudoku-grid.tsx    # Interactive grid
│   │   ├── game-timer.tsx     # Timer with tension effects
│   │   ├── game-controls.tsx  # Game controls
│   │   ├── tension-vfx.tsx    # Visual effects
│   │   └── ai-coach.tsx       # AI hint UI
│   └── ui/                    # Reusable UI components
├── lib/
│   ├── sudoku/
│   │   └── generator.ts       # Backtracking algorithm
│   ├── store/
│   │   └── game-store.ts      # Zustand state management
│   └── validation/
│       └── schemas.ts         # Zod schemas
├── types/
│   └── sudoku.ts              # TypeScript types
├── utils/
│   └── supabase/              # Supabase clients
└── supabase/
    ├── schema.sql             # Database schema + RLS
    └── functions.sql          # Database functions
```

## 🎨 Themes

Unlock cosmic themes by completing achievements:
- **Nebula**: Complete 10 puzzles
- **Black Hole**: Complete 50 puzzles
- **Supernova**: Complete 100 puzzles

## 🤝 Contributing

Contributions are welcome! Please ensure:
- All API routes have Zod validation
- Security best practices are followed
- Tests pass before submitting PRs

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🐛 Known Issues

- **Build fails with Cyrillic path**: Move project to ASCII-only path
- Real-time duels feature requires additional implementation
- Achievement system needs UI integration
- Theme switching not yet implemented

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Daily challenges
- [ ] Tournament mode
- [ ] Social features (friends, chat)
- [ ] Puzzle creator mode
- [ ] Offline mode with service workers

---

Built with ❤️ using Next.js, Supabase, and Claude AI
