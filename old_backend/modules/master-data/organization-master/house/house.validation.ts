import { z } from 'zod';

const houseNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'House name is required')
    .max(100, 'House name must be at most 100 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Short form is required')
    .max(20, 'Short form must be at most 20 characters')
);

export const createHouseSchema = z.object({
  houseName: houseNameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateHouseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  houseName: houseNameField.optional(),
  shortForm: shortFormField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteHouseSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
