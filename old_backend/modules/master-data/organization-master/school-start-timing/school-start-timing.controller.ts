import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createSchoolStartTimingService,
  deleteSchoolStartTimingService,
  getSchoolStartTimingsService,
  updateSchoolStartTimingService,
} from './school-start-timing.service';
import {
  createSchoolStartTimingSchema,
  deleteSchoolStartTimingSchema,
  updateSchoolStartTimingSchema,
} from './school-start-timing.validation';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => id || 'system';

export const getSchoolStartTimingsController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const data =
        await getSchoolStartTimingsService();

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

export const createSchoolStartTimingController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const body = await req.json();
      const validated =
        createSchoolStartTimingSchema.parse({
          ...body,
          status:
            body.status?.toUpperCase(),
        });

      const created =
        await createSchoolStartTimingService({
          timingCode:
            validated.timingCode,
          shiftName:
            validated.shiftName,
          startTime:
            validated.startTime,
          endTime: validated.endTime,
          status: validated.status,
          createdBy: getUserId(
            user.id
          ),
        });

      return NextResponse.json({
        success: true,
        data: created,
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

export const updateSchoolStartTimingController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const body = await req.json();
      const validated =
        updateSchoolStartTimingSchema.parse({
          ...body,
          status:
            body.status?.toUpperCase(),
        });

      const updated =
        await updateSchoolStartTimingService({
          id: validated.id,
          timingCode:
            validated.timingCode,
          shiftName:
            validated.shiftName,
          startTime:
            validated.startTime,
          endTime: validated.endTime,
          status: validated.status,
          updatedBy: getUserId(
            user.id
          ),
        });

      if (!updated) {
        return NextResponse.json(
          {
            success: false,
            message:
              'School start timing not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updated,
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

export const deleteSchoolStartTimingController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const body = await req.json();
      const validated =
        deleteSchoolStartTimingSchema.parse(
          body
        );

      const result =
        await deleteSchoolStartTimingService({
          id: validated.id,
          timingCode:
            validated.timingCode,
          updatedBy: getUserId(
            user.id
          ),
        });

      if (!result.rowCount) {
        return NextResponse.json(
          {
            success: false,
            message:
              'School start timing not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          'School start timing deleted successfully',
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
