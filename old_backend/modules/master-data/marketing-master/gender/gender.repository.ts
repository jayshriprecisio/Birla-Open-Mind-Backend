import { pool } from '@/backend/config/db';

type GenderColumns = {
  nameColumn: 'gender' | 'name' | 'gender_name';
  mirrorColumn: 'gender_name' | null;
};

let genderColumnsPromise: Promise<GenderColumns> | null = null;

const resolveGenderColumns = async (): Promise<GenderColumns> => {
  if (!genderColumnsPromise) {
    genderColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'gender_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((r) => r.column_name));
        if (columns.has('name')) {
          return {
            nameColumn: 'name',
            mirrorColumn: columns.has('gender_name') ? 'gender_name' : null,
          } satisfies GenderColumns;
        }
        if (columns.has('gender')) {
          return {
            nameColumn: 'gender',
            mirrorColumn: columns.has('gender_name') ? 'gender_name' : null,
          } satisfies GenderColumns;
        }
        if (columns.has('gender_name')) {
          return { nameColumn: 'gender_name', mirrorColumn: null } satisfies GenderColumns;
        }
        return { nameColumn: 'name', mirrorColumn: null } satisfies GenderColumns;
      })
      .catch(() => ({ nameColumn: 'name', mirrorColumn: null }));
  }
  return genderColumnsPromise;
};

export const createGenderRepo = async (args: {
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveGenderColumns();
  const nameColumns = mirrorColumn ? `${nameColumn}, ${mirrorColumn}` : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO gender_master
      (${nameColumns}, short_form, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, $4, FALSE, $5)
    RETURNING id::text, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    `,
    [args.name, args.shortForm, args.displayOrder, args.status, args.createdBy]
  );
};

export const listGendersRepo = async () => {
  const { nameColumn } = await resolveGenderColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    FROM gender_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsGenderNameRepo = (name: string, excludeId?: string | number) =>
  resolveGenderColumns().then(({ nameColumn }) =>
    pool.query(
      `
      SELECT 1 FROM gender_master
      WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
        AND COALESCE(is_deleted, FALSE) = FALSE
        AND ($2::bigint IS NULL OR id <> $2::bigint)
      LIMIT 1`,
      [name, excludeId ?? null]
    )
  );

export const existsGenderShortRepo = (
  shortForm: string,
  excludeId?: string | number
) =>
  pool.query(
    `
    SELECT 1 FROM gender_master
    WHERE short_form IS NOT NULL
      AND LOWER(TRIM(short_form)) = LOWER(TRIM($1))
      AND COALESCE(is_deleted, FALSE) = FALSE
      AND ($2::bigint IS NULL OR id <> $2::bigint)
    LIMIT 1`,
    [shortForm, excludeId ?? null]
  );

export const updateGenderRepo = async (args: {
  id: string | number;
  name: string;
  shortForm: string | null;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveGenderColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE gender_master
    SET ${nameColumn} = $2${mirrorSet}, short_form = NULLIF(TRIM($3::text), ''), display_order = $4, status = $5, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, short_form, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.shortForm ?? '', args.displayOrder, args.status]
  );
};

export const softDeleteGenderRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE gender_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id`,
    [id]
  );

