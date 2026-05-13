import { z } from 'zod';

const textField = (label: string, max = 150) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().min(1, `${label} is required`).max(max, `${label} must be at most ${max} characters`)
  );

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  school_name: textField('School name'),
  mid: textField('MID', 100),
  tid: textField('TID', 100),
  edc_type: textField('EDC type', 100),
  status: statusField,
});

export const updateSchema = createSchema.extend({
  id: z.union([z.string(), z.number()]),
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
