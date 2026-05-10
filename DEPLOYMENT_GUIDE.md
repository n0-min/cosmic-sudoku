# 🚀 Подключение к Supabase и GitHub

## Часть 1: Получение API ключей Supabase

### Шаг 1: Откройте настройки API
Перейдите по ссылке:
```
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/settings/api
```

### Шаг 2: Скопируйте ключи

На странице вы увидите:

**Project URL:**
```
https://nfieiencvlrpibdtajtr.supabase.co
```

**anon public key:** (длинный ключ, начинается с `eyJ...`)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

### Шаг 3: Обновите .env.local

Откройте файл `.env.local` и вставьте ваши ключи:

```env
NEXT_PUBLIC_SUPABASE_URL=https://nfieiencvlrpibdtajtr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш_настоящий_anon_ключ
OPENROUTER_API_KEY=ваш_openrouter_ключ
```

### Шаг 4: Запустите SQL миграции

1. Откройте SQL Editor: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new

2. Запустите файлы по порядку:

**Файл 1: schema.sql**
```bash
# Откройте supabase/schema.sql
# Скопируйте весь код
# Вставьте в SQL Editor
# Нажмите Run
```

**Файл 2: currency-functions.sql**
```bash
# Откройте supabase/currency-functions.sql
# Скопируйте весь код
# Вставьте в SQL Editor
# Нажмите Run
```

**Файл 3: functions.sql**
```bash
# Откройте supabase/functions.sql
# Скопируйте весь код
# Вставьте в SQL Editor
# Нажмите Run
```

### Шаг 5: Включите Email Authentication

1. Перейдите: https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/auth/providers
2. Найдите "Email"
3. Включите переключатель
4. Нажмите Save

---

## Часть 2: Создание GitHub репозитория

### Вариант A: Через веб-интерфейс GitHub

1. Перейдите на https://github.com/new
2. Заполните:
   - **Repository name**: `cosmic-sudoku`
   - **Description**: `🚀 Cosmic Sudoku - Journey Through the Stars`
   - **Public** или **Private** (на ваш выбор)
   - ❌ НЕ добавляйте README, .gitignore, license (уже есть в проекте)
3. Нажмите "Create repository"

4. Скопируйте URL репозитория (например: `https://github.com/username/cosmic-sudoku.git`)

5. Выполните команды:
```bash
cd C:\Users\User\Desktop\cosmic-sudoku
git remote add origin https://github.com/username/cosmic-sudoku.git
git branch -M main
git push -u origin main
```

### Вариант B: Через GitHub CLI (если установлен)

```bash
cd C:\Users\User\Desktop\cosmic-sudoku
gh repo create cosmic-sudoku --public --source=. --remote=origin --push
```

---

## Часть 3: Проверка

### Проверка Supabase
```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

Откройте http://localhost:3000 и проверьте консоль (F12).
Не должно быть ошибок "Invalid API key".

### Проверка GitHub
```bash
git remote -v
```

Должно показать:
```
origin  https://github.com/username/cosmic-sudoku.git (fetch)
origin  https://github.com/username/cosmic-sudoku.git (push)
```

---

## Часть 4: Деплой на Vercel (опционально)

1. Перейдите на https://vercel.com
2. Нажмите "Add New" → "Project"
3. Импортируйте репозиторий `cosmic-sudoku`
4. Добавьте Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENROUTER_API_KEY`
5. Нажмите "Deploy"

---

## 📋 Чеклист

- [ ] Получил anon ключ из Supabase
- [ ] Обновил .env.local
- [ ] Запустил все SQL миграции
- [ ] Включил Email Authentication
- [ ] Создал GitHub репозиторий
- [ ] Запушил код в GitHub
- [ ] Проверил что игра работает локально
- [ ] (Опционально) Задеплоил на Vercel

---

**Готово!** После выполнения всех шагов игра будет подключена к Supabase и размещена на GitHub.
