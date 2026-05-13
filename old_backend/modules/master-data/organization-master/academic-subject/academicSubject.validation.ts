import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Name is required')
    .max(150, 'Name must be at most 150 characters')
);

const shortFormField = z
  .union([z.string(), z.literal('')])
  .optional()
  .transform((v) => {
    if (typeof v !== 'string') return undefined;
    const t = v.trim().slice(0, 20);
    return t === '' ? undefined : t;
  });

export const createAcademicSubjectSchema = z.object({
  name: nameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateAcademicSubjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  shortForm: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteAcademicSubjectSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
