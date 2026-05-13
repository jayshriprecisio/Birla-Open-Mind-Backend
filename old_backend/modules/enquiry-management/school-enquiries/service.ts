import {
  createSchoolEnquiryRepo,
  findAdmissionInquiryByPhoneRepo,
  listSchoolEnquiriesRepo,
  listSchoolEnquiriesFilteredRepo,
  softDeleteSchoolEnquiryRepo,
  updateSchoolEnquiryStatusRepo,
} from './repository';

export const findAdmissionInquiryByPhoneService = async (phone: string) => {
  const r = await findAdmissionInquiryByPhoneRepo(phone.trim());
  return r.rows[0] ?? null;
};

export const createSchoolEnquiryService = async (
  userId: string,
  payload: Record<string, unknown>
) => createSchoolEnquiryRepo({ userId, payload });

export const listSchoolEnquiriesService = async () => {
  const r = await listSchoolEnquiriesRepo();
  return r.rows;
};

export const listSchoolEnquiriesFilteredService = async (filters: {
  page: number;
  pageSize: number;
  search: string;
  status: string;
  priority: string;
  stage: string;
  source: string;
  school: string;
  grade: string;
  counsellor: string;
  dateFrom: string;
  dateTo: string;
}) => listSchoolEnquiriesFilteredRepo(filters);

export const updateSchoolEnquiryStatusService = async (
  enquiryId: string,
  status: string,
  userId: string
) => {
  const result = await updateSchoolEnquiryStatusRepo(enquiryId, status, userId);
  return result.rows[0] ?? null;
};

export const softDeleteSchoolEnquiryService = async (enquiryId: string, userId: string) => {
  const result = await softDeleteSchoolEnquiryRepo(enquiryId, userId);
  return result.rows[0] ?? null;
};
