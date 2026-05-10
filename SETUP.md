# 🚀 Cosmic Sudoku - Setup & Deployment Guide

## ⚠️ CRITICAL: Fix Path Issue First

The project is in a directory with Cyrillic characters which breaks Next.js builds. **You must move it first:**

### Option 1: Move to Desktop root
```bash
cd C:\Users\User\Desktop
move судоку\cosmic-sudoku cosmic-sudoku
cd cosmic-sudoku
```

### Option 2: Copy to new location
```bash
cd C:\Users\User\Desktop
xcopy судоку\cosmic-sudoku cosmic-sudoku-game /E /I
cd cosmic-sudoku-game
npm install
```

## 📋 Complete Setup Checklist

### 1. Supabase Setup (Required)

1. Go to https://supabase.com and create a new project
2. Wait for the project to be provisioned (~2 minutes)
3. Go to **Project Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Go to **SQL Editor** and run these files in order:
   - First: `supabase/schema.sql` (creates tables and RLS policies)
   - Second: `supabase/functions.sql` (creates helper functions)

6. Go to **Authentication** → **Providers**
   - Enable **Email** provider
   - Configure email templates (optional)

### 2. OpenRouter Setup (Required for AI Coach)

1. Go to https://openrouter.ai
2. Sign up for an account
3. Go to **Keys** section
4. Create a new API key
5. Copy the key → `OPENROUTER_API_KEY`

### 3. Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# OpenRouter (for AI Coach)
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 🔧 Troubleshooting

### Build Errors with Path

**Error**: `start byte index 15 is not a char boundary`

**Solution**: Move project to ASCII-only path (see top of this guide)

### Supabase Connection Issues

**Error**: `Invalid API key` or `Failed to fetch`

**Solution**: 
1. Check `.env.local` has correct values
2. Restart dev server after changing env vars
3. Verify Supabase project is active

### AI Coach Not Working

**Error**: `Failed to get AI hint`

**Solution**:
1. Verify `OPENROUTER_API_KEY` is set
2. Check OpenRouter account has credits
3. Check browser console for detailed errors

### Database Errors

**Error**: `relation "profiles" does not exist`

**Solution**: Run `supabase/schema.sql` in Supabase SQL Editor

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

### Environment Variables for Production

Add these in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`

### Database Setup for Production

Use the same Supabase project or create a production instance:
1. Run `supabase/schema.sql`
2. Run `supabase/functions.sql`
3. Update environment variables

## 🎮 Testing the Application

### 1. Test Sudoku Generator
- Open the app
- Click different difficulty levels
- Verify puzzles generate correctly

### 2. Test Game Mechanics
- Fill in numbers
- Check timer is running
- Verify mistakes are counted
- Test pause/resume

### 3. Test Tension VFX
- Play until timer < 20% (4 minutes remaining)
- Verify screen shake and color effects

### 4. Test AI Coach
- Click "Ask AI Coach"
- Verify hint appears
- Check hint quality

### 5. Test Validation (Requires Supabase)
- Complete a puzzle
- Check score is calculated
- Verify completion message

## 📊 Database Schema Overview

### Tables
- `profiles`: User profiles with stats
- `games`: Completed game records
- `achievements`: Unlocked achievements
- `duels`: Real-time duel matches
- `duel_progress`: Live duel progress tracking

### Security
- All tables have Row Level Security (RLS)
- Users can only modify their own data
- Server-side validation prevents cheating

## 🔐 Security Checklist

- [x] Server-side puzzle validation
- [x] Timer tampering detection
- [x] Row Level Security on all tables
- [x] XSS protection with DOMPurify
- [x] Zod schema validation
- [x] API keys in environment variables
- [x] No secrets in client-side code

## 📈 Performance Optimization

- Zustand for efficient state management
- Framer Motion for GPU-accelerated animations
- Next.js App Router for optimal loading
- Supabase connection pooling
- Client-side puzzle generation (no API calls)

## 🎨 Customization

### Change Difficulty Settings
Edit `lib/sudoku/generator.ts`:
```typescript
private static getDifficultySettings(difficulty: Difficulty): number {
  const settings = {
    easy: 40,    // cells to remove
    medium: 50,
    hard: 55,
    expert: 60
  };
  return settings[difficulty];
}
```

### Adjust Scoring
Edit `app/api/validate/route.ts`:
```typescript
const baseScore = 1000;
const timeBonus = Math.max(0, 1200 - Math.floor(elapsedTime / 1000));
const mistakePenalty = validatedData.mistakes * 50;
const hintPenalty = validatedData.hintsUsed * 100;
```

### Modify Tension Timing
Edit `components/game/game-timer.tsx`:
```typescript
const timeLimit = 20 * 60 * 1000; // 20 minutes in ms
```

## 🐛 Known Limitations

1. **Real-time Duels**: Backend implemented, UI needs completion
2. **Achievements**: Database ready, unlock logic needs implementation
3. **Theme Switching**: CSS themes created, switcher UI needed
4. **Leaderboard UI**: API ready, frontend component needed

## 📞 Support

For issues:
1. Check this guide first
2. Review error messages in browser console
3. Check Supabase logs for database errors
4. Verify all environment variables are set

## 🎯 Next Steps

After setup:
1. Create a user account
2. Complete a puzzle
3. Check leaderboard API: `GET /api/leaderboard`
4. Test AI Coach with different puzzle states
5. Customize themes and difficulty

---

**Ready to build?** Move the project to an ASCII path and run `npm run dev`!
