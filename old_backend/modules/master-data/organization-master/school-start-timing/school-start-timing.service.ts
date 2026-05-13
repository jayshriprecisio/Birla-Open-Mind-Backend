import {
  createSchoolStartTimingRepo,
  existsShiftNameRepo,
  getSchoolStartTimingsRepo,
  softDeleteSchoolStartTimingByCodeRepo,
  softDeleteSchoolStartTimingByIdRepo,
  updateSchoolStartTimingRepo,
} from './school-start-timing.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createSchoolStartTimingService =
  async ({
    shiftName,
    startTime,
    endTime,
    timingCode,
    status,
    createdBy,
  }: {
    shiftName: string;
    startTime: string;
    endTime: string;
    timingCode?: string;
    status?: string;
    createdBy: string;
  }) => {
    const duplicate = await existsShiftNameRepo({
      shiftName,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'A shift with this name already exists. Please use a different Shift Name.'
      );
    }

    const finalTimingCode =
      timingCode || `TIM-${Date.now()}`;
    const finalStatus =
      normalizeStatus(status) || 'ACTIVE';

    const result =
      await createSchoolStartTimingRepo({
        timingCode: finalTimingCode,
        shiftName,
        startTime,
        endTime,
        status: finalStatus,
        createdBy,
      });

    return result.rows[0];
  };

export const getSchoolStartTimingsService =
  async () => {
    const result =
      await getSchoolStartTimingsRepo();
    return result.rows;
  };

export const updateSchoolStartTimingService =
  async ({
    id,
    timingCode,
    shiftName,
    startTime,
    endTime,
    status,
    updatedBy,
  }: {
    id: string | number;
    timingCode?: string;
    shiftName?: string;
    startTime?: string;
    endTime?: string;
    status?: string;
    updatedBy: string;
  }) => {
    if (shiftName) {
      const duplicate = await existsShiftNameRepo({
        shiftName,
        excludeId: id,
      });

      if (duplicate.rowCount) {
        throw new Error(
          'A shift with this name already exists. Please use a different Shift Name.'
        );
      }
    }

    const result =
      await updateSchoolStartTimingRepo({
        id,
        timingCode,
        shiftName,
        startTime,
        endTime,
        status: normalizeStatus(status),
        updatedBy,
      });

    return result.rows[0] || null;
  };

export const deleteSchoolStartTimingService =
  async ({
    id,
    timingCode,
    updatedBy,
  }: {
    id?: string | number;
    timingCode?: string;
    updatedBy: string;
  }) => {
    if (
      id !== undefined &&
      id !== null
    ) {
      return await softDeleteSchoolStartTimingByIdRepo(
        {
          id,
          updatedBy,
        }
      );
    }

    if (timingCode) {
      return await softDeleteSchoolStartTimingByCodeRepo(
        {
          timingCode,
          updatedBy,
        }
      );
    }

    throw new Error(
      'Provide id or timingCode for delete'
    );
  };
