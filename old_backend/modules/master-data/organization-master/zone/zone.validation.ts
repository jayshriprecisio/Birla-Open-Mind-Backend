import { z } from 'zod';

const zoneNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Zone name is required')
    .max(100, 'Zone name must be at most 100 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Short form is required')
    .max(20, 'Short form must be at most 20 characters')
);

export const createZoneSchema = z.object({
  zoneName: zoneNameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateZoneSchema = z.object({
  id: z.union([z.string(), z.number()]),
  zoneName: zoneNameField.optional(),
  shortForm: shortFormField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteZoneSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
