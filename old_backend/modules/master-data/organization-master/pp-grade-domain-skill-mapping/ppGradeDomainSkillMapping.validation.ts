import { z } from 'zod';

const gradeField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Grade name is required')
    .max(100, 'Grade name must be at most 100 characters')
);

const domainField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Domain name is required')
    .max(100, 'Domain name must be at most 100 characters')
);

const skillField = z.preprocess(
  (v) => (typeof v === 'string' ? v.trim() : v),
  z
    .string()
    .min(1, 'Skill name is required')
    .max(150, 'Skill name must be at most 150 characters')
);

const parameterIdField = z.preprocess((val) => {
  if (typeof val === 'number' && Number.isFinite(val)) {
    return String(Math.floor(val));
  }
  if (typeof val === 'string') return val.trim();
  return val;
}, z.string().regex(/^[1-9]\d*$/, 'Select a valid parameter'));

export const createPpMappingSchema = z.object({
  gradeName: gradeField,
  domainName: domainField,
  skillName: skillField,
  parameterId: parameterIdField,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

export const updatePpMappingSchema = z.object({
  id: z.union([z.string(), z.number()]),
  gradeName: gradeField,
  domainName: domainField,
  skillName: skillField,
  parameterId: parameterIdField,
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const deletePpMappingSchema = z.object({
  id: z.union([z.string(), z.number()]),
});
