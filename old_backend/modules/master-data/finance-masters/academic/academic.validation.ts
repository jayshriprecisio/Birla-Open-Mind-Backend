import { z } from 'zod';

const academicNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Academic is required')
    .max(180, 'Academic must be at most 180 characters')
);

export const createAcademicSchema = z.object({
  academicName: academicNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateAcademicSchema = z.object({
  id: z.union([z.string(), z.number()]),
  academicName: academicNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteAcademicSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const listAcademicQuerySchema = z.object({
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
