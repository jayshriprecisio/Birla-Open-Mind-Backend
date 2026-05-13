import { z } from 'zod';

const subjectGroupNameField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Subject group is required')
    .max(150, 'Subject group must be at most 150 characters')
);

export const createSubjectGroupSchema = z.object({
  subjectGroupName: subjectGroupNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateSubjectGroupSchema = z.object({
  id: z.union([z.string(), z.number()]),
  subjectGroupName: subjectGroupNameField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteSubjectGroupSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
