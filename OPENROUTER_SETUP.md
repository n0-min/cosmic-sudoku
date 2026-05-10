# 🤖 How to Get OpenRouter API Key

OpenRouter provides access to multiple AI models including Claude 3.5 Sonnet for the AI Coach feature.

## Steps:

1. **Sign up at OpenRouter**
   - Go to https://openrouter.ai
   - Click "Sign In" or "Get Started"
   - Create an account (you can use GitHub, Google, or email)

2. **Get API Key**
   - After logging in, go to https://openrouter.ai/keys
   - Click "Create Key"
   - Give it a name (e.g., "Cosmic Sudoku")
   - Copy the key (starts with `sk-or-v1-...`)

3. **Add to .env.local**
   - Open `.env.local` file in your project
   - Replace the empty `OPENROUTER_API_KEY=` with your key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

4. **Add Credits (Optional)**
   - OpenRouter offers free credits for testing
   - Go to https://openrouter.ai/credits to add more if needed
   - Claude 3.5 Sonnet costs ~$3 per million tokens

5. **Restart Dev Server**
   ```bash
   npm run dev
   ```

## Testing AI Coach

1. Start a game in Classic Mode
2. Click "🤖 Ask AI Coach" button
3. You should get strategic hints powered by Claude!

## Without API Key

The game will still work without an OpenRouter key:
- AI Coach will provide basic rule-based hints
- All other features work normally
- You can add the key later anytime

---

**Cost Estimate:**
- Each hint costs ~$0.001-0.002
- 1000 hints ≈ $1-2
- Free tier usually includes $5-10 credits
