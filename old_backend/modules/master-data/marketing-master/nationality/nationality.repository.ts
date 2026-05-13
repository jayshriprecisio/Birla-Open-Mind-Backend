import { pool } from '@/backend/config/db';

type NationalityColumns = {
  nameColumn: 'nationality' | 'nationality_name' | 'name';
  mirrorColumn: 'nationality_name' | null;
};

let nationalityColumnsPromise: Promise<NationalityColumns> | null = null;

const resolveNationalityColumns = async (): Promise<NationalityColumns> => {
  if (!nationalityColumnsPromise) {
    nationalityColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'nationality_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((r) => r.column_name));
        if (columns.has('nationality')) {
          return {
            nameColumn: 'nationality',
            mirrorColumn: columns.has('nationality_name')
              ? 'nationality_name'
              : null,
          } satisfies NationalityColumns;
        }
        if (columns.has('name')) {
          return {
            nameColumn: 'name',
            mirrorColumn: columns.has('nationality_name')
              ? 'nationality_name'
              : null,
          } satisfies NationalityColumns;
        }
        if (columns.has('nationality_name')) {
          return {
            nameColumn: 'nationality_name',
            mirrorColumn: null,
          } satisfies NationalityColumns;
        }
        return { nameColumn: 'nationality', mirrorColumn: null } satisfies NationalityColumns;
      })
      .catch(() => ({ nameColumn: 'nationality', mirrorColumn: null }));
  }
  return nationalityColumnsPromise;
};

export const createNationalityRepo = async (args: {
  name: string;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveNationalityColumns();
  const nameColumns = mirrorColumn ? `${nameColumn}, ${mirrorColumn}` : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO nationality_master
      (${nameColumns}, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, FALSE, $4)
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.name, args.displayOrder, args.status, args.createdBy]
  );
};

export const listNationalitiesRepo = async () => {
  const { nameColumn } = await resolveNationalityColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, display_order, status, created_at, updated_at
    FROM nationality_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsNationalityNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  resolveNationalityColumns().then(({ nameColumn }) =>
    pool.query(
      `
      SELECT 1 FROM nationality_master
      WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
        AND COALESCE(is_deleted, FALSE) = FALSE
        AND ($2::bigint IS NULL OR id <> $2::bigint)
      LIMIT 1
      `,
      [name, excludeId ?? null]
    )
  );

export const updateNationalityRepo = async (args: {
  id: string | number;
  name: string;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveNationalityColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE nationality_master
    SET ${nameColumn} = $2${mirrorSet}, display_order = $3, status = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.displayOrder, args.status]
  );
};

export const softDeleteNationalityRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE nationality_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );
