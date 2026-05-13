import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createPrePrimarySubjectService,
  deletePrePrimarySubjectService,
  listPrePrimarySubjectsService,
  updatePrePrimarySubjectService,
} from './prePrimarySubject.service';
import {
  createPrePrimarySubjectSchema,
  deletePrePrimarySubjectSchema,
  updatePrePrimarySubjectSchema,
} from './prePrimarySubject.validation';

function toUserField(userId: string) {
  const s = String(userId ?? '').trim();
  return s.slice(0, 50) || null;
}

const normStatus = (body: Record<string, unknown>) => ({
  ...body,
  status:
    typeof body.status === 'string'
      ? body.status.toUpperCase()
      : body.status,
});

export const getPrePrimarySubjectsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listPrePrimarySubjectsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createPrePrimarySubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createPrePrimarySubjectSchema.parse(normStatus(body));
    const data = await createPrePrimarySubjectService({
      name: v.name,
      shortForm: v.shortForm,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Pre-primary subject created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updatePrePrimarySubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updatePrePrimarySubjectSchema.parse(normStatus(body));
    const data = await updatePrePrimarySubjectService({
      id: v.id,
      name: v.name,
      shortForm: v.shortForm,
      status: v.status ?? 'ACTIVE',
      updatedBy: toUserField(user.id),
    });
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data,
      message: 'Pre-primary subject updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deletePrePrimarySubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deletePrePrimarySubjectSchema.parse(body);
    const result = await deletePrePrimarySubjectService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Pre-primary subject deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
