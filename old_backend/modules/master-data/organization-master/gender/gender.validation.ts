import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z.string().min(1, 'Name is required').max(150, 'Name must be at most 150 characters')
);

const shortFormField = z
  .union([z.string(), z.literal('')])
  .optional()
  .transform((v) => {
    if (typeof v !== 'string') return undefined;
    const t = v.trim().slice(0, 20);
    return t === '' ? undefined : t;
  });

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

export const createGenderSchema = z.object({
  name: nameField,
  shortForm: shortFormField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateGenderSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  shortForm: shortFormField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteGenderSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
