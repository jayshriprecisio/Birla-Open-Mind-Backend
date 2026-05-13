import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createSessionService,
  deleteSessionService,
  getSessionsService,
  updateSessionService,
} from './session.service';
import {
  createSessionSchema,
  deleteSessionSchema,
  updateSessionSchema,
} from './session.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getSessionsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getSessionsService();

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

export const createSessionController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createSessionSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await createSessionService({
      sessionName: validated.sessionName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Session created successfully',
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

export const updateSessionController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateSessionSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await updateSessionService({
      id: validated.id,
      sessionName: validated.sessionName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Session updated successfully',
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

export const deleteSessionController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteSessionSchema.parse(body);

    const result = await deleteSessionService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully',
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
