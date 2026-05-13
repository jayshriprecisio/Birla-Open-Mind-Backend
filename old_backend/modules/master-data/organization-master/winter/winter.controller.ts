import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createWinterService,
  deleteWinterService,
  getWintersService,
  updateWinterService,
} from './winter.service';
import {
  createWinterSchema,
  deleteWinterSchema,
  updateWinterSchema,
} from './winter.validation';
import { formatApiError } from '@/backend/utils/api-error';

export const getWintersController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getWintersService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createWinterController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createWinterSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const data = await createWinterService(validated);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateWinterController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateWinterSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const data = await updateWinterService(validated);
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Winter record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteWinterController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteWinterSchema.parse(body);

    const result = await deleteWinterService(validated);
    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Winter record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Winter record deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
