import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createBatchService,
  deleteBatchService,
  getBatchesService,
  updateBatchService,
} from './batch.service';
import {
  createBatchSchema,
  deleteBatchSchema,
  updateBatchSchema,
} from './batch.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getBatchesController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getBatchesService();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 401 }
    );
  }
};

export const createBatchController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createBatchSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await createBatchService({
      batchName: validated.batchName,
      shortForm: validated.shortForm,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Batch created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};

export const updateBatchController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateBatchSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await updateBatchService({
      id: validated.id,
      batchName: validated.batchName,
      shortForm: validated.shortForm,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Batch not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Batch updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};

export const deleteBatchController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteBatchSchema.parse(body);

    const result = await deleteBatchService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Batch not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Batch deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};
