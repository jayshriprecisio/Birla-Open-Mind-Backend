import { z } from 'zod';

export const createBoardSchema = z.object({
  boardName: z.string().min(2),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export const updateBoardSchema = z.object({
  boardCode: z.string().min(2),
  boardName: z.string().min(2).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deleteBoardSchema = z.object({
  id: z.string().min(2),
});