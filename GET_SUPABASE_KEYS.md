# 🔑 Получение API ключей из Supabase

## Шаг 1: Откройте настройки проекта

1. Перейдите по ссылке: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/settings/api
2. Войдите в аккаунт если нужно

## Шаг 2: Скопируйте ключи

На странице API Settings вы увидите:

### Project URL
```
https://nfieiencvlrpibdtajtr.supabase.co
```

### API Keys

Найдите раздел "Project API keys" и скопируйте:

**anon public** - это длинный ключ, начинающийся с `eyJ...`

Пример:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

⚠️ **НЕ копируйте service_role ключ!** Используйте только **anon** ключ.

## Шаг 3: Обновите .env.local

Откройте файл `.env.local` в корне проекта и замените:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfieiencvlrpibdtajtr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_anon_ключ_здесь
OPENROUTER_API_KEY=ваш_openrouter_ключ_если_есть
```

## Шаг 4: Запустите SQL миграции

1. Перейдите в SQL Editor: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new
2. Откройте файл `supabase/schema.sql` из проекта
3. Скопируйте весь код и вставьте в SQL Editor
4. Нажмите "Run" (или Ctrl+Enter)
5. Дождитесь "Success"

Повторите для файлов:
- `supabase/currency-functions.sql`
- `supabase/functions.sql`

## Шаг 5: Перезапустите сервер

```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

## Проверка подключения

Откройте http://localhost:3000 и проверьте консоль браузера (F12).

Не должно быть ошибок типа:
- "Invalid API key"
- "Failed to fetch"

---

**Готово!** После этого игра будет подключена к Supabase.
