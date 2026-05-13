import { pool } from '@/backend/config/db';

type ReligionColumns = {
  nameColumn: 'religion' | 'religion_name' | 'name';
  mirrorColumn: 'religion_name' | null;
};

let religionColumnsPromise: Promise<ReligionColumns> | null = null;

const resolveReligionColumns = async (): Promise<ReligionColumns> => {
  if (!religionColumnsPromise) {
    religionColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'religion_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((r) => r.column_name));
        if (columns.has('religion')) {
          return {
            nameColumn: 'religion',
            mirrorColumn: columns.has('religion_name') ? 'religion_name' : null,
          } satisfies ReligionColumns;
        }
        if (columns.has('name')) {
          return {
            nameColumn: 'name',
            mirrorColumn: columns.has('religion_name') ? 'religion_name' : null,
          } satisfies ReligionColumns;
        }
        if (columns.has('religion_name')) {
          return { nameColumn: 'religion_name', mirrorColumn: null } satisfies ReligionColumns;
        }
        return { nameColumn: 'religion', mirrorColumn: null } satisfies ReligionColumns;
      })
      .catch(() => ({ nameColumn: 'religion', mirrorColumn: null }));
  }
  return religionColumnsPromise;
};

export const createReligionRepo = async (args: {
  name: string;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveReligionColumns();
  const nameColumns = mirrorColumn ? `${nameColumn}, ${mirrorColumn}` : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO religion_master
      (${nameColumns}, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, FALSE, $4)
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.name, args.displayOrder, args.status, args.createdBy]
  );
};

export const listReligionsRepo = async () => {
  const { nameColumn } = await resolveReligionColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, display_order, status, created_at, updated_at
    FROM religion_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsReligionNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  resolveReligionColumns().then(({ nameColumn }) =>
    pool.query(
      `
      SELECT 1 FROM religion_master
      WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
        AND COALESCE(is_deleted, FALSE) = FALSE
        AND ($2::bigint IS NULL OR id <> $2::bigint)
      LIMIT 1
      `,
      [name, excludeId ?? null]
    )
  );

export const updateReligionRepo = async (args: {
  id: string | number;
  name: string;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveReligionColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE religion_master
    SET ${nameColumn} = $2${mirrorSet}, display_order = $3, status = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.displayOrder, args.status]
  );
};

export const softDeleteReligionRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE religion_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );

