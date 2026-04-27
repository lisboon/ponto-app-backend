-- ============================================================================
-- Ponto cutover — migrate legacy ponto-app-backend → new ponto schema
-- ----------------------------------------------------------------------------
-- Premissas:
--   * Mesmo cluster Postgres.
--   * Schema legado disponível em `legacy.*` (faça `pg_dump --schema-only`
--     do banco antigo, restaure num schema chamado `legacy` no banco novo,
--     depois rode `pg_dump --data-only` e restaure no mesmo schema).
--   * Schema novo já criado em `public.*` por `prisma migrate deploy`.
--   * Tabelas `public.*` estão vazias (rode TRUNCATE antes se reexecutar).
--
-- Escopo: migra users, work_schedules, work_days, time_entries, hour_bank,
-- holidays, announcements, announcement_reads.
--
-- NÃO migra: justifications (não funcionava no legado, não há dados úteis),
-- medical_leaves (não existia no legado).
--
-- Renomes/adições:
--   * time_entries.server_time → punched_at
--   * time_entries.outside_studio  → DEFAULT false (não havia rastreio)
--   * work_schedules.{active, updated_at, deleted_at} → defaults
--   * holidays.{updated_at, deleted_at} → defaults
--   * announcements.deleted_at → NULL
--   * work_days.updated_at → copia de created_at
--   * hour_bank.last_recalculated_at → copia de updated_at (auditoria)
--
-- Roda dentro de uma transação. Em caso de erro, ROLLBACK total.
-- ============================================================================

BEGIN;

-- 1) work_schedules ---------------------------------------------------------
INSERT INTO public.work_schedules (
    id, name, schedule_data, active, created_at, updated_at, deleted_at
)
SELECT
    id,
    name,
    schedule_data,
    TRUE                AS active,
    created_at,
    created_at          AS updated_at,
    NULL::timestamp     AS deleted_at
FROM legacy.work_schedules;

-- 2) holidays ---------------------------------------------------------------
INSERT INTO public.holidays (
    id, name, date, type, description, is_recurring,
    created_at, updated_at, deleted_at
)
SELECT
    id,
    name,
    date,
    type::text::public."holiday_type"  AS type,
    description,
    is_recurring,
    created_at,
    created_at        AS updated_at,
    NULL::timestamp   AS deleted_at
FROM legacy.holidays;

-- 3) users ------------------------------------------------------------------
-- ERole/EContractType → UserRole/ContractType: nomes idênticos, cast via text.
INSERT INTO public.users (
    id, email, name, password, avatar_url, role, position, contract_type,
    weekly_minutes, hourly_rate, work_schedule_id, hire_date,
    active, created_at, updated_at, deleted_at
)
SELECT
    id,
    email,
    name,
    password,
    avatar_url,
    role::text::public."user_role"               AS role,
    position,
    contract_type::text::public."contract_type"  AS contract_type,
    weekly_minutes,
    hourly_rate,
    work_schedule_id,
    hire_date,
    active,
    created_at,
    updated_at,
    deleted_at
FROM legacy.users;

-- 4) work_days --------------------------------------------------------------
-- EDayStatus do legado tem {OPEN, CLOSED, INCOMPLETE, HOLIDAY, ABSENT}; o novo
-- adiciona MEDICAL_LEAVE — não há valores antigos que mapeiem pra ele.
INSERT INTO public.work_days (
    id, user_id, date, status,
    expected_minutes, worked_minutes, break_minutes, overtime_minutes, hour_bank_delta,
    medical_leave_id, closed_at, created_at, updated_at
)
SELECT
    id,
    user_id,
    date,
    status::text::public."day_status"  AS status,
    expected_minutes,
    worked_minutes,
    break_minutes,
    overtime_minutes,
    hour_bank_delta,
    NULL::text       AS medical_leave_id,
    closed_at,
    created_at,
    created_at       AS updated_at
FROM legacy.work_days;

-- 5) time_entries -----------------------------------------------------------
-- Renomeia server_time → punched_at; outside_studio começa false (legado não rastreava).
INSERT INTO public.time_entries (
    id, work_day_id, punch_type, punched_at,
    ip_address, user_agent, outside_studio,
    is_manual, manual_note, created_at
)
SELECT
    id,
    work_day_id,
    punch_type::text::public."punch_type"  AS punch_type,
    server_time                            AS punched_at,
    ip_address,
    user_agent,
    FALSE                                  AS outside_studio,
    is_manual,
    manual_note,
    created_at
FROM legacy.time_entries;

-- 6) hour_bank --------------------------------------------------------------
INSERT INTO public.hour_bank (
    id, user_id, balance_minutes, last_recalculated_at, updated_at
)
SELECT
    id,
    user_id,
    balance_minutes,
    updated_at         AS last_recalculated_at,
    updated_at
FROM legacy.hour_bank;

-- 7) announcements ----------------------------------------------------------
INSERT INTO public.announcements (
    id, author_id, title, content, status, published_at,
    created_at, updated_at, deleted_at
)
SELECT
    id,
    author_id,
    title,
    content,
    status::text::public."announcement_status"  AS status,
    published_at,
    created_at,
    updated_at,
    NULL::timestamp                              AS deleted_at
FROM legacy.announcements;

-- 8) announcement_reads -----------------------------------------------------
INSERT INTO public.announcement_reads (
    id, announcement_id, user_id, read_at
)
SELECT
    id,
    announcement_id,
    user_id,
    read_at
FROM legacy.announcement_reads;

COMMIT;
