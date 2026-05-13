import { z } from 'zod';

/** Matches `zone_master.id` / `brand_master.id` (bigint in DB). */
const idRef = z.coerce.number().int().positive();

const partnerRow = z.object({
  partner_name: z.string().optional(),
  partner_email: z
    .union([z.string().email(), z.literal('')])
    .optional(),
  partner_mobile: z.string().optional(),
  sort_order: z.number().int().min(0).optional(),
});

const contactRow = z.object({
  full_name: z.string().min(1),
  email_login_id: z.string().email(),
  phone_number: z.string().min(1),
});

export const createSchoolBodySchema = z
  .object({
    zone_id: idRef,
    brand_id: idRef,
    brand_code: z.string().max(20).optional(),
    school_name: z.string().min(1).max(255),
    school_code: z.string().min(1).max(30),
    board: z.string().min(1).max(30),
    session_month: z.number().int().min(1).max(12),
    total_capacity: z.number().int().positive().optional().nullable(),
    operational_capacity: z.number().int().positive().optional().nullable(),
    address_line1: z.string().min(1).max(255),
    address_line2: z.string().min(1).max(255),
    address_line3: z.string().max(255).optional().nullable(),
    pin_code: z.string().regex(/^[0-9]{6}$/),
    country: z.string().length(2).default('IN'),
    state_province: z.string().min(1).max(60),
    city: z.string().min(1).max(60),
    phone_number: z.string().min(1).max(15),
    official_email: z.string().email(),
    website_url: z.string().max(512).optional().nullable(),
    billing_name: z.string().max(255).optional().nullable(),
    billing_same_as_school: z.boolean().default(false),
    billing_address_line1: z.string().max(255).optional().nullable(),
    billing_address_line2: z.string().max(255).optional().nullable(),
    billing_address_line3: z.string().max(255).optional().nullable(),
    billing_pin_code: z.string().length(6).regex(/^[0-9]{6}$/).optional().nullable(),
    billing_country: z.string().length(2).optional().nullable(),
    billing_state_province: z.string().max(60).optional().nullable(),
    billing_city: z.string().max(60).optional().nullable(),
    affiliation_number: z.string().max(30).optional().nullable(),
    cbse_school_code: z.string().max(20).optional().nullable(),
    udise_code: z.string().max(20).optional().nullable(),
    status: z.enum(['active', 'inactive', 'suspended']).default('active'),
    partners: z.array(partnerRow).optional().default([]),
    centre_head: contactRow,
    /** Required unless `brand_code` is BOMPS (Centre Head–only brand). */
    principal: contactRow.optional(),
  })
  .refine(
    (d) => {
      if (d.billing_same_as_school) return true;
      if (d.billing_name || d.billing_address_line1) {
        return !!(
          d.billing_address_line1 &&
          d.billing_address_line2 &&
          d.billing_pin_code &&
          d.billing_country &&
          d.billing_state_province &&
          d.billing_city
        );
      }
      return true;
    },
    {
      message:
        'When billing is not same as school, complete billing name and address fields.',
      path: ['billing_address_line1'],
    }
  )
  .refine(
    (d) => {
      if ((d.brand_code ?? '').trim().toUpperCase() === 'BOMPS') return true;
      const p = d.principal;
      return !!(
        p &&
        p.full_name?.trim() &&
        p.email_login_id?.trim() &&
        p.phone_number?.trim()
      );
    },
    {
      message: 'Principal details are required for this brand.',
      path: ['principal'],
    }
  );

export const updateSchoolBodySchema = createSchoolBodySchema;

export const schoolIdParamSchema = z.object({
  schoolId: z.string().uuid(),
});

/** GET /api/schools — validated query for scalable list + filtering. */
export const listSchoolsQuerySchema = z.object({
  q: z.string().max(200).optional().default(''),
  status: z
    .enum(['all', 'active', 'inactive', 'suspended'])
    .optional()
    .default('all'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  sortBy: z
    .enum(['created_at', 'school_name', 'school_code', 'city'])
    .optional()
    .default('school_name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  /** Exact zone name from `zone_master.zone_name`. */
  zone: z.string().max(120).optional().default(''),
  board: z.string().max(30).optional().default(''),
  brand: z.enum(['all', 'BOMIS', 'BOMPS']).optional().default('all'),
  /**
   * Regulatory IDs: mapped = both UDISE + CBSE filled; partial = exactly one;
   * unmapped = neither.
   */
  mapping: z
    .enum(['all', 'mapped', 'partial', 'unmapped'])
    .optional()
    .default('all'),
});

export type ListSchoolsQuery = z.infer<typeof listSchoolsQuerySchema>;

/** PATCH /api/schools/[schoolId] — status-only update from list actions. */
export const patchSchoolStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
});

export type PatchSchoolStatusBody = z.infer<typeof patchSchoolStatusSchema>;
