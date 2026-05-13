import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Caste name is required')
    .max(150, 'Caste name must be at most 150 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .max(20, 'Short form must be at most 20 characters')
    .optional()
    .transform((v) => {
      if (typeof v !== 'string') return undefined;
      return v.trim() === '' ? undefined : v;
    })
);

const displayOrderField = z.preprocess((v) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'string') {
    const t = v.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? n : v;
  }
  return v;
}, z.number().int('Order must be an integer').optional());

export const createCasteSchema = z.object({
  name: nameField,
  shortForm: shortFormField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateCasteSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  shortForm: shortFormField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteCasteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

