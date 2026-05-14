require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const schemaPath = path.join(__dirname, '..', '..', 'schema.sql');

/**
 * schema.sql lists many CREATE TABLE ... DEFAULT nextval('..._id_seq') before the matching
 * CREATE SEQUENCE. PostgreSQL resolves regclass at DDL time, so sequences must exist first.
 * Hoist stripped CREATE SEQUENCE bodies before the first CREATE TABLE, then append
 * ALTER SEQUENCE ... OWNED BY before seed INSERTs (table + column must exist for OWNED BY).
 */
function prepareSchemaSqlForSeed(rawSql) {
  const lines = rawSql.split(/\r?\n/);
  const hoisted = [];
  const ownedByAlters = [];
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const cm = line.match(/^CREATE SEQUENCE (public\.\w+)\s*$/);
    if (!cm) {
      out.push(line);
      i += 1;
      continue;
    }

    const seqName = cm[1];
    const seqLines = [line];
    i += 1;
    let foundOwned = false;

    while (i < lines.length) {
      const li = lines[i];
      const obm = li.match(/^\s*OWNED BY\s+(.+);\s*$/);
      if (obm) {
        const lastBody = seqLines[seqLines.length - 1];
        if (/\bCACHE\s+1\s*$/.test(lastBody) && !/;\s*$/.test(lastBody)) {
          seqLines[seqLines.length - 1] = lastBody.replace(/\s*$/, ';');
        } else if (!/;\s*$/.test(lastBody)) {
          seqLines.push('    CACHE 1;');
        }
        hoisted.push(seqLines.join('\n'));
        ownedByAlters.push(`ALTER SEQUENCE ${seqName} OWNED BY ${obm[1].trim()};`);
        foundOwned = true;
        i += 1;
        break;
      }
      seqLines.push(li);
      i += 1;
    }

    if (!foundOwned) {
      throw new Error(
        `schema.sql: CREATE SEQUENCE ${seqName} has no OWNED BY line; cannot reorder for seed.`
      );
    }
  }

  const middle = out.join('\n');
  if (hoisted.length === 0) {
    return rawSql;
  }

  let insertSeqAt = middle.search(/\nCREATE TABLE public\.\w+\s*\(/);
  if (insertSeqAt === -1) {
    insertSeqAt = middle.search(/^CREATE TABLE public\.\w+\s*\(/m);
  }
  if (insertSeqAt === -1) {
    throw new Error('schema.sql: no CREATE TABLE found; cannot hoist sequences.');
  }
  insertSeqAt += 1;

  const hoistedBlock = `${hoisted.join('\n\n')}\n\n`;
  let merged = middle.slice(0, insertSeqAt) + hoistedBlock + middle.slice(insertSeqAt);

  let attachOwnedAt = merged.search(/\n-- seed data\n/);
  if (attachOwnedAt === -1) {
    attachOwnedAt = merged.search(/\nINSERT INTO public\./);
  }
  const ownedBlock = `\n${ownedByAlters.join('\n')}\n`;
  if (attachOwnedAt !== -1) {
    merged = merged.slice(0, attachOwnedAt) + ownedBlock + merged.slice(attachOwnedAt);
  } else {
    merged += ownedBlock;
  }

  return merged;
}

/**
 * Applies schema.sql from the project root.
 * Intended for `npm run seed` only (not run on server start).
 *
 * If public.schools already exists, skips (safe to run twice).
 * Set RESET_DB_SCHEMA=1 or true to DROP SCHEMA public CASCADE first, then apply.
 * Reset + schema.sql run in one transaction (rolled back on any failure).
 * Sequences are hoisted before tables at apply time so DEFAULT nextval(...) resolves.
 */
async function applySchema() {
  if (!fs.existsSync(schemaPath)) {
    console.error('schema.sql not found in project root.');
    process.exit(1);
  }

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();

  try {
    const resetSchema =
      process.env.RESET_DB_SCHEMA === '1' || process.env.RESET_DB_SCHEMA === 'true';

    const { rows } = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'schools'
      ) AS exists
    `);

    if (rows[0].exists && !resetSchema) {
      console.log('Database already initialized (public.schools exists); skipping schema.sql');
      return;
    }

    const rawSql = fs.readFileSync(schemaPath, 'utf8');
    const sql = prepareSchemaSqlForSeed(rawSql);

    await client.query('BEGIN');
    try {
      if (resetSchema) {
        await client.query(
          'DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;'
        );
        await client.query('GRANT ALL ON SCHEMA public TO public;');
        console.log('RESET_DB_SCHEMA: recreated empty public schema');
      }
      await client.query(sql);
      await client.query('COMMIT');
      console.log('Applied schema.sql (tables, indexes, constraints, and seed data)');
    } catch (err) {
      try {
        await client.query('ROLLBACK');
      } catch {
        // connection may already be aborted
      }
      throw err;
    }
  } finally {
    await client.end();
  }
}

module.exports = { applySchema, prepareSchemaSqlForSeed };

if (require.main === module) {
  applySchema()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
