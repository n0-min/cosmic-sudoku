# 🌌 Cosmic Sudoku

A space-themed Sudoku game with dynamic cosmic backgrounds, currency system, and skins shop built with Next.js and Supabase.

## ✨ Features

- **🎮 Classic Sudoku Mode** - 4 difficulty levels (Easy, Medium, Hard, Expert)
- **🌍 Dynamic Cosmic Backgrounds** - Backgrounds change based on difficulty:
  - Easy: Earth (blue theme)
  - Medium: Moon (gray theme)
  - Hard: Mars (red theme)
  - Expert: Solar System (purple theme)
- **💰 Cosmic Coins Currency** - Earn coins by completing puzzles
- **🛒 Skins Shop** - 6 unique cosmic themes to unlock:
  - Classic (Free)
  - Nebula Dream (500 coins)
  - Aurora Borealis (750 coins)
  - Black Hole (1000 coins)
  - Spiral Galaxy (1500 coins)
  - Supernova Burst (2000 coins)
- **⚔️ Duel Mode** - Coming soon!

## 🎯 Earning Coins

Complete Sudoku puzzles to earn Cosmic Coins:

- **Easy**: 10 coins
- **Medium**: 25 coins
- **Hard**: 50 coins
- **Expert**: 100 coins
- **Speed Bonus**: Up to +50 coins for fast completion
- **Mistake Penalty**: -5 coins per error

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Security**: Row Level Security (RLS), server-side validation

## 📦 Installation

1. **Clone the repository**:
```bash
git clone https://github.com/n0-min/cosmic-sudoku.git
cd cosmic-sudoku
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:

Create `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase**:
   - Create a new Supabase project at https://supabase.com
   - Run the SQL files in order:
     1. `supabase/schema.sql` - Creates tables and RLS policies
     2. `supabase/currency-functions.sql` - Currency system functions
     3. `supabase/functions.sql` - Additional database functions

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 How to Play

1. Click **Classic Mode** on the main menu
2. Select your difficulty level
3. Fill in the Sudoku grid
4. Complete the puzzle to earn Cosmic Coins
5. Visit the **Skins Shop** to purchase new themes

## 🗄️ Database Schema

The game uses 8 main tables:
- `profiles` - User profiles with coins and current skin
- `games` - Game history and scores
- `achievements` - User achievements
- `duels` - Duel matches (coming soon)
- `duel_progress` - Real-time duel progress
- `skins` - Available skins in the shop
- `user_skins` - User-owned skins

All tables have Row Level Security enabled for data protection.

## 🔒 Security Features

- **Row Level Security (RLS)** on all database tables
- **Server-side validation** for game completion
- **Anti-cheat measures** to prevent score manipulation
- **Secure currency transactions** via database functions

## 📁 Project Structure

```
cosmic-sudoku/
├── app/
│   ├── page.tsx              # Main menu
│   ├── game/page.tsx         # Game page
│   └── shop/page.tsx         # Skins shop
├── components/
│   ├── game/
│   │   ├── cosmic-background.tsx  # Animated backgrounds
│   │   ├── sudoku-grid.tsx        # Game grid
│   │   ├── game-timer.tsx         # Timer
│   │   └── game-controls.tsx      # Controls
│   └── ui/                        # UI components
├── lib/
│   ├── sudoku/generator.ts        # Sudoku generation
│   ├── store/game-store.ts        # Game state
│   ├── store/user-store.ts        # User state
│   └── backgrounds/               # Background configs
├── supabase/
│   ├── schema.sql                 # Database schema
│   ├── currency-functions.sql     # Currency system
│   └── functions.sql              # Additional functions
└── types/
    └── sudoku.ts                  # TypeScript types
```

## 🚀 Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Don't forget to add environment variables in Vercel dashboard.

## 🎨 Customization

### Adding New Skins

1. Add skin data to `supabase/schema.sql`:
```sql
INSERT INTO public.skins (skin_id, name, description, price, rarity, theme_colors) VALUES
  ('your-skin', 'Your Skin Name', 'Description', 1000, 'epic', '{"primary": "#color1", "secondary": "#color2"}');
```

2. Update the skins shop UI in `app/shop/page.tsx`

### Changing Backgrounds

Edit `lib/backgrounds/cosmic-backgrounds.ts` to customize backgrounds for each difficulty level.

## 🐛 Known Issues

- Duel mode is not yet implemented
- Authentication UI needs to be added (backend is ready)
- Leaderboard frontend needs implementation

## 🔮 Future Features

- [ ] Real-time multiplayer duels
- [ ] Global leaderboards
- [ ] Achievement notifications
- [ ] Daily challenges
- [ ] Mobile app version
- [ ] Social features

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using Next.js, Supabase, and TypeScript**

🌟 Star this repo if you like it!
