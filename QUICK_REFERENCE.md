# 🚀 Quick Reference Guide

## ⚠️ FIRST: Fix the Path Issue

```bash
# The project is in a Cyrillic path which breaks Next.js builds
# Move it first:
cd C:\Users\User\Desktop
move судоку\cosmic-sudoku cosmic-sudoku
cd cosmic-sudoku
```

## 🏃 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 🔧 Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit with your credentials
# Required:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - OPENROUTER_API_KEY
```

## 🗄️ Database Setup

1. Create Supabase project at https://supabase.com
2. Run SQL files in order:
   ```sql
   -- First: supabase/schema.sql
   -- Second: supabase/functions.sql
   ```
3. Enable Email auth in Authentication settings

## 🔑 Get API Keys

### Supabase
1. Go to Project Settings → API
2. Copy Project URL and anon key

### OpenRouter
1. Sign up at https://openrouter.ai
2. Go to Keys section
3. Create new API key

## 📂 Project Structure

```
cosmic-sudoku/
├── app/
│   ├── api/              # API routes
│   │   ├── validate/     # Puzzle validation
│   │   ├── leaderboard/  # Leaderboard API
│   │   └── ai-coach/     # AI hints
│   ├── globals.css       # Styles + animations
│   └── page.tsx          # Main game page
├── components/
│   └── game/             # Game components
├── lib/
│   ├── sudoku/           # Game logic
│   ├── store/            # State management
│   ├── validation/       # Schemas
│   └── progression/      # Themes & achievements
├── types/                # TypeScript types
├── utils/
│   └── supabase/         # Supabase clients
└── supabase/             # Database SQL
```

## 🎮 Game Controls

### Keyboard
- `1-9`: Enter number
- `Backspace/Delete/0`: Clear cell
- Click cell to select

### Mouse
- Click cell to select
- Click number buttons to input
- Click "Clear" to remove number

## 🐛 Common Issues

### Build fails with path error
**Solution**: Move project to ASCII-only path (see top)

### "Invalid API key" error
**Solution**: Check `.env.local` has correct Supabase keys

### AI Coach not working
**Solution**: Verify `OPENROUTER_API_KEY` is set and has credits

### Database errors
**Solution**: Run `supabase/schema.sql` in Supabase SQL Editor

## 📊 Testing Checklist

- [ ] Game loads without errors
- [ ] Can select difficulty levels
- [ ] Numbers can be entered
- [ ] Timer counts up
- [ ] Pause/resume works
- [ ] AI Coach returns hints
- [ ] Tension VFX appear at < 20% time
- [ ] Completion detection works

## 🚀 Deployment to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main

# 2. Deploy on Vercel
# - Go to vercel.com
# - Import repository
# - Add environment variables
# - Deploy
```

## 📝 Environment Variables for Production

Add these in Vercel dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
OPENROUTER_API_KEY=sk-or-v1-xxx...
```

## 🎯 What Works Right Now

✅ Complete Sudoku game (4 difficulties)
✅ Timer with tension effects
✅ AI Coach for hints
✅ Server-side validation
✅ Anti-cheat system
✅ Progression system (8 cosmic zones)
✅ Achievement definitions

## ⚠️ What Needs UI

- Login/signup forms
- Leaderboard display
- Achievement notifications
- Duel matchmaking

## 📖 Documentation Files

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `IMPLEMENTATION_STATUS.md` - Feature status
- `PROJECT_SUMMARY.md` - Complete summary
- `QUICK_REFERENCE.md` - This file

## 🆘 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `IMPLEMENTATION_STATUS.md` for feature status
3. Check browser console for errors
4. Verify all environment variables are set
5. Check Supabase logs for database errors

## 🎨 Customization

### Change difficulty
Edit `lib/sudoku/generator.ts`:
```typescript
easy: 40,    // cells to remove
medium: 50,
hard: 55,
expert: 60
```

### Adjust scoring
Edit `app/api/validate/route.ts`:
```typescript
const baseScore = 1000;
const timeBonus = Math.max(0, 1200 - seconds);
const mistakePenalty = mistakes * 50;
const hintPenalty = hints * 100;
```

### Change timer limit
Edit `components/game/game-timer.tsx`:
```typescript
const timeLimit = 20 * 60 * 1000; // milliseconds
```

## 🔗 Useful Links

- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- OpenRouter: https://openrouter.ai/docs
- Framer Motion: https://www.framer.com/motion
- Zustand: https://github.com/pmndrs/zustand

---

**Ready to start?** Move the project to an ASCII path and run `npm run dev`!
