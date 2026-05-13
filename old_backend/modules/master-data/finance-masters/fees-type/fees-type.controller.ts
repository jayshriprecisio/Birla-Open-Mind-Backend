import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createFeesTypeService,
  deleteFeesTypeService,
  listFeesTypesPaginatedService,
  updateFeesTypeService,
} from './fees-type.service';
import {
  createFeesTypeSchema,
  deleteFeesTypeSchema,
  listFeesTypeQuerySchema,
  updateFeesTypeSchema,
} from './fees-type.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getFeesTypesController = async (req: NextRequest) => {
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

    const validated = listFeesTypeQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listFeesTypesPaginatedService({
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

export const createFeesTypeController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      feesTypeName:
        body.feesTypeName ??
        body.FeesTypeName ??
        body['Fees Type'] ??
        body.FeesType,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createFeesTypeSchema.parse(merged);

    const data = await createFeesTypeService({
      feesTypeName: validated.feesTypeName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Fees type created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updateFeesTypeController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId,
      feesTypeName:
        body.feesTypeName ??
        body.FeesTypeName ??
        body['Fees Type'] ??
        body.FeesType,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updateFeesTypeSchema.parse(merged);

    const data = await updateFeesTypeService({
      id: validated.id,
      feesTypeName: validated.feesTypeName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Fees type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Fees type updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deleteFeesTypeController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteFeesTypeSchema.parse(body);

    const result = await deleteFeesTypeService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Fees type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Fees type deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
