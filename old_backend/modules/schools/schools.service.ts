import { z } from 'zod';
import {
  createSchoolTransaction,
  getSchoolByIdRepo,
  getSchoolsDashboardSummaryRepo,
  listSchoolsFilteredRepo,
  patchSchoolStatusRepo,
  softDeleteSchoolRepo,
  updateSchoolTransaction,
  type CreateSchoolInput,
  type SchoolsDashboardSummary,
} from './schools.repository';
import {
  createSchoolBodySchema,
  patchSchoolStatusSchema,
  type ListSchoolsQuery,
} from './schools.validation';

function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code?: string }).code === '23505'
  );
}

function friendlyDbError(err: unknown): string {
  if (isUniqueViolation(err)) {
    return 'A school with this code, email, or one of the unique registration fields already exists.';
  }
  if (err instanceof Error) return err.message;
  return 'Database error';
}

type Validated = z.infer<typeof createSchoolBodySchema>;

/** `created_by` is UUID in DB; non-UUID JWT subjects store as NULL. */
function toUuidOrNull(id: string | undefined): string | null {
  if (!id) return null;
  return z.string().uuid().safeParse(id).success ? id : null;
}

function toCreateInput(
  v: Validated,
  createdBy: string | null
): CreateSchoolInput {
  const empty = (s: string | null | undefined) => {
    const t = s?.trim();
    return t ? t : null;
  };

  const billingSame = v.billing_same_as_school;
  const billing_name = billingSame
    ? empty(v.billing_name) ?? v.school_name
    : empty(v.billing_name);
  const billing_address_line1 = billingSame
    ? v.address_line1
    : v.billing_address_line1 ?? null;
  const billing_address_line2 = billingSame
    ? v.address_line2
    : v.billing_address_line2 ?? null;
  const billing_address_line3 = billingSame
    ? empty(v.address_line3)
    : empty(v.billing_address_line3);
  const billing_pin_code = billingSame ? v.pin_code : v.billing_pin_code ?? null;
  const billing_country = billingSame ? v.country : v.billing_country ?? null;
  const billing_state_province = billingSame
    ? v.state_province
    : v.billing_state_province ?? null;
  const billing_city = billingSame ? v.city : v.billing_city ?? null;

  const partners = (v.partners ?? []).map((p, idx) => ({
    partner_name: empty(p.partner_name),
    partner_email: empty(p.partner_email ?? undefined),
    partner_mobile: empty(p.partner_mobile),
    sort_order: p.sort_order ?? idx,
  }));

  const isBomps = (v.brand_code ?? '').trim().toUpperCase() === 'BOMPS';

  return {
    zone_id: v.zone_id,
    brand_id: v.brand_id,
    brand_code: empty(v.brand_code),
    school_name: v.school_name.trim(),
    school_code: v.school_code.trim(),
    board: v.board.trim(),
    session_month: v.session_month,
    total_capacity: v.total_capacity ?? null,
    operational_capacity: v.operational_capacity ?? null,
    address_line1: v.address_line1.trim(),
    address_line2: v.address_line2.trim(),
    address_line3: empty(v.address_line3),
    pin_code: v.pin_code,
    country: v.country,
    state_province: v.state_province.trim(),
    city: v.city.trim(),
    phone_number: v.phone_number.trim(),
    official_email: v.official_email.trim().toLowerCase(),
    website_url: empty(v.website_url),
    billing_name,
    billing_same_as_school: v.billing_same_as_school,
    billing_address_line1,
    billing_address_line2,
    billing_address_line3,
    billing_pin_code,
    billing_country,
    billing_state_province,
    billing_city,
    affiliation_number: empty(v.affiliation_number),
    cbse_school_code: empty(v.cbse_school_code),
    udise_code: empty(v.udise_code),
    status: v.status,
    created_by: createdBy,
    partners,
    centre_head: {
      full_name: v.centre_head.full_name.trim(),
      email_login_id: v.centre_head.email_login_id.trim().toLowerCase(),
      phone_number: v.centre_head.phone_number.trim(),
    },
    ...(isBomps
      ? {}
      : {
          principal: {
            full_name: v.principal!.full_name.trim(),
            email_login_id: v.principal!.email_login_id.trim().toLowerCase(),
            phone_number: v.principal!.phone_number.trim(),
          },
        }),
  };
}

export async function createSchoolService(
  body: unknown,
  createdBy: string | undefined
) {
  const v = createSchoolBodySchema.parse(body);
  const input = toCreateInput(v, toUuidOrNull(createdBy));
  try {
    return await createSchoolTransaction(input);
  } catch (e) {
    throw new Error(friendlyDbError(e));
  }
}

export async function updateSchoolService(
  schoolId: string,
  body: unknown,
  _updatedBy: string | null
) {
  const v = createSchoolBodySchema.parse(body);
  const input = toCreateInput(v, null);
  try {
    const result = await updateSchoolTransaction(schoolId, {
      ...input,
      created_by: null,
    });
    if (!result) return null;
    return result;
  } catch (e) {
    throw new Error(friendlyDbError(e));
  }
}

export type ListSchoolsPaginatedResult = {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export async function listSchoolsPaginatedService(
  query: ListSchoolsQuery
): Promise<ListSchoolsPaginatedResult> {
  const pageSize = query.limit;
  const { rows, total } = await listSchoolsFilteredRepo(query);
  const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize);
  return {
    items: rows,
    total,
    page: query.page,
    pageSize,
    totalPages,
  };
}

export async function getSchoolsDashboardSummaryService(): Promise<SchoolsDashboardSummary> {
  return getSchoolsDashboardSummaryRepo();
}

export async function getSchoolByIdService(schoolId: string) {
  return getSchoolByIdRepo(schoolId);
}

export async function softDeleteSchoolService(schoolId: string) {
  const r = await softDeleteSchoolRepo(schoolId);
  return r.rowCount ?? 0;
}

export async function patchSchoolStatusService(
  schoolId: string,
  body: unknown
): Promise<{ school_id: string } | null> {
  const { status } = patchSchoolStatusSchema.parse(body);
  const r = await patchSchoolStatusRepo(schoolId, status);
  const first = r.rows[0] as { school_id?: string } | undefined;
  if (!r.rowCount || !first?.school_id) return null;
  return { school_id: first.school_id };
}
