import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';

import {
  createWinterTimeGapService,
  deleteWinterTimeGapService,
  getWinterTimeGapService,
  updateWinterTimeGapService,
} from './winter-time-gap.service';

import {
  createWinterTimeGapSchema,
  deleteWinterTimeGapSchema,
  updateWinterTimeGapSchema,
} from './winter-time-gap.validation';
import { formatApiError } from '@/backend/utils/api-error';

/** Accept `timing_gap` or `winter_timing_gap`; avoid undefined so JSON.parse never drops the field */
const pickTimingGapString = (
  body: Record<string, unknown>
) => {
  const v =
    body.timing_gap ?? body.winter_timing_gap;
  if (v === undefined || v === null) {
    return '';
  }
  return String(v).trim();
};

export const getWinterTimeGapsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getWinterTimeGapService();

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

export const createWinterTimeGapController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = (await req.json()) as Record<
      string,
      unknown
    >;

    const validated =
      createWinterTimeGapSchema.parse({
        ...body,
        timing_gap: pickTimingGapString(body),
        status:
          typeof body.status === 'string'
            ? body.status.toUpperCase()
            : body.status,
      });

    const createdByNum = Number(user.id);
    const data =
      await createWinterTimeGapService({
        ...validated,
        createdBy: Number.isNaN(createdByNum)
          ? 1
          : createdByNum,
      });

    return NextResponse.json({
      success: true,
      data,
      message:
        'Winter timing gap created successfully',
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

export const updateWinterTimeGapController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const body = (await req.json()) as Record<
        string,
        unknown
      >;

      const hasGapField =
        'timing_gap' in body ||
        'winter_timing_gap' in body;

      const rawGap = hasGapField
        ? pickTimingGapString(body)
        : undefined;

      const validated =
        updateWinterTimeGapSchema.parse({
          ...body,
          ...(rawGap !== undefined &&
          rawGap !== ''
            ? { timing_gap: rawGap }
            : {}),
          status:
            typeof body.status === 'string'
              ? body.status.toUpperCase()
              : body.status,
        });

      const data =
        await updateWinterTimeGapService(
          validated
        );

      if (!data) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Winter timing gap not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data,
        message:
          'Winter timing gap updated successfully',
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

export const deleteWinterTimeGapController =
  async (req: NextRequest) => {
    try {
      const user = authenticate(req);
      authorizeRole(user, ['SUPER_ADMIN']);

      const body = await req.json();

      const validated =
        deleteWinterTimeGapSchema.parse(
          body
        );

      const result =
        await deleteWinterTimeGapService(
          validated.id
        );

      if (!result.rowCount) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Winter timing gap not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message:
          'Winter timing gap deleted successfully',
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