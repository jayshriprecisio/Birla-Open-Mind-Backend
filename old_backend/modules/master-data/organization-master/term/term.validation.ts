import { z } from 'zod';

const termNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Term name is required')
    .max(100, 'Term name must be at most 100 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Short form is required')
    .max(20, 'Short form must be at most 20 characters')
);

export const createTermSchema = z.object({
  termName: termNameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateTermSchema = z.object({
  id: z.union([z.string(), z.number()]),
  termName: termNameField.optional(),
  shortForm: shortFormField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteTermSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
