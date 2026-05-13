import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError, toErrorResponse } from '@/backend/utils/api-error';
import { verifyTextCaptcha } from '@/backend/utils/text-captcha';

import {
  createAdmissionInquirySchema,
  deleteAdmissionInquiryParamSchema,
  listQuerySchema,
  updateStatusSchema,
} from './validation';
import {
  createAdmissionInquiryService,
  listAdmissionInquiriesService,
  softDeleteAdmissionInquiryService,
  updateAdmissionInquiryStatusService,
} from './service';

export const listAdmissionInquiriesController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const q = req.nextUrl.searchParams.get('q') ?? '';
    const status = req.nextUrl.searchParams.get('status') ?? 'ALL';
    const school = req.nextUrl.searchParams.get('school') ?? 'ALL';
    const grade = req.nextUrl.searchParams.get('grade') ?? 'ALL';
    const dateFrom = req.nextUrl.searchParams.get('dateFrom') ?? '';
    const dateTo = req.nextUrl.searchParams.get('dateTo') ?? '';
    const page = req.nextUrl.searchParams.get('page') ?? '1';
    const limit = req.nextUrl.searchParams.get('limit') ?? '20';
    const v = listQuerySchema.parse({
      q,
      status,
      school,
      grade,
      dateFrom,
      dateTo,
      page,
      limit,
    });
    const result = await listAdmissionInquiriesService(v);
    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: { total: result.total, page: v.page, limit: v.limit },
      filters: { schools: result.schools, grades: result.grades },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateAdmissionInquiryStatusController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateStatusSchema.parse(body);
    const r = await updateAdmissionInquiryStatusService(v.id, v.status);
    if (!r.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: r.rows[0] });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};


/**
 * DELETE /api/enquiry-management/admission-inquiries/[id]
 *
 * Soft-deletes an enquiry. Requires an authenticated SUPER_ADMIN. The
 * deletion is recorded with `deleted_at` / `deleted_by` for audit; the
 * row remains in the database and is filtered out of all list queries.
 *
 * Responses:
 *   200 { success, data: { id }, message }   - deleted
 *   401 { success: false, message }          - missing/invalid token
 *   403 { success: false, message }          - non-admin
 *   400 { success: false, message }          - invalid id
 *   404 { success: false, message }          - not found or already deleted
 *   500 { success: false, message }          - unexpected server error
 */
const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' } as const;

export const deleteAdmissionInquiryController = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const { id: rawId } = await context.params;
    const { id } = deleteAdmissionInquiryParamSchema.parse({ id: rawId });

    const deleted = await softDeleteAdmissionInquiryService(id, user.id ?? null);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found or already deleted.' },
        { status: 404, headers: NO_STORE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: { id: deleted.id },
        message: 'Enquiry deleted successfully.',
      },
      { headers: NO_STORE_HEADERS }
    );
  } catch (error: unknown) {
    const { status, message } = toErrorResponse(error);
    return NextResponse.json(
      { success: false, message },
      { status, headers: NO_STORE_HEADERS }
    );
  }
};

export const createAdmissionInquiryController = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}));
    const v = createAdmissionInquirySchema.parse(body);

    const captcha = verifyTextCaptcha(v.captcha_token, v.captcha_answer);
    if (!captcha.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            captcha.message ||
            'Captcha verification failed. Please try again.',
        },
        { status: 400 }
      );
    }

    const row = await createAdmissionInquiryService(v);
    return NextResponse.json(
      {
        success: true,
        data: {
          id: row.id,
          status: row.status,
          created_at: row.created_at,
        },
        message: 'Enquiry submitted successfully.',
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
