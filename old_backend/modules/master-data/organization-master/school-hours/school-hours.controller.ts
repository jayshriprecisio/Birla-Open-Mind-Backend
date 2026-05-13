import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createSchoolHoursService,
  deleteSchoolHoursService,
  getSchoolHoursService,
  updateSchoolHoursService,
} from './school-hours.service';
import {
  createSchoolHoursSchema,
  deleteSchoolHoursSchema,
  updateSchoolHoursSchema,
} from './school-hours.validation';
import { formatApiError } from '@/backend/utils/api-error';

const parseTotalMinutes = (value: unknown) =>
  Number(value);

export const getSchoolHoursController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getSchoolHoursService();
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const createSchoolHoursController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createSchoolHoursSchema.parse({
      ...body,
      totalMinutes: parseTotalMinutes(body.totalMinutes),
      status: body.status?.toUpperCase(),
    });

    const data = await createSchoolHoursService(validated);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const updateSchoolHoursController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateSchoolHoursSchema.parse({
      ...body,
      totalMinutes:
        body.totalMinutes !== undefined
          ? parseTotalMinutes(body.totalMinutes)
          : undefined,
      status: body.status?.toUpperCase(),
    });

    const data = await updateSchoolHoursService(validated);
    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'School hours record not found',
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

export const deleteSchoolHoursController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteSchoolHoursSchema.parse(body);

    const result = await deleteSchoolHoursService(validated);
    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'School hours record not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        'School hours record deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
