import { z } from 'zod';

const batchNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Batch name is required')
    .max(100, 'Batch name must be at most 100 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Short form is required')
    .max(20, 'Short form must be at most 20 characters')
);

export const createBatchSchema = z.object({
  batchName: batchNameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateBatchSchema = z.object({
  id: z.union([z.string(), z.number()]),
  batchName: batchNameField.optional(),
  shortForm: shortFormField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteBatchSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
