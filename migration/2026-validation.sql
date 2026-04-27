-- ============================================================================
-- Ponto cutover — validação pós-migração
-- ----------------------------------------------------------------------------
-- Execute APÓS 2026-cutover.sql. Tolerância esperada: zero diferença em counts
-- e sum(balance_minutes). Qualquer divergência é motivo de rollback.
--
-- Como rodar:
--   psql $DATABASE_URL -f migration/2026-validation.sql
--
-- Saída: tabela `validation_report` (CTE) listando linhas por tabela com
-- (legacy_count, public_count, diff). Diff != 0 ⇒ investigar antes do go-live.
-- ============================================================================

WITH
counts AS (
    SELECT 'work_schedules'    AS table_name,
           (SELECT COUNT(*) FROM legacy.work_schedules)    AS legacy_count,
           (SELECT COUNT(*) FROM public.work_schedules)    AS public_count
    UNION ALL
    SELECT 'holidays',
           (SELECT COUNT(*) FROM legacy.holidays),
           (SELECT COUNT(*) FROM public.holidays)
    UNION ALL
    SELECT 'users',
           (SELECT COUNT(*) FROM legacy.users),
           (SELECT COUNT(*) FROM public.users)
    UNION ALL
    SELECT 'work_days',
           (SELECT COUNT(*) FROM legacy.work_days),
           (SELECT COUNT(*) FROM public.work_days)
    UNION ALL
    SELECT 'time_entries',
           (SELECT COUNT(*) FROM legacy.time_entries),
           (SELECT COUNT(*) FROM public.time_entries)
    UNION ALL
    SELECT 'hour_bank',
           (SELECT COUNT(*) FROM legacy.hour_bank),
           (SELECT COUNT(*) FROM public.hour_bank)
    UNION ALL
    SELECT 'announcements',
           (SELECT COUNT(*) FROM legacy.announcements),
           (SELECT COUNT(*) FROM public.announcements)
    UNION ALL
    SELECT 'announcement_reads',
           (SELECT COUNT(*) FROM legacy.announcement_reads),
           (SELECT COUNT(*) FROM public.announcement_reads)
)
SELECT
    table_name,
    legacy_count,
    public_count,
    public_count - legacy_count AS diff
FROM counts
ORDER BY table_name;

-- ----------------------------------------------------------------------------
-- Sanity sums (devem bater exatamente)
-- ----------------------------------------------------------------------------
SELECT
    'hour_bank.balance_minutes' AS metric,
    (SELECT COALESCE(SUM(balance_minutes), 0) FROM legacy.hour_bank) AS legacy_sum,
    (SELECT COALESCE(SUM(balance_minutes), 0) FROM public.hour_bank) AS public_sum
UNION ALL
SELECT
    'work_days.worked_minutes',
    (SELECT COALESCE(SUM(worked_minutes),  0) FROM legacy.work_days),
    (SELECT COALESCE(SUM(worked_minutes),  0) FROM public.work_days)
UNION ALL
SELECT
    'work_days.overtime_minutes',
    (SELECT COALESCE(SUM(overtime_minutes), 0) FROM legacy.work_days),
    (SELECT COALESCE(SUM(overtime_minutes), 0) FROM public.work_days);

-- ----------------------------------------------------------------------------
-- FK integrity spot-checks
-- ----------------------------------------------------------------------------
SELECT
    'orphan_work_days' AS check_name,
    COUNT(*) AS offenders
FROM public.work_days wd
LEFT JOIN public.users u ON u.id = wd.user_id
WHERE u.id IS NULL
UNION ALL
SELECT
    'orphan_time_entries',
    COUNT(*)
FROM public.time_entries te
LEFT JOIN public.work_days wd ON wd.id = te.work_day_id
WHERE wd.id IS NULL
UNION ALL
SELECT
    'orphan_announcement_reads',
    COUNT(*)
FROM public.announcement_reads ar
LEFT JOIN public.announcements a ON a.id = ar.announcement_id
WHERE a.id IS NULL
UNION ALL
SELECT
    'users_with_invalid_work_schedule',
    COUNT(*)
FROM public.users u
LEFT JOIN public.work_schedules ws ON ws.id = u.work_schedule_id
WHERE u.work_schedule_id IS NOT NULL AND ws.id IS NULL;
