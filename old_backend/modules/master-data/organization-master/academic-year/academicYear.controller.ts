import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createAcademicYearService,
  deleteAcademicYearService,
  listAcademicYearsService,
  updateAcademicYearService,
} from './academicYear.service';
import {
  createAcademicYearSchema,
  deleteAcademicYearSchema,
  updateAcademicYearSchema,
} from './academicYear.validation';

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

export const getAcademicYearsController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const data = await listAcademicYearsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createAcademicYearController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createAcademicYearSchema.parse(normStatus(body));
    const data = await createAcademicYearService({
      name: v.name,
      shortForm: v.shortForm,
      shortForm2Digit: v.shortForm2Digit,
      status: v.status,
      createdBy: toUserField(user.id),
    });
    return NextResponse.json({
      success: true,
      data,
      message: 'Academic year created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateAcademicYearController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = updateAcademicYearSchema.parse(normStatus(body));
    const data = await updateAcademicYearService({
      id: v.id,
      name: v.name,
      shortForm: v.shortForm,
      shortForm2Digit: v.shortForm2Digit,
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
      message: 'Academic year updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteAcademicYearController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = deleteAcademicYearSchema.parse(body);
    const result = await deleteAcademicYearService(v.id);
    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: 'Academic year deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
