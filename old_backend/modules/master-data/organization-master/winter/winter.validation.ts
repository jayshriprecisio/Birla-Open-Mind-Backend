import { z } from 'zod';

const statusSchema = z.enum(['ACTIVE', 'INACTIVE']);

export const createWinterSchema = z
  .object({
    winterCode: z.string().optional(),
    winterDurationDays: z.coerce
      .number()
      .int()
      .positive()
      .max(365),
    winterStartDate: z.string().min(1),
    winterEndDate: z.string().min(1),
    status: statusSchema.default('ACTIVE'),
  })
  .refine(
    (data) =>
      new Date(data.winterEndDate).getTime() >=
      new Date(data.winterStartDate).getTime(),
    {
      message:
        'Winter End Date must be on or after Winter Start Date.',
      path: ['winterEndDate'],
    }
  );

export const updateWinterSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    winterCode: z.string().optional(),
    winterDurationDays: z.coerce
      .number()
      .int()
      .positive()
      .max(365)
      .optional(),
    winterStartDate: z.string().optional(),
    winterEndDate: z.string().optional(),
    status: statusSchema.optional(),
  })
  .refine(
    (data) => {
      if (
        data.winterStartDate &&
        data.winterEndDate
      ) {
        return (
          new Date(
            data.winterEndDate
          ).getTime() >=
          new Date(
            data.winterStartDate
          ).getTime()
        );
      }
      return true;
    },
    {
      message:
        'Winter End Date must be on or after Winter Start Date.',
      path: ['winterEndDate'],
    }
  );

export const deleteWinterSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  winterCode: z.string().optional(),
});
