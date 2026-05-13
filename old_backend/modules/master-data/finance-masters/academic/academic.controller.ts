import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createAcademicService,
  deleteAcademicService,
  listAcademicsPaginatedService,
  updateAcademicService,
} from './academic.service';
import {
  createAcademicSchema,
  deleteAcademicSchema,
  listAcademicQuerySchema,
  updateAcademicSchema,
} from './academic.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getAcademicsController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const { searchParams } = req.nextUrl;
    const raw = {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    };

    const validated = listAcademicQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listAcademicsPaginatedService({
      page: validated.page,
      pageSize: validated.pageSize,
      q: validated.q ?? '',
      statusFilter,
    });

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      page: validated.page,
      pageSize: validated.pageSize,
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const createAcademicController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      academicName:
        body.academicName ??
        body.AcademicName ??
        body.Academic,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createAcademicSchema.parse(merged);

    const data = await createAcademicService({
      academicName: validated.academicName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Academic created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updateAcademicController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId,
      academicName:
        body.academicName ??
        body.AcademicName ??
        body.Academic,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updateAcademicSchema.parse(merged);

    const data = await updateAcademicService({
      id: validated.id,
      academicName: validated.academicName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Academic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Academic updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deleteAcademicController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteAcademicSchema.parse(body);

    const result = await deleteAcademicService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Academic not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Academic deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
