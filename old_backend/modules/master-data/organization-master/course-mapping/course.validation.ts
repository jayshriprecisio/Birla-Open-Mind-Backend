import { z } from 'zod';

export const createCourseSchema = z.object({
  courseName: z.string().min(2),
  courseCode: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updateCourseSchema = z.object({
  id: z.union([z.string(), z.number()]),
  courseName: z.string().min(2).optional(),
  courseCode: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteCourseSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  courseCode: z.string().optional(),
});
