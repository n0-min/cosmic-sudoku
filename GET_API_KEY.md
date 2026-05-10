# 🔐 Получение Supabase API ключа

## Шаг 1: Откройте страницу настроек

Перейдите по ссылке:
```
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/settings/api
```

## Шаг 2: Найдите секцию "Project API keys"

На странице вы увидите таблицу с ключами:

```
┌─────────────────────────────────────────────────────────┐
│ Project API keys                                        │
├─────────────────────────────────────────────────────────┤
│ Name          │ Key                                     │
├─────────────────────────────────────────────────────────┤
│ anon public   │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
│ service_role  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │
└─────────────────────────────────────────────────────────┘
```

## Шаг 3: Скопируйте ТОЛЬКО anon public ключ

⚠️ **ВАЖНО**: Копируйте **anon public**, НЕ service_role!

Ключ будет очень длинным, примерно такой:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5maWVpZW5jdmxycGliZHRhanRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODI0NzAsImV4cCI6MjA2MjQ1ODQ3MH0.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Шаг 4: Обновите .env.local

Откройте файл `.env.local` в корне проекта и замените:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfieiencvlrpibdtajtr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=вставьте_сюда_ваш_anon_ключ
OPENROUTER_API_KEY=ваш_openrouter_ключ_если_есть
```

## Шаг 5: Сохраните и перезапустите

```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

## Проверка

Откройте http://localhost:3000 и нажмите F12 (консоль браузера).

✅ **Правильно**: Нет ошибок
❌ **Неправильно**: "Invalid API key" или "Failed to fetch"

---

**После этого переходите к созданию GitHub репозитория!**
