import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Blood group is required')
    .max(30, 'Blood group must be at most 30 characters')
);

export const createBloodGroupSchema = z.object({
  name: nameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateBloodGroupSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteBloodGroupSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
