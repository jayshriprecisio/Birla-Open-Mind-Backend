import { z } from 'zod';

const transactionTypeField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Transaction type is required')
    .max(150, 'Transaction type must be at most 150 characters')
);

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  transaction_type: transactionTypeField,
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  transaction_type: transactionTypeField,
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
