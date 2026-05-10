# 🚀 Supabase Setup Guide

## Шаг 1: Создание проекта Supabase

1. Перейдите на https://supabase.com
2. Нажмите "Start your project"
3. Войдите через GitHub или создайте аккаунт
4. Нажмите "New Project"
5. Заполните:
   - **Name**: cosmic-sudoku (или любое имя)
   - **Database Password**: создайте надежный пароль (сохраните его!)
   - **Region**: выберите ближайший регион
6. Нажмите "Create new project"
7. Подождите ~2 минуты пока проект создается

## Шаг 2: Получение API ключей

1. В левом меню выберите **Settings** (⚙️)
2. Перейдите в **API**
3. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** key (длинный ключ начинающийся с `eyJ...`)

## Шаг 3: Настройка .env.local

1. Откройте проект в редакторе
2. Создайте файл `.env.local` в корне проекта
3. Добавьте:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ваш-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJхххххх...
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

## Шаг 4: Запуск SQL миграций

### 4.1 Основная схема

1. В Supabase перейдите в **SQL Editor** (левое меню)
2. Нажмите "New query"
3. Откройте файл `supabase/schema.sql` из проекта
4. Скопируйте **весь** код
5. Вставьте в SQL Editor
6. Нажмите "Run" (или Ctrl+Enter)
7. Дождитесь сообщения "Success"

### 4.2 Функции для валюты

1. Создайте новый query в SQL Editor
2. Откройте файл `supabase/currency-functions.sql`
3. Скопируйте весь код
4. Вставьте в SQL Editor
5. Нажмите "Run"
6. Дождитесь "Success"

### 4.3 Функции для статистики

1. Создайте новый query
2. Откройте файл `supabase/functions.sql`
3. Скопируйте весь код
4. Вставьте и запустите

## Шаг 5: Настройка Authentication

1. В левом меню выберите **Authentication**
2. Перейдите в **Providers**
3. Найдите **Email**
4. Включите переключатель "Enable Email provider"
5. Нажмите "Save"

### Опционально: Настройка email шаблонов

1. Перейдите в **Email Templates**
2. Настройте шаблоны для:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

## Шаг 6: Проверка таблиц

1. Перейдите в **Table Editor** (левое меню)
2. Убедитесь что созданы таблицы:
   - ✅ profiles
   - ✅ games
   - ✅ achievements
   - ✅ duels
   - ✅ duel_progress
   - ✅ skins
   - ✅ user_skins

## Шаг 7: Проверка RLS (Row Level Security)

1. В Table Editor выберите любую таблицу
2. Нажмите на иконку 🔒 (RLS)
3. Убедитесь что RLS включен (зеленый переключатель)
4. Проверьте что есть политики (policies)

## Шаг 8: Тестирование подключения

1. Перезапустите dev сервер:
```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

2. Откройте http://localhost:3000
3. Откройте консоль браузера (F12)
4. Не должно быть ошибок подключения к Supabase

## Шаг 9: Создание тестового пользователя

1. В Supabase перейдите в **Authentication** → **Users**
2. Нажмите "Add user" → "Create new user"
3. Введите:
   - Email: test@example.com
   - Password: Test123456!
4. Нажмите "Create user"

## Шаг 10: Добавление профиля вручную (временно)

Пока нет UI для регистрации, добавьте профиль вручную:

1. Перейдите в **Table Editor** → **profiles**
2. Нажмите "Insert" → "Insert row"
3. Заполните:
   - **id**: скопируйте UUID из Authentication → Users
   - **username**: test_user
   - **level**: 1
   - **cosmic_coins**: 1000 (для тестирования магазина)
4. Нажмите "Save"

## ✅ Проверка что всё работает

### Проверка 1: Подключение
```bash
# В консоли браузера не должно быть ошибок типа:
# "Invalid API key" или "Failed to fetch"
```

### Проверка 2: Таблицы
- Все 7 таблиц созданы
- RLS включен на всех таблицах
- Есть политики безопасности

### Проверка 3: Скины
- В таблице `skins` должно быть 6 записей (default, nebula, blackhole, supernova, aurora, galaxy)

## 🐛 Troubleshooting

### Ошибка: "relation does not exist"
**Решение**: Запустите `schema.sql` заново

### Ошибка: "Invalid API key"
**Решение**: 
1. Проверьте `.env.local`
2. Убедитесь что используете **anon** ключ, не **service_role**
3. Перезапустите dev сервер

### Ошибка: "Row Level Security policy violation"
**Решение**: Убедитесь что RLS политики созданы (они в schema.sql)

### Скины не отображаются в магазине
**Решение**: Проверьте что в таблице `skins` есть данные (INSERT в конце schema.sql)

## 📊 Структура базы данных

```
profiles (пользователи)
├── cosmic_coins (валюта)
├── current_skin (активный скин)
└── level, total_score, games_played, games_won

skins (доступные скины)
├── skin_id, name, description
├── price, rarity
└── theme_colors (JSON)

user_skins (купленные скины)
├── user_id → profiles
└── skin_id

games (история игр)
├── user_id → profiles
├── difficulty, level, time_seconds
├── mistakes, hints_used
└── score

achievements (достижения)
├── user_id → profiles
└── achievement_type

duels (дуэли)
├── player1_id, player2_id → profiles
├── puzzle_data (JSON)
└── status, winner_id

duel_progress (прогресс в дуэли)
├── duel_id → duels
├── user_id → profiles
└── completion_percentage, current_time
```

## 🎯 Следующие шаги

После настройки Supabase:
1. ✅ Игра работает локально
2. ✅ Монеты начисляются при завершении
3. ✅ Магазин скинов работает
4. ⏳ Нужно добавить UI для регистрации/входа
5. ⏳ Интегрировать сохранение в базу данных

---

**Готово!** Supabase настроен и готов к использованию.
