import { z } from 'zod';

const feesCategoryNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Fees category is required')
    .max(160, 'Fees category must be at most 160 characters')
);

export const createFeesCategorySchema = z.object({
  feesCategoryName: feesCategoryNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateFeesCategorySchema = z.object({
  id: z.union([z.string(), z.number()]),
  feesCategoryName: feesCategoryNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteFeesCategorySchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const listFeesCategoryQuerySchema = z.object({
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
