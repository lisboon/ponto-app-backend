# Migration — legacy ponto-app-backend → ponto

## Pré-requisitos

1. Schema novo aplicado em `public.*`:
   ```bash
   DATABASE_URL=postgresql://... npx prisma migrate deploy
   ```
2. Schema legado restaurado em `legacy.*` no mesmo banco:
   ```bash
   # No servidor antigo:
   pg_dump --schema-only --no-owner --no-privileges studio_point > legacy-schema.sql
   pg_dump --data-only --no-owner --no-privileges studio_point > legacy-data.sql

   # No banco novo (como superuser ou owner):
   psql $DATABASE_URL -c 'CREATE SCHEMA legacy;'
   psql $DATABASE_URL -c 'SET search_path TO legacy;' \
        -f legacy-schema.sql \
        -f legacy-data.sql
   # ou rode os arquivos com `\i` dentro de uma sessão psql que tenha SET search_path TO legacy;
   ```
3. `public.*` deve estar vazio (cutover não usa `ON CONFLICT`).

## Execução

```bash
# 1) Migração
psql $DATABASE_URL -f migration/2026-cutover.sql

# 2) Validação (esperar diff=0 em todas as linhas)
psql $DATABASE_URL -f migration/2026-validation.sql
```

## Escopo

| Migrado | Não migrado |
|---|---|
| users, work_schedules, work_days, time_entries, hour_bank, holidays, announcements, announcement_reads | justifications (não funcionava no legado), medical_leaves (não existia) |

## Rollback

A transação no `2026-cutover.sql` é atômica. Falha = ROLLBACK automático.
Se a falha aparecer só no `2026-validation.sql`, rode:
```sql
TRUNCATE public.announcement_reads, public.announcements, public.hour_bank,
         public.time_entries, public.work_days, public.users,
         public.holidays, public.work_schedules CASCADE;
```
e investigue antes de re-executar o cutover.
