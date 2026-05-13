import { z } from 'zod';

const textField = (label: string, max = 200) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().min(1, `${label} is required`).max(max, `${label} must be at most ${max} characters`)
  );

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');
const environmentField = z.enum(['TEST', 'PROD']);

export const createSchema = z.object({
  school_name: textField('School name', 150),
  merchant_key: textField('Merchant key', 150),
  merchant_salt: textField('Merchant salt', 150),
  environment: environmentField,
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  school_name: textField('School name', 150),
  merchant_key: textField('Merchant key', 150),
  merchant_salt: textField('Merchant salt', 150),
  environment: environmentField,
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
