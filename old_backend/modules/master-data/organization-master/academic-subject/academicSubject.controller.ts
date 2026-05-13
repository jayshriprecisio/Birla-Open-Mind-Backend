import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createAcademicSubjectService,
  deleteAcademicSubjectService,
  listAcademicSubjectsService,
  updateAcademicSubjectService,
} from './academicSubject.service';
import {
  createAcademicSubjectSchema,
  deleteAcademicSubjectSchema,
  updateAcademicSubjectSchema,
} from './academicSubject.validation';

function toCreatedBy(userId: string) {
  const s = String(userId ?? '').trim();
  return s.slice(0, 50) || null;
}

const normBodyStatus = (body: Record<string, unknown>) => ({
  ...body,
  status:
    typeof body.status === 'string'
      ? body.status.toUpperCase()
      : body.status,
});

export const getAcademicSubjectsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await listAcademicSubjectsService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createAcademicSubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createAcademicSubjectSchema.parse(normBodyStatus(body));

    const data = await createAcademicSubjectService({
      name: validated.name,
      shortForm: validated.shortForm,
      status: validated.status,
      createdBy: toCreatedBy(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Academic subject created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateAcademicSubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateAcademicSubjectSchema.parse(normBodyStatus(body));

    const data = await updateAcademicSubjectService({
      id: validated.id,
      name: validated.name,
      shortForm: validated.shortForm,
      status: validated.status ?? 'ACTIVE',
      updatedBy: toCreatedBy(user.id),
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
      message: 'Academic subject updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteAcademicSubjectController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteAcademicSubjectSchema.parse(body);

    const result = await deleteAcademicSubjectService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Academic subject deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
