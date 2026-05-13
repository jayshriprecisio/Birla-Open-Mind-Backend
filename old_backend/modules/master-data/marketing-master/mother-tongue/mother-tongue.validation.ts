import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Mother tongue name is required')
    .max(150, 'Mother tongue name must be at most 150 characters')
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

export const createMotherTongueSchema = z.object({
  name: nameField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateMotherTongueSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  displayOrder: displayOrderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteMotherTongueSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
