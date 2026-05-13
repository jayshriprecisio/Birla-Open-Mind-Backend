import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Sub caste name is required')
    .max(150, 'Sub caste name must be at most 150 characters')
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

export const createSubCasteSchema = z.object({
  name: nameField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateSubCasteSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteSubCasteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

