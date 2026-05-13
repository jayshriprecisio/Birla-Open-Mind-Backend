import { z } from 'zod';

const parameterNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Parameter name is required')
    .max(150, 'Parameter name must be at most 150 characters')
);

export const createParameterSchema = z.object({
  parameterName: parameterNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateParameterSchema = z.object({
  id: z.union([z.string(), z.number()]),
  parameterName: parameterNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteParameterSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
