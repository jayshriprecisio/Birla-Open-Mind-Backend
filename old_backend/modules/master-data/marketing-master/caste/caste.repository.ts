import { pool } from '@/backend/config/db';

type CasteColumns = {
  nameColumn: 'caste' | 'caste_name' | 'name';
  mirrorColumn: 'caste_name' | null;
};

let casteColumnsPromise: Promise<CasteColumns> | null = null;

const resolveCasteColumns = async (): Promise<CasteColumns> => {
  if (!casteColumnsPromise) {
    casteColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'caste_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((row) => row.column_name));
        if (columns.has('caste')) {
          return {
            nameColumn: 'caste',
            mirrorColumn: columns.has('caste_name') ? 'caste_name' : null,
          } satisfies CasteColumns;
        }
        if (columns.has('caste_name')) {
          return {
            nameColumn: 'caste_name',
            mirrorColumn: null,
          } satisfies CasteColumns;
        }
        return {
          nameColumn: 'name',
          mirrorColumn: null,
        } satisfies CasteColumns;
      })
      .catch(() => ({ nameColumn: 'caste', mirrorColumn: null }));
  }
  return casteColumnsPromise;
};

export const createCasteRepo = async (args: {
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveCasteColumns();
  const nameColumns = mirrorColumn
    ? `${nameColumn}, ${mirrorColumn}`
    : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO caste_master
      (${nameColumns}, short_form, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, $4, FALSE, $5)
    RETURNING id::text, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.displayOrder, args.status, args.createdBy]
  );
};

export const listCastesRepo = async () => {
  const { nameColumn } = await resolveCasteColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    FROM caste_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsCasteNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  resolveCasteColumns().then(({ nameColumn }) =>
    pool.query(
      `
    SELECT 1 FROM caste_master
    WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
      [name, excludeId ?? null]
    )
  );

export const existsCasteShortFormRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM caste_master
    WHERE short_form IS NOT NULL
      AND LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateCasteRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveCasteColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE caste_master
    SET ${nameColumn} = $2${mirrorSet}, short_form = NULLIF(TRIM($3::text), ''), display_order = $4, status = $5, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.shortForm ?? '', args.displayOrder, args.status]
  );
};

export const softDeleteCasteRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE caste_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );

