import { z } from 'zod';

const textField = (label: string, max = 150) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z
      .string()
      .min(1, `${label} is required`)
      .max(max, `${label} must be at most ${max} characters`)
  );

const optionalTextField = (max = 1000) =>
  z.preprocess(
    (v) => {
      if (v === undefined || v === null) return null;
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed.length ? trimmed : null;
    },
    z.string().max(max, `Description must be at most ${max} characters`).nullable()
  );

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  pdc_status: textField('PDC status', 50),
  description: optionalTextField(1000).optional().default(null),
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  pdc_status: textField('PDC status', 50),
  description: optionalTextField(1000).optional().default(null),
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
