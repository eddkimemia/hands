-- ============================================================
--  Ishara Charity — one-time rebrand for EXISTING databases
--
--  Run this against your PRODUCTION database (e.g. the hosted
--  Postgres behind your Vercel deployment) if it was seeded or
--  edited before the Ishara Charity rebrand.
--
--  Usage:
--    psql "$DATABASE_URL" -f scripts/rebrand-production.sql
--  or paste into your provider's SQL console.
-- ============================================================

UPDATE content
   SET data = REPLACE(data::text, 'Hands of Hope Foundation', 'Ishara Charity')::jsonb;

UPDATE content
   SET data = REPLACE(data::text, 'Hands of Hope', 'Ishara Charity')::jsonb;

UPDATE content
   SET data = REPLACE(data::text, 'handsofhopekenya', 'isharacharity')::jsonb
 WHERE data::text LIKE '%handsofhopekenya%';

UPDATE content
   SET data = REPLACE(data::text, '@handsofhope.org', '@isharacharity.org')::jsonb
 WHERE data::text LIKE '%@handsofhope.org%';

-- Verify nothing old remains:
SELECT collection, count(*)
  FROM content
 WHERE data::text ILIKE '%hands of hope%'
    OR data::text ILIKE '%handsofhope%'
 GROUP BY collection;
