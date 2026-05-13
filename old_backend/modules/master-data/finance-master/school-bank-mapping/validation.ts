import { z } from 'zod';

const textField = (label: string, max = 200) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z.string().min(1, `${label} is required`).max(max, `${label} must be at most ${max} characters`)
  );

const statusField = z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE');

export const createSchema = z.object({
  school_name: textField('School name', 150),
  bank_name: textField('Bank name', 150),
  account_number: textField('Account number', 50),
  ifsc_code: textField('IFSC code', 20),
  account_type: textField('Account type', 50),
  status: statusField,
});

export const updateSchema = z.object({
  id: z.union([z.string(), z.number()]),
  school_name: textField('School name', 150),
  bank_name: textField('Bank name', 150),
  account_number: textField('Account number', 50),
  ifsc_code: textField('IFSC code', 20),
  account_type: textField('Account type', 50),
  status: statusField.optional(),
});

export const deleteSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
