import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createFeesCategoryService,
  deleteFeesCategoryService,
  listFeesCategoriesPaginatedService,
  updateFeesCategoryService,
} from './fees-category.service';
import {
  createFeesCategorySchema,
  deleteFeesCategorySchema,
  listFeesCategoryQuerySchema,
  updateFeesCategorySchema,
} from './fees-category.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getFeesCategoriesController = async (
  req: NextRequest
) => {
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

    const validated = listFeesCategoryQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listFeesCategoriesPaginatedService({
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

export const createFeesCategoryController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      feesCategoryName:
        body.feesCategoryName ??
        body.FeesCategoryName ??
        body['Fees Category'] ??
        body.FeesCategory,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createFeesCategorySchema.parse(merged);

    const data = await createFeesCategoryService({
      feesCategoryName: validated.feesCategoryName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Fees category created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updateFeesCategoryController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId,
      feesCategoryName:
        body.feesCategoryName ??
        body.FeesCategoryName ??
        body['Fees Category'] ??
        body.FeesCategory,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updateFeesCategorySchema.parse(merged);

    const data = await updateFeesCategoryService({
      id: validated.id,
      feesCategoryName: validated.feesCategoryName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Fees category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Fees category updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deleteFeesCategoryController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteFeesCategorySchema.parse(body);

    const result = await deleteFeesCategoryService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Fees category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Fees category deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
