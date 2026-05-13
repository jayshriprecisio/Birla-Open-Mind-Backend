import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import { ROLE_SUPER_ADMIN } from '@/backend/utils/roles';
import {
  createSchoolService,
  getSchoolByIdService,
  getSchoolsDashboardSummaryService,
  listSchoolsPaginatedService,
  patchSchoolStatusService,
  softDeleteSchoolService,
  updateSchoolService,
} from './schools.service';
import { listSchoolsQuerySchema, schoolIdParamSchema } from './schools.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

export const getSchoolsSummaryController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const data = await getSchoolsDashboardSummaryService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const listSchoolsController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const { searchParams } = new URL(req.url);
    const raw: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      if (v !== '') raw[k] = v;
    });
    const parsed = listSchoolsQuerySchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.flatten().formErrors[0];
      return NextResponse.json(
        { success: false, message: first ?? 'Invalid query parameters' },
        { status: 400 }
      );
    }

    const data = await listSchoolsPaginatedService(parsed.data);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const createSchoolController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const body = await req.json();
    const data = await createSchoolService(body, user.id);
    return NextResponse.json({
      success: true,
      data,
      message: 'School created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const getSchoolByIdController = async (
  req: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const { schoolId } = schoolIdParamSchema.parse(await context.params);
    const row = await getSchoolByIdService(schoolId);
    if (!row) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      );
    }

    const { school, partners, contacts } = row;
    const head = contacts.find(
      (c) => c.contact_type === 'centre_head'
    );
    const principal = contacts.find(
      (c) => c.contact_type === 'principal'
    );

    return NextResponse.json({
      success: true,
      data: {
        school,
        partners,
        centre_head: head,
        principal,
      },
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const patchSchoolStatusController = async (
  req: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const { schoolId } = schoolIdParamSchema.parse(await context.params);
    const body = await req.json();
    const data = await patchSchoolStatusService(schoolId, body);
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data,
      message: 'Status updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const updateSchoolController = async (
  req: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const { schoolId } = schoolIdParamSchema.parse(await context.params);
    const body = await req.json();
    const data = await updateSchoolService(schoolId, body, user.id);
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data,
      message: 'School updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const deleteSchoolController = async (
  req: NextRequest,
  context: { params: Promise<{ schoolId: string }> }
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, [ROLE_SUPER_ADMIN]);

    const { schoolId } = schoolIdParamSchema.parse(await context.params);
    const n = await softDeleteSchoolService(schoolId);
    if (!n) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};
