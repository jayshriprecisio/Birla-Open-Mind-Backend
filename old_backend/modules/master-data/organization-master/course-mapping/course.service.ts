import {
  createCourseRepo,
  existsCourseNameRepo,
  getCoursesRepo,
  updateCourseRepo,
  softDeleteCourseByCodeRepo,
  softDeleteCourseByIdRepo,
} from './course.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createCourseService = async ({
  courseName,
  courseCode,
  status,
  createdBy,
}: {
  courseName: string;
  courseCode?: string;
  status?: string;
  createdBy: number;
}) => {
  const duplicate = await existsCourseNameRepo({
    courseName,
  });

  if (duplicate.rowCount) {
    throw new Error(
      'A course with this name already exists. Please use a different Course Name.'
    );
  }

  const finalCourseCode = courseCode || `CRS-${Date.now()}`;
  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createCourseRepo({
    courseCode: finalCourseCode,
    courseName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getCoursesService = async () => {
  const result = await getCoursesRepo();
  return result.rows;
};

export const updateCourseService = async ({
  id,
  courseName,
  courseCode,
  status,
  updatedBy,
}: {
  id: string | number;
  courseName?: string;
  courseCode?: string;
  status?: string;
  updatedBy: number;
}) => {
  if (courseName) {
    const duplicate = await existsCourseNameRepo({
      courseName,
      excludeId: id,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'A course with this name already exists. Please use a different Course Name.'
      );
    }
  }

  const result = await updateCourseRepo({
    id,
    courseCode,
    courseName,
    status: normalizeStatus(status),
    updatedBy,
  });

  return result.rows[0] || null;
};

export const deleteCourseService = async ({
  id,
  courseCode,
  updatedBy,
}: {
  id?: string | number;
  courseCode?: string;
  updatedBy: number;
}) => {
  if (id !== undefined && id !== null) {
    return await softDeleteCourseByIdRepo({ id, updatedBy });
  }

  if (courseCode) {
    return await softDeleteCourseByCodeRepo({ courseCode, updatedBy });
  }

  throw new Error('Provide id or courseCode for delete');
};
