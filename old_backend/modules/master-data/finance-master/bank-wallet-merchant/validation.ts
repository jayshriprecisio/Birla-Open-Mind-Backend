import { z } from 'zod';

const entityNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Bank / Wallet / Merchant name is required')
    .max(150, 'Name must be at most 150 characters')
);

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  entity_name: entityNameField,
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  entity_name: entityNameField,
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
