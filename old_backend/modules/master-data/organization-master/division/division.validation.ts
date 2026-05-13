import { z } from 'zod';

/** Trim + length; rejects whitespace-only names */
const divisionNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Division name is required')
    .max(100, 'Division name must be at most 100 characters')
);

export const createDivisionSchema = z.object({
  divisionName: divisionNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateDivisionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  divisionName: divisionNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteDivisionSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
