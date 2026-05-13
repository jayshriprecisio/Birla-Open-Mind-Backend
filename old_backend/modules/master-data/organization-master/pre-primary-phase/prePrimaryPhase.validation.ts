import { z } from 'zod';

const phaseNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Phase name is required')
    .max(150, 'Phase name must be at most 150 characters')
);

export const createPrePrimaryPhaseSchema = z.object({
  phaseName: phaseNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updatePrePrimaryPhaseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  phaseName: phaseNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deletePrePrimaryPhaseSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
