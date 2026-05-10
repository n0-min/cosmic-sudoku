# 🎮 КАК ЗАПУСТИТЬ COSMIC SUDOKU

## ⚡ БЫСТРЫЙ СТАРТ (Windows):

### Вариант 1: Двойной клик (самый простой)
Просто дважды кликните на файл:
```
start.bat
```

### Вариант 2: Через командную строку
```bash
cd C:\Users\User\Desktop\cosmic-sudoku
start.bat
```

### Вариант 3: Через npm
```bash
cd C:\Users\User\Desktop\cosmic-sudoku
npm run dev
```

---

## ⚠️ ВАЖНО: SQL Миграции

Перед первым запуском нужно выполнить SQL миграции:

### Шаг 1: Откройте SQL Editor
```
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new
```

### Шаг 2: Запустите 3 файла по порядку

**Файл 1: schema.sql**
1. Откройте `supabase/schema.sql` в блокноте
2. Ctrl+A (выделить всё), Ctrl+C (скопировать)
3. Вставьте в SQL Editor
4. Нажмите "Run"
5. Дождитесь "Success"

**Файл 2: currency-functions.sql**
1. Откройте `supabase/currency-functions.sql`
2. Скопируйте весь код
3. Вставьте в SQL Editor
4. Нажмите "Run"

**Файл 3: functions.sql**
1. Откройте `supabase/functions.sql`
2. Скопируйте весь код
3. Вставьте в SQL Editor
4. Нажмите "Run"

---

## ✅ После миграций:

1. Запустите `start.bat`
2. Откройте: http://localhost:3000
3. Играйте и зарабатывайте Cosmic Coins!

---

## 🔧 Проверка настройки:

Запустите:
```bash
node setup.js
```

Это покажет статус всех настроек.

---

## 📚 Дополнительная информация:

- **NEXT_STEPS.md** - детальная инструкция
- **FINAL_CHECKLIST.md** - полный чеклист
- **README_RU.md** - описание проекта

---

## 🐛 Проблемы?

### "Invalid API key"
- Проверьте `.env.local`
- Убедитесь что используете anon ключ

### "relation does not exist"
- Запустите SQL миграции (см. выше)

### Порт 3000 занят
```bash
npm run dev -- -p 3001
```

---

**Готово! Запустите start.bat и играйте!** 🚀
