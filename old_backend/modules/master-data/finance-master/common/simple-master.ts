import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { pool } from '@/backend/config/db';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';

type FieldConfig = {
  db: string;
  required?: boolean;
  max?: number;
};

type SimpleMasterConfig = {
  table: string;
  entityLabel: string;
  fields: FieldConfig[];
  uniqueOn: string[];
};

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

const textSchema = (label: string, max: number, required: boolean) => {
  const schema = z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().max(max, `${label} must be at most ${max} characters`)
  );
  return required ? schema.min(1, `${label} is required`) : schema.optional().default('');
};

const toUserField = (userId: string) =>
  String(userId ?? '').trim().slice(0, 50) || null;

const toTitle = (raw: string) =>
  raw
    .split('_')
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p))
    .join(' ');

export function buildSimpleMasterControllers(config: SimpleMasterConfig) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of config.fields) {
    shape[f.db] = textSchema(toTitle(f.db), f.max ?? 200, f.required ?? false);
  }
  const createSchema = z.object({ ...shape, status: statusField });
  const updateSchema = z.object({
    id: z.union([z.string(), z.number()]),
    ...shape,
    status: statusField.optional(),
  });
  const deleteSchema = z.object({ id: z.union([z.string(), z.number()]) });

  const selectCols = config.fields.map((f) => f.db).join(', ');
  const returningCols = `id::text AS id, ${selectCols}, status, created_at, updated_at`;

  const listController = async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);
      const r = await pool.query(
        `SELECT ${returningCols}
         FROM ${config.table}
         WHERE COALESCE(is_deleted, FALSE) = FALSE
         ORDER BY id ASC`
      );
      return NextResponse.json({ success: true, data: r.rows });
    } catch (error: unknown) {
      return NextResponse.json(
        { success: false, message: formatApiError(error) },
        { status: 401 }
      );
    }
  };

  const duplicateWhere = config.uniqueOn
    .map((c, i) => `LOWER(TRIM(${c})) = LOWER(TRIM($${i + 1}))`)
    .join(' AND ');

  const checkDuplicate = (data: Record<string, unknown>, excludeId?: string | number) =>
    pool.query(
      `SELECT 1
       FROM ${config.table}
       WHERE ${duplicateWhere}
         AND COALESCE(is_deleted, FALSE) = FALSE
         AND ($${config.uniqueOn.length + 1}::bigint IS NULL OR id <> $${
           config.uniqueOn.length + 1
         }::bigint)
       LIMIT 1`,
      [...config.uniqueOn.map((c) => String(data[c] ?? '').trim()), excludeId ?? null]
    );

  const createController = async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);
      const body = (await req.json()) as Record<string, unknown>;
      const v = createSchema.parse({
        ...body,
        status: typeof body.status === 'string' ? body.status.toUpperCase() : body.status,
      });
      if ((await checkDuplicate(v)).rowCount) {
        throw new Error(`${config.entityLabel} already exists.`);
      }
      const cols = [...config.fields.map((f) => f.db), 'status', 'is_deleted', 'created_by'];
      const values = config.fields.map((f) => String(v[f.db] ?? '').trim());
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const r = await pool.query(
        `INSERT INTO ${config.table} (${cols.join(', ')})
         VALUES (${placeholders})
         RETURNING ${returningCols}`,
        [...values, v.status ?? 'ACTIVE', false, toUserField(user.id)]
      );
      return NextResponse.json({
        success: true,
        data: r.rows[0],
        message: `${config.entityLabel} created successfully`,
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { success: false, message: formatApiError(error) },
        { status: 400 }
      );
    }
  };

  const updateController = async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);
      const body = (await req.json()) as Record<string, unknown>;
      const v = updateSchema.parse({
        ...body,
        status: typeof body.status === 'string' ? body.status.toUpperCase() : body.status,
      });
      if ((await checkDuplicate(v, v.id)).rowCount) {
        throw new Error(`${config.entityLabel} already exists.`);
      }
      const updates = [...config.fields.map((f, i) => `${f.db} = $${i + 2}`), `status = $${
        config.fields.length + 2
      }`, `updated_by = $${config.fields.length + 3}`, 'updated_at = NOW()'];
      const values = config.fields.map((f) => String(v[f.db] ?? '').trim());
      const r = await pool.query(
        `UPDATE ${config.table}
         SET ${updates.join(', ')}
         WHERE id = $1::bigint
           AND COALESCE(is_deleted, FALSE) = FALSE
         RETURNING ${returningCols}`,
        [v.id, ...values, v.status ?? 'ACTIVE', toUserField(user.id)]
      );
      if (!r.rows[0]) {
        return NextResponse.json(
          { success: false, message: 'Record not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: r.rows[0],
        message: `${config.entityLabel} updated successfully`,
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { success: false, message: formatApiError(error) },
        { status: 400 }
      );
    }
  };

  const deleteController = async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);
      const body = await req.json();
      const v = deleteSchema.parse(body);
      const r = await pool.query(
        `UPDATE ${config.table}
         SET is_deleted = TRUE, updated_at = NOW()
         WHERE id = $1::bigint
           AND COALESCE(is_deleted, FALSE) = FALSE
         RETURNING id`,
        [v.id]
      );
      if (!r.rowCount) {
        return NextResponse.json(
          { success: false, message: 'Record not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        message: `${config.entityLabel} deleted successfully`,
      });
    } catch (error: unknown) {
      return NextResponse.json(
        { success: false, message: formatApiError(error) },
        { status: 400 }
      );
    }
  };

  return { listController, createController, updateController, deleteController };
}
