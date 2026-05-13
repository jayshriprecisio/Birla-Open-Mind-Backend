import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createTermService,
  deleteTermService,
  getTermsService,
  updateTermService,
} from './term.service';
import {
  createTermSchema,
  deleteTermSchema,
  updateTermSchema,
} from './term.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getTermsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getTermsService();

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

export const createTermController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createTermSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await createTermService({
      termName: validated.termName,
      shortForm: validated.shortForm,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Term created successfully',
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

export const updateTermController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateTermSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await updateTermService({
      id: validated.id,
      termName: validated.termName,
      shortForm: validated.shortForm,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Term not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Term updated successfully',
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

export const deleteTermController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteTermSchema.parse(body);

    const result = await deleteTermService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Term not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Term deleted successfully',
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
