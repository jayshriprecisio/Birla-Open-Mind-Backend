import { z } from 'zod';

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

const timeString = z
  .string()
  .regex(
    timeRegex,
    'Time must be in HH:mm or HH:mm:ss format'
  );

export const createSchoolStartTimingSchema =
  z
    .object({
      shiftName: z.string().min(2),
      startTime: timeString,
      endTime: timeString,
      timingCode: z.string().optional(),
      status: z
        .enum(['ACTIVE', 'INACTIVE'])
        .default('ACTIVE'),
    })
    .refine(
      (data) => data.endTime > data.startTime,
      {
        message:
          'End time must be after start time',
        path: ['endTime'],
      }
    );

export const updateSchoolStartTimingSchema =
  z
    .object({
      id: z.union([z.number(), z.string()]),
      shiftName: z.string().min(2).optional(),
      startTime: timeString.optional(),
      endTime: timeString.optional(),
      timingCode: z.string().optional(),
      status: z
        .enum(['ACTIVE', 'INACTIVE'])
        .optional(),
    })
    .refine(
      (data) => {
        if (
          data.startTime &&
          data.endTime
        ) {
          return (
            data.endTime >
            data.startTime
          );
        }
        return true;
      },
      {
        message:
          'End time must be after start time',
        path: ['endTime'],
      }
    );

export const deleteSchoolStartTimingSchema =
  z.object({
    id: z
      .union([z.number(), z.string()])
      .optional(),
    timingCode: z.string().optional(),
  });
