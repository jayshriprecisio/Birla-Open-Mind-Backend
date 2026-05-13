import { NextRequest, NextResponse } from 'next/server';
import {
  createCourseService,
  deleteCourseService,
  getCoursesService,
  updateCourseService,
} from './course.service';
import {
  createCourseSchema,
  deleteCourseSchema,
  updateCourseSchema,
} from './course.validation';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getCoursesController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const courses = await getCoursesService();

    return NextResponse.json({
      success: true,
      data: courses,
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

export const createCourseController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createCourseSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const course = await createCourseService({
      courseName: validated.courseName,
      courseCode: validated.courseCode,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data: course,
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

export const updateCourseController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateCourseSchema.parse({
      ...body,
      status: body.status?.toUpperCase(),
    });

    const updated = await updateCourseService({
      id: validated.id,
      courseName: validated.courseName,
      courseCode: validated.courseCode,
      status: validated.status,
      updatedBy: getUserId(user.id),
    });

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          message: 'Course not found',
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

export const deleteCourseController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteCourseSchema.parse(body);

    const result = await deleteCourseService({
      id: validated.id,
      courseCode: validated.courseCode,
      updatedBy: getUserId(user.id),
    });

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Course not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Course deleted successfully',
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
