import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createPeriodOfServiceSchema,
  deletePeriodOfServiceSchema,
  listPeriodOfServiceQuerySchema,
  updatePeriodOfServiceSchema,
} from './period-of-service.validation';
import {
  createPeriodOfServiceService,
  deletePeriodOfServiceService,
  listPeriodOfServicesService,
  updatePeriodOfServiceService,
} from './period-of-service.service';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const listPeriodOfServicesController = async (request: NextRequest) => {
  try {
    const user = authenticate(request);
    authorizeRole(user, ['SUPER_ADMIN']);

    const { searchParams } = request.nextUrl;
    const raw = {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    };

    const validated = listPeriodOfServiceQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listPeriodOfServicesService({
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

export const createPeriodOfServiceController = async (
  request: NextRequest
) => {
  try {
    const user = authenticate(request);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await request.json();
    const merged = {
      ...body,
      periodOfServiceName:
        body.periodOfServiceName ??
        body.PeriodOfServiceName ??
        body.PeriodOfService ??
        body['Period Of Service'] ??
        body.Name,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createPeriodOfServiceSchema.parse(merged);

    const data = await createPeriodOfServiceService({
      periodOfServiceName: validated.periodOfServiceName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Period of service created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updatePeriodOfServiceController = async (
  request: NextRequest
) => {
  try {
    const user = authenticate(request);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await request.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId ?? body.ID,
      periodOfServiceName:
        body.periodOfServiceName ??
        body.PeriodOfServiceName ??
        body.PeriodOfService ??
        body['Period Of Service'] ??
        body.Name,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updatePeriodOfServiceSchema.parse(merged);

    const data = await updatePeriodOfServiceService({
      id: validated.id,
      periodOfServiceName: validated.periodOfServiceName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Period of service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Period of service updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deletePeriodOfServiceController = async (
  request: NextRequest
) => {
  try {
    const user = authenticate(request);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await request.json();
    const validated = deletePeriodOfServiceSchema.parse({
      id: body.id ?? body.internalId ?? body.ID,
    });

    const result = await deletePeriodOfServiceService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Period of service not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Period of service deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
