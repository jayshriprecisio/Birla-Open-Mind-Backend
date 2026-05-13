import { z } from 'zod';

const trim = (v: unknown) => (typeof v === 'string' ? v.trim() : v);
const text = (max: number) =>
  z.preprocess(trim, z.string().max(max).optional().default(''));
const dateOpt = z.preprocess(trim, z.string().optional().default(''));

export const siblingSchema = z.object({
  sibling_name: text(255),
  enrollment_no: text(255),
  dob: dateOpt,
  school_name: text(255),
  grade_id: z.number().int().optional(),
  board_id: z.number().int().optional(),
});

export const followupSchema = z.object({
  interaction_mode_id: z.number().int().optional(),
  interaction_status_id: z.number().int().optional(),
  followup_date: dateOpt,
  followup_time: text(20),
  next_followup_date: dateOpt,
  next_followup_time: text(20),
  remarks: text(4000),
  notes: text(4000),
  followup_with: text(20),
});

export const createEnquirySchema = z.object({
  school_id: z.string().uuid().optional(),
  branch_id: z.number().int().optional(),
  student_name: text(255),
  dob: dateOpt,
  aadhaar_no: text(20),
  current_school: text(255),
  father_name: text(255),
  father_mobile: text(20),
  father_email: text(255),
  mother_name: text(255),
  mother_mobile: text(20),
  mother_email: text(255),
  guardian_name: text(255),
  guardian_mobile: text(20),
  address_line1: text(1000),
  address_line2: text(1000),
  address_line3: text(1000),
  pincode: text(10),
  country: text(50),
  state: text(50),
  city: text(50),
  is_concession: z.boolean().optional().default(false),
  concession_type_id: z.number().int().optional(),
  is_referral: z.boolean().optional().default(false),
  referral_name: z.number().int().optional(),
  next_followup_date: dateOpt,
  priority_tag: text(20),
  status: text(50),
  siblings: z.array(siblingSchema).optional().default([]),
  followup: followupSchema.optional(),
});

export const phoneLookupSchema = z.object({
  phone: z.preprocess(trim, z.string().min(10).max(20)),
});

export const listSchoolEnquiriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.preprocess(trim, z.string().max(120).optional().default('')),
  status: z.preprocess(trim, z.string().max(50).optional().default('')),
  priority: z.preprocess(trim, z.string().max(20).optional().default('')),
  stage: z.preprocess(trim, z.string().max(30).optional().default('')),
  source: z.preprocess(trim, z.string().max(30).optional().default('')),
  school: z.preprocess(trim, z.string().max(255).optional().default('')),
  grade: z.preprocess(trim, z.string().max(100).optional().default('')),
  counsellor: z.preprocess(trim, z.string().max(255).optional().default('')),
  dateFrom: z.preprocess(trim, z.string().max(20).optional().default('')),
  dateTo: z.preprocess(trim, z.string().max(20).optional().default('')),
});

export const updateEnquiryStatusSchema = z.object({
  enquiry_id: z.preprocess(trim, z.string().uuid()),
  status: z.preprocess(trim, z.string().min(1).max(50)),
});

export const deleteEnquirySchema = z.object({
  enquiry_id: z.preprocess(trim, z.string().uuid()),
});
