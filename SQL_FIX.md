# ⚠️ SQL ОШИБКА ИСПРАВЛЕНА

## Проблема:
`current_time` - зарезервированное слово в PostgreSQL

## Решение:
Переименовано в `elapsed_time`

## Что делать:

### 1. Откройте SQL Editor:
```
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new
```

### 2. Скопируйте ОБНОВЛЕННЫЙ файл:
Откройте `supabase/schema.sql` (он уже исправлен!)

### 3. Запустите в SQL Editor:
- Ctrl+A, Ctrl+C (скопировать весь код)
- Вставьте в SQL Editor
- Нажмите "Run"
- Дождитесь "Success"

### 4. Затем запустите остальные файлы:
- `supabase/currency-functions.sql`
- `supabase/functions.sql`

---

## ✅ После этого:

Запустите игру:
```bash
start.bat
```

Или:
```bash
npm run dev
```

Откройте: http://localhost:3000

---

**Файл исправлен и закоммичен!** 🚀
