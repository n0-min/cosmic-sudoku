# ✅ API ключ установлен!

## Следующие шаги:

### 1️⃣ Запустите SQL миграции в Supabase

**Откройте SQL Editor:**
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new

**Запустите 3 файла по порядку:**

#### Файл 1: schema.sql
1. Откройте файл `supabase/schema.sql` в редакторе
2. Скопируйте **весь** код (Ctrl+A, Ctrl+C)
3. Вставьте в SQL Editor (Ctrl+V)
4. Нажмите **"Run"** (или Ctrl+Enter)
5. Дождитесь сообщения **"Success"**

#### Файл 2: currency-functions.sql
1. Откройте файл `supabase/currency-functions.sql`
2. Скопируйте весь код
3. Вставьте в SQL Editor
4. Нажмите **"Run"**
5. Дождитесь **"Success"**

#### Файл 3: functions.sql
1. Откройте файл `supabase/functions.sql`
2. Скопируйте весь код
3. Вставьте в SQL Editor
4. Нажмите **"Run"**
5. Дождитесь **"Success"**

---

### 2️⃣ Включите Email Authentication

**Откройте:**
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/auth/providers

1. Найдите **"Email"**
2. Включите переключатель
3. Нажмите **"Save"**

---

### 3️⃣ Проверьте таблицы

**Откройте Table Editor:**
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/editor

Должны быть созданы таблицы:
- ✅ profiles
- ✅ games
- ✅ achievements
- ✅ duels
- ✅ duel_progress
- ✅ skins (с 6 скинами)
- ✅ user_skins

---

### 4️⃣ Создайте GitHub репозиторий

**Откройте:**
https://github.com/new

**Заполните:**
- Repository name: `cosmic-sudoku`
- Description: `🚀 Cosmic Sudoku - Journey Through the Stars`
- Visibility: **Public** (или Private)
- ❌ **НЕ добавляйте** README, .gitignore, license

**Нажмите "Create repository"**

**Скопируйте URL** (будет показан на следующей странице)
Например: `https://github.com/yourusername/cosmic-sudoku.git`

---

### 5️⃣ Подключите Git и запушьте код

Откройте терминал и выполните:

```bash
cd C:\Users\User\Desktop\cosmic-sudoku

# Добавьте remote (замените URL на ваш!)
git remote add origin https://github.com/yourusername/cosmic-sudoku.git

# Переименуйте ветку
git branch -M main

# Запушьте код
git push -u origin main
```

Введите логин и пароль GitHub если попросит.

---

### 6️⃣ Запустите игру!

```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

**Откройте:** http://localhost:3000

---

## ✅ Проверка:

После запуска проверьте:
- ✅ Главное меню отображается
- ✅ Баланс показывает 0 Cosmic Coins
- ✅ Можно зайти в Classic Mode
- ✅ Фон меняется при смене сложности
- ✅ При завершении начисляются монеты
- ✅ Магазин скинов работает
- ✅ Нет ошибок в консоли (F12)

---

## 🎉 Готово!

После выполнения всех шагов у вас будет:
- ✅ Работающая игра с Supabase
- ✅ Код на GitHub
- ✅ Готово к деплою на Vercel

**Начните с шага 1!** Запустите SQL миграции.
