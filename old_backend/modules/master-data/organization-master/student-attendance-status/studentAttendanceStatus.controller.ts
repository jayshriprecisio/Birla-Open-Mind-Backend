import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createStudentAttendanceStatusService,
  deleteStudentAttendanceStatusService,
  listStudentAttendanceStatusesService,
  updateStudentAttendanceStatusService,
} from './studentAttendanceStatus.service';
import {
  createStudentAttendanceStatusSchema,
  deleteStudentAttendanceStatusSchema,
  updateStudentAttendanceStatusSchema,
} from './studentAttendanceStatus.validation';

function toUserField(userId: string) {
  return String(userId ?? '').trim().slice(0, 50) || null;
}

const normStatus = (body: Record<string, unknown>) => ({
  ...body,
  status:
    typeof body.status === 'string'
      ? body.status.toUpperCase()
      : body.status,
});

export const getStudentAttendanceStatusesController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listStudentAttendanceStatusesService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createStudentAttendanceStatusController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createStudentAttendanceStatusSchema.parse(normStatus(body));
    const data = await createStudentAttendanceStatusService({
      name: v.name,
      shortForm: v.shortForm,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Student attendance status created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateStudentAttendanceStatusController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateStudentAttendanceStatusSchema.parse(normStatus(body));
    const data = await updateStudentAttendanceStatusService({
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
      message: 'Student attendance status updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteStudentAttendanceStatusController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deleteStudentAttendanceStatusSchema.parse(body);
    const result = await deleteStudentAttendanceStatusService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Student attendance status deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
