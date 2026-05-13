import { z } from 'zod';

const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : v);
const optionalTrim = z.preprocess(trim, z.string().optional().default(''));

export const listQuerySchema = z.object({
  q: optionalTrim,
  status: z.preprocess(trim, z.string().optional().default('ALL')),
  school: z.preprocess(trim, z.string().optional().default('ALL')),
  grade: z.preprocess(trim, z.string().optional().default('ALL')),
  dateFrom: optionalTrim,
  dateTo: optionalTrim,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
}); 

export const updateStatusSchema = z.object({
  id: z.union([z.string(), z.number()]),
  status: z.preprocess(trim, z.string().min(1).max(30)),
});

/**
 * DELETE /admission-inquiries/[id]
 *
 * `id` is `BIGSERIAL`, which can exceed `Number.MAX_SAFE_INTEGER`. We
 * therefore validate it as a non-empty digit string (1..19 chars covers
 * `BIGINT` max of 9223372036854775807) and pass that string straight to
 * Postgres so no precision is lost in transit.
 */
export const deleteAdmissionInquiryParamSchema = z.object({
  id: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim() : v),
    z
      .string()
      .regex(/^[1-9]\d{0,18}$/, 'Invalid enquiry id.')
  ),
});

const RELATION_VALUES = ['Father', 'Mother', 'Guardian'] as const;

const phone = z.preprocess((v) => {
  if (typeof v !== 'string') return v;
  const digits = v.replace(/\D+/g, '');
  return digits;
}, z.string().min(7, 'Phone number is too short').max(15, 'Phone number is too long'));

export const createAdmissionInquirySchema = z.object({
  school: z.preprocess(trim, z.string().min(1, 'Please select a school.').max(255)),
  grade: z.preprocess(trim, z.string().min(1, 'Please select a grade.').max(100)),
  parent_first_name: z.preprocess(
    trim,
    z.string().min(1, "Please enter parent's first name.").max(255)
  ),
  parent_last_name: z.preprocess(
    trim,
    z.string().min(1, 'Please enter last name.').max(255)
  ),
  relation: z.preprocess((v) => {
    if (typeof v !== 'string') return v;
    return v.trim() || 'Father';
  }, z.enum(RELATION_VALUES).default('Father')),
  email: z.preprocess(
    (v) => (typeof v === 'string' ? v.trim().toLowerCase() : v),
    z.string().email('Please enter a valid email.').max(255)
  ),
  phone_number: phone,
  comment: z.preprocess(trim, z.string().max(2000).optional().default('')),
  /**
   * Self-hosted text-CAPTCHA. The signed token is issued by `GET /api/captcha`
   * and contains the HMAC of the expected answer; both fields are verified
   * server-side via `verifyTextCaptcha()` before the row is created.
   */
  captcha_token: z.preprocess(
    trim,
    z
      .string()
      .min(1, 'Please complete the security check before submitting.')
      .max(2048)
  ),
  captcha_answer: z.preprocess(
    trim,
    z
      .string()
      .min(1, 'Please enter the characters shown in the captcha image.')
      .max(16)
  ),
});

export type CreateAdmissionInquiryInput = z.infer<
  typeof createAdmissionInquirySchema
>;
