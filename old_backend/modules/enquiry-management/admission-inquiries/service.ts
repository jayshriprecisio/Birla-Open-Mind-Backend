import {
  listAdmissionInquiriesRepo,
  updateAdmissionInquiryStatusRepo,
  createAdmissionInquiryRepo,
  softDeleteAdmissionInquiryRepo,
  type CreateAdmissionInquiryRow,
} from './repository';
import type { CreateAdmissionInquiryInput } from './validation';

export const listAdmissionInquiriesService = (args: {
  q: string;
  status: string;
  school: string;
  grade: string;
  dateFrom: string;
  dateTo: string;
  page: number;
  limit: number;
}) => listAdmissionInquiriesRepo(args);

export const updateAdmissionInquiryStatusService = (
  id: string | number,
  status: string
) => updateAdmissionInquiryStatusRepo(id, status.toUpperCase());

export const createAdmissionInquiryService = (
  input: CreateAdmissionInquiryInput
): Promise<CreateAdmissionInquiryRow> =>
  createAdmissionInquiryRepo({
    school: input.school,
    grade: input.grade,
    parent_first_name: input.parent_first_name,
    parent_last_name: input.parent_last_name,
    email: input.email,
    phone_number: input.phone_number,
    comment: input.comment,
    relation: input.relation,
  });

export const softDeleteAdmissionInquiryService = (
  id: string,
  deletedBy: string | null
) => softDeleteAdmissionInquiryRepo(id, deletedBy);
