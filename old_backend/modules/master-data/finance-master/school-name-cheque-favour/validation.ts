import { z } from 'zod';

const textField = (label: string, max = 150) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z
      .string()
      .min(1, `${label} is required`)
      .max(max, `${label} must be at most ${max} characters`)
  );

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  cheque_in_favour_of: textField('Cheque in favour of', 150),
  fees_type: textField('Fees type', 100),
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  cheque_in_favour_of: textField('Cheque in favour of', 150),
  fees_type: textField('Fees type', 100),
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
