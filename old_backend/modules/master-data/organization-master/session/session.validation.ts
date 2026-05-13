import { z } from 'zod';

const sessionNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Session name is required')
    .max(100, 'Session name must be at most 100 characters')
);

export const createSessionSchema = z.object({
  sessionName: sessionNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateSessionSchema = z.object({
  id: z.union([z.string(), z.number()]),
  sessionName: sessionNameField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteSessionSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
