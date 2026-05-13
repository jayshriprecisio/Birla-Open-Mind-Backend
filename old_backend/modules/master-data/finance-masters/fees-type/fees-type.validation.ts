import { z } from 'zod';

const feesTypeNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Fees type is required')
    .max(120, 'Fees type must be at most 120 characters')
);

export const createFeesTypeSchema = z.object({
  feesTypeName: feesTypeNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateFeesTypeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  feesTypeName: feesTypeNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteFeesTypeSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const listFeesTypeQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? '1' : String(v)),
    z.string().transform((s) => {
      const n = parseInt(s, 10);
      return Number.isFinite(n) && n >= 1 ? n : 1;
    })
  ),
  pageSize: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? '10' : String(v)),
    z.string().transform((s) => {
      const n = parseInt(s, 10);
      if (!Number.isFinite(n)) return 10;
      return Math.min(100, Math.max(1, n));
    })
  ),
  q: z.string().optional(),
  status: z
    .union([z.enum(['ACTIVE', 'INACTIVE']), z.literal('')])
    .optional(),
});
