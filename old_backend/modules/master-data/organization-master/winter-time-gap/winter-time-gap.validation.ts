import { z } from 'zod';

const statusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
]);

const timingGapValueSchema = z
  .string()
  .min(1)
  .regex(
    /^(\d{1,2}):([0-5]\d)$/,
    'Use HH:MM format (example: 00:30).'
  );

/** Field name must match `createWinterTimeGapService` / `updateWinterTimeGapService` (`timing_gap`). */
export const createWinterTimeGapSchema =
  z.object({
    timing_gap: timingGapValueSchema,
    status:
      statusSchema.default('ACTIVE'),
  });

export const updateWinterTimeGapSchema =
  z.object({
    id: z.union([
      z.string(),
      z.number(),
    ]),
    timing_gap: timingGapValueSchema.optional(),
    status: statusSchema.optional(),
  });

export const deleteWinterTimeGapSchema =
  z.object({
    id: z.union([
      z.string(),
      z.number(),
    ]),
  });
