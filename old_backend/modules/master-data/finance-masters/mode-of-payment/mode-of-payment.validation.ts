import { z } from 'zod';

const requiredTrimmed = (label: string, max = 150) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z
      .string()
      .min(1, `${label} is required`)
      .max(max, `${label} must be at most ${max} characters`)
  );

const yesNoField = (label: string) =>
  z.preprocess(
    (v) => (typeof v === 'string' ? v.trim().toUpperCase() : v),
    z
      .enum(['YES', 'NO'])
      .or(z.literal('Y'))
      .or(z.literal('N'))
      .transform((v) => (v === 'Y' ? 'YES' : v === 'N' ? 'NO' : v))
      .refine((v) => v === 'YES' || v === 'NO', `${label} must be Yes or No`)
  );

const orderField = z.preprocess(
  (v) => (v === undefined || v === null || v === '' ? undefined : Number(v)),
  z
    .number('Order of preference must be a number')
    .int('Order of preference must be a whole number')
    .min(1, 'Order of preference must be at least 1')
);

export const createModeOfPaymentSchema = z.object({
  modeOfPaymentName: requiredTrimmed('Mode of payment'),
  nameOnReceipt: requiredTrimmed('Name on receipt'),
  visibleToParent: yesNoField('Visible to parent'),
  visibleToFeeCounter: yesNoField('Visible to fee counter'),
  orderOfPreference: orderField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateModeOfPaymentSchema = z.object({
  id: z.union([z.string(), z.number()]),
  modeOfPaymentName: requiredTrimmed('Mode of payment').optional(),
  nameOnReceipt: requiredTrimmed('Name on receipt').optional(),
  visibleToParent: yesNoField('Visible to parent').optional(),
  visibleToFeeCounter: yesNoField('Visible to fee counter').optional(),
  orderOfPreference: orderField.optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteModeOfPaymentSchema = z.object({
  id: z.union([z.string(), z.number()]),
});

export const listModeOfPaymentQuerySchema = z.object({
  page: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? '1' : String(v)),
    z.string().transform((s) => {
      const n = parseInt(s, 10);
      return Number.isFinite(n) && n >= 1 ? n : 1;
    })
  ),
  pageSize: z.preprocess(
    (v) => (v === undefined || v === null || v === '' ? '10' : String(v)),
    z.string().transform((s) => {
      const n = parseInt(s, 10);
      if (!Number.isFinite(n)) return 10;
      return Math.min(100, Math.max(1, n));
    })
  ),
  q: z.string().optional(),
  status: z
    .union([z.enum(['ACTIVE', 'INACTIVE']), z.literal('')])
    .optional(),
});
