# ⚠️ ВАЖНО: Используйте правильный файл!

## Проблема:
Возможно вы копируете старую версию файла из браузера или кэша.

## Решение:

### Вариант 1: Используйте новый файл
Откройте файл:
```
supabase/schema-fixed.sql
```

Это точно правильная версия с `elapsed_time` вместо `current_time`.

### Вариант 2: Скопируйте напрямую отсюда

Откройте SQL Editor:
https://supabase.com/dashboard/project/nfieiencvlrpibdtajtr/sql/new

И вставьте этот код для таблицы duel_progress:

```sql
-- Duel progress (real-time sync)
CREATE TABLE public.duel_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  duel_id UUID REFERENCES public.duels(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  completion_percentage INTEGER DEFAULT 0,
  elapsed_time INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(duel_id, user_id)
);
```

### Вариант 3: Запустите весь schema-fixed.sql

1. Откройте `supabase/schema-fixed.sql` в блокноте
2. Ctrl+A, Ctrl+C
3. Вставьте в SQL Editor
4. Run

---

## Проверка:
Найдите строку 61 в файле - должно быть:
```
elapsed_time INTEGER DEFAULT 0,
```

НЕ:
```
current_time INTEGER DEFAULT 0,
```

---

**Используйте schema-fixed.sql - он точно правильный!**
