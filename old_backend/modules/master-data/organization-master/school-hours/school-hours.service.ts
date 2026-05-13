import {
  createSchoolHoursRepo,
  existsDurationCodeRepo,
  existsDurationNameRepo,
  getSchoolHoursRepo,
  softDeleteSchoolHoursByCodeRepo,
  softDeleteSchoolHoursByIdRepo,
  updateSchoolHoursRepo,
} from './school-hours.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const getSchoolHoursService = async () => {
  const result = await getSchoolHoursRepo();
  return result.rows;
};

export const createSchoolHoursService = async ({
  durationCode,
  durationName,
  totalMinutes,
  status,
}: {
  durationCode?: string;
  durationName: string;
  totalMinutes: number;
  status?: string;
}) => {
  const duplicateName = await existsDurationNameRepo({
    durationName,
  });
  if (duplicateName.rowCount) {
    throw new Error(
      'A school hours record with this duration name already exists. Please use a different Duration Name.'
    );
  }

  const finalDurationCode =
    durationCode || `SHR-${Date.now()}`;

  const duplicateCode = await existsDurationCodeRepo({
    durationCode: finalDurationCode,
  });
  if (duplicateCode.rowCount) {
    throw new Error(
      'A school hours record with this code already exists. Please try again.'
    );
  }

  const result = await createSchoolHoursRepo({
    durationCode: finalDurationCode,
    durationName,
    totalMinutes,
    status: normalizeStatus(status) || 'ACTIVE',
  });

  return result.rows[0];
};

export const updateSchoolHoursService = async ({
  id,
  durationCode,
  durationName,
  totalMinutes,
  status,
}: {
  id: string | number;
  durationCode?: string;
  durationName?: string;
  totalMinutes?: number;
  status?: string;
}) => {
  if (durationName) {
    const duplicateName = await existsDurationNameRepo({
      durationName,
      excludeId: id,
    });
    if (duplicateName.rowCount) {
      throw new Error(
        'A school hours record with this duration name already exists. Please use a different Duration Name.'
      );
    }
  }

  if (durationCode) {
    const duplicateCode = await existsDurationCodeRepo({
      durationCode,
      excludeId: id,
    });
    if (duplicateCode.rowCount) {
      throw new Error(
        'A school hours record with this code already exists. Please use a different code.'
      );
    }
  }

  const result = await updateSchoolHoursRepo({
    id,
    durationCode,
    durationName,
    totalMinutes,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteSchoolHoursService = async ({
  id,
  durationCode,
}: {
  id?: string | number;
  durationCode?: string;
}) => {
  if (id !== undefined && id !== null) {
    return await softDeleteSchoolHoursByIdRepo(id);
  }

  if (durationCode) {
    return await softDeleteSchoolHoursByCodeRepo(durationCode);
  }

  throw new Error('Provide id or durationCode for delete');
};
