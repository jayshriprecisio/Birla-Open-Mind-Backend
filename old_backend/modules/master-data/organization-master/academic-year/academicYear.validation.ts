import { z } from 'zod';

const nameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Name is required')
    .max(150, 'Name must be at most 150 characters')
);

const shortFormField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Shortform is required')
    .max(20, 'Shortform must be at most 20 characters')
);

export const createAcademicYearSchema = z.object({
  name: nameField,
  shortForm: shortFormField,
  shortForm2Digit: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateAcademicYearSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: nameField,
  shortForm: shortFormField,
  shortForm2Digit: shortFormField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteAcademicYearSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
