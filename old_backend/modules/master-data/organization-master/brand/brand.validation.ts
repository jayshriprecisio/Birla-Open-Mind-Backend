import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Brand name is required')
    .max(150, 'Brand name must be at most 150 characters')
);

const brandCodeField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Brand code is required')
    .max(50, 'Brand code must be at most 50 characters')
);

export const createBrandSchema = z.object({
  name: nameField,
  brandCode: brandCodeField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateBrandSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField.optional(),
  brandCode: brandCodeField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteBrandSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
