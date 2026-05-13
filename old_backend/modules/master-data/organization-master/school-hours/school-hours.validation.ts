import { z } from 'zod';

const statusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const createSchoolHoursSchema = z.object({
  durationCode: z.string().optional(),
  durationName: z.string().min(2),
  totalMinutes: z
    .number()
    .int()
    .positive()
    .max(1440),
  status: statusSchema.default('ACTIVE'),
});

export const updateSchoolHoursSchema = z.object({
  id: z.union([z.string(), z.number()]),
  durationCode: z.string().optional(),
  durationName: z.string().min(2).optional(),
  totalMinutes: z
    .number()
    .int()
    .positive()
    .max(1440)
    .optional(),
  status: statusSchema.optional(),
});

export const deleteSchoolHoursSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  durationCode: z.string().optional(),
});
