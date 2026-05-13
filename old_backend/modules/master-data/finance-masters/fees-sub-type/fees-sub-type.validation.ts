import { z } from 'zod';

const feesSubTypeNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Fees sub type is required')
    .max(140, 'Fees sub type must be at most 140 characters')
);

export const createFeesSubTypeSchema = z.object({
  feesSubTypeName: feesSubTypeNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateFeesSubTypeSchema = z.object({
  id: z.union([z.string(), z.number()]),
  feesSubTypeName: feesSubTypeNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteFeesSubTypeSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const listFeesSubTypeQuerySchema = z.object({
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
