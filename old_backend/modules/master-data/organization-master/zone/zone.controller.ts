import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createZoneService,
  deleteZoneService,
  getZonesService,
  updateZoneService,
} from './zone.service';
import {
  createZoneSchema,
  deleteZoneSchema,
  updateZoneSchema,
} from './zone.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getZonesController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getZonesService();

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

export const createZoneController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createZoneSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await createZoneService({
      zoneName: validated.zoneName,
      shortForm: validated.shortForm,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Zone created successfully',
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

export const updateZoneController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateZoneSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await updateZoneService({
      id: validated.id,
      zoneName: validated.zoneName,
      shortForm: validated.shortForm,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Zone updated successfully',
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

export const deleteZoneController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteZoneSchema.parse(body);

    const result = await deleteZoneService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Zone not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Zone deleted successfully',
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
