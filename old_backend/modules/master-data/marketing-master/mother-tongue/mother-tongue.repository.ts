import { pool } from '@/backend/config/db';

type MotherTongueColumns = {
  nameColumn: 'mother_tongue' | 'mother_tongue_name' | 'name';
  mirrorColumn: 'mother_tongue_name' | null;
};

let motherTongueColumnsPromise: Promise<MotherTongueColumns> | null = null;

const resolveMotherTongueColumns = async (): Promise<MotherTongueColumns> => {
  if (!motherTongueColumnsPromise) {
    motherTongueColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'mother_tongue_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((r) => r.column_name));
        if (columns.has('mother_tongue')) {
          return {
            nameColumn: 'mother_tongue',
            mirrorColumn: columns.has('mother_tongue_name')
              ? 'mother_tongue_name'
              : null,
          } satisfies MotherTongueColumns;
        }
        if (columns.has('name')) {
          return {
            nameColumn: 'name',
            mirrorColumn: columns.has('mother_tongue_name')
              ? 'mother_tongue_name'
              : null,
          } satisfies MotherTongueColumns;
        }
        if (columns.has('mother_tongue_name')) {
          return {
            nameColumn: 'mother_tongue_name',
            mirrorColumn: null,
          } satisfies MotherTongueColumns;
        }
        return {
          nameColumn: 'mother_tongue',
          mirrorColumn: null,
        } satisfies MotherTongueColumns;
      })
      .catch(() => ({ nameColumn: 'mother_tongue', mirrorColumn: null }));
  }
  return motherTongueColumnsPromise;
};

export const createMotherTongueRepo = async (args: {
  name: string;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveMotherTongueColumns();
  const nameColumns = mirrorColumn ? `${nameColumn}, ${mirrorColumn}` : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO mother_tongue_master
      (${nameColumns}, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, FALSE, $4)
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.name, args.displayOrder, args.status, args.createdBy]
  );
};

export const listMotherTonguesRepo = async () => {
  const { nameColumn } = await resolveMotherTongueColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, display_order, status, created_at, updated_at
    FROM mother_tongue_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsMotherTongueNameRepo = (
  name: string,
  excludeId?: string | number
) =>
  resolveMotherTongueColumns().then(({ nameColumn }) =>
    pool.query(
      `
      SELECT 1 FROM mother_tongue_master
      WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
        AND COALESCE(is_deleted, FALSE) = FALSE
        AND ($2::bigint IS NULL OR id <> $2::bigint)
      LIMIT 1
      `,
      [name, excludeId ?? null]
    )
  );

export const updateMotherTongueRepo = async (args: {
  id: string | number;
  name: string;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveMotherTongueColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE mother_tongue_master
    SET ${nameColumn} = $2${mirrorSet}, display_order = $3, status = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.displayOrder, args.status]
  );
};

export const softDeleteMotherTongueRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE mother_tongue_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );
