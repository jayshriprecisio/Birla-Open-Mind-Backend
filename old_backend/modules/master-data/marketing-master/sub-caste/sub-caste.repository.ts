import { pool } from '@/backend/config/db';

type SubCasteColumns = {
  nameColumn: 'sub_caste' | 'sub_caste_name' | 'name';
  mirrorColumn: 'sub_caste_name' | null;
};

let subCasteColumnsPromise: Promise<SubCasteColumns> | null = null;

const resolveSubCasteColumns = async (): Promise<SubCasteColumns> => {
  if (!subCasteColumnsPromise) {
    subCasteColumnsPromise = pool
      .query<{ column_name: string }>(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'sub_caste_master'
        `
      )
      .then((result) => {
        const columns = new Set(result.rows.map((r) => r.column_name));
        if (columns.has('sub_caste')) {
          return {
            nameColumn: 'sub_caste',
            mirrorColumn: columns.has('sub_caste_name') ? 'sub_caste_name' : null,
          } satisfies SubCasteColumns;
        }
        if (columns.has('sub_caste_name')) {
          return { nameColumn: 'sub_caste_name', mirrorColumn: null } satisfies SubCasteColumns;
        }
        return { nameColumn: 'name', mirrorColumn: null } satisfies SubCasteColumns;
      })
      .catch(() => ({ nameColumn: 'sub_caste', mirrorColumn: null }));
  }
  return subCasteColumnsPromise;
};

export const createSubCasteRepo = async (args: {
  name: string;
  displayOrder: number | null;
  status: string;
  createdBy: number | null;
}) => {
  const { nameColumn, mirrorColumn } = await resolveSubCasteColumns();
  const nameColumns = mirrorColumn ? `${nameColumn}, ${mirrorColumn}` : nameColumn;
  const nameValues = mirrorColumn ? '$1, $1' : '$1';
  return pool.query(
    `
    INSERT INTO sub_caste_master
      (${nameColumns}, display_order, status, is_deleted, created_by)
    VALUES (${nameValues}, $2, $3, FALSE, $4)
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.name, args.displayOrder, args.status, args.createdBy]
  );
};

export const listSubCastesRepo = async () => {
  const { nameColumn } = await resolveSubCasteColumns();
  return pool.query(`
    SELECT id::text AS id, ${nameColumn} AS name, display_order, status, created_at, updated_at
    FROM sub_caste_master
    WHERE COALESCE(is_deleted, FALSE) = FALSE
    ORDER BY id ASC`);
};

export const existsSubCasteNameRepo = (name: string, excludeId?: string | number) =>
  resolveSubCasteColumns().then(({ nameColumn }) =>
    pool.query(
      `
      SELECT 1 FROM sub_caste_master
      WHERE LOWER(TRIM(${nameColumn})) = LOWER(TRIM($1))
        AND COALESCE(is_deleted, FALSE) = FALSE
        AND ($2::bigint IS NULL OR id <> $2::bigint)
      LIMIT 1
      `,
      [name, excludeId ?? null]
    )
  );

export const updateSubCasteRepo = async (args: {
  id: string | number;
  name: string;
  displayOrder: number | null;
  status: string;
}) => {
  const { nameColumn, mirrorColumn } = await resolveSubCasteColumns();
  const mirrorSet = mirrorColumn ? `, ${mirrorColumn} = $2` : '';
  return pool.query(
    `
    UPDATE sub_caste_master
    SET ${nameColumn} = $2${mirrorSet}, display_order = $3, status = $4, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id::text, ${nameColumn} AS name, display_order, status, created_at, updated_at
    `,
    [args.id, args.name, args.displayOrder, args.status]
  );
};

export const softDeleteSubCasteRepo = (id: string | number) =>
  pool.query(
    `
    UPDATE sub_caste_master
    SET is_deleted = TRUE, updated_at = NOW()
    WHERE id = $1::bigint AND COALESCE(is_deleted, FALSE) = FALSE
    RETURNING id
    `,
    [id]
  );

