import {
  createWinterRepo,
  existsWinterCodeRepo,
  existsWinterRangeRepo,
  getWintersRepo,
  softDeleteWinterByCodeRepo,
  softDeleteWinterByIdRepo,
  updateWinterRepo,
} from './winter.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const getWintersService = async () => {
  const result = await getWintersRepo();
  return result.rows;
};

export const createWinterService = async ({
  winterCode,
  winterDurationDays,
  winterStartDate,
  winterEndDate,
  status,
}: {
  winterCode?: string;
  winterDurationDays: number;
  winterStartDate: string;
  winterEndDate: string;
  status?: string;
}) => {
  const finalWinterCode =
    winterCode || `WIN-${Date.now()}`;

  const duplicateCode = await existsWinterCodeRepo({
    winterCode: finalWinterCode,
  });
  if (duplicateCode.rowCount) {
    throw new Error(
      'A winter record with this code already exists. Please try again.'
    );
  }

  const duplicateRange = await existsWinterRangeRepo({
    winterStartDate,
    winterEndDate,
  });
  if (duplicateRange.rowCount) {
    throw new Error(
      'A winter record with this date range already exists.'
    );
  }

  const result = await createWinterRepo({
    winterCode: finalWinterCode,
    winterDurationDays,
    winterStartDate,
    winterEndDate,
    status: normalizeStatus(status) || 'ACTIVE',
  });

  return result.rows[0];
};

export const updateWinterService = async ({
  id,
  winterCode,
  winterDurationDays,
  winterStartDate,
  winterEndDate,
  status,
}: {
  id: string | number;
  winterCode?: string;
  winterDurationDays?: number;
  winterStartDate?: string;
  winterEndDate?: string;
  status?: string;
}) => {
  if (winterCode) {
    const duplicateCode = await existsWinterCodeRepo({
      winterCode,
      excludeId: id,
    });
    if (duplicateCode.rowCount) {
      throw new Error(
        'A winter record with this code already exists. Please use a different code.'
      );
    }
  }

  if (winterStartDate && winterEndDate) {
    const duplicateRange = await existsWinterRangeRepo({
      winterStartDate,
      winterEndDate,
      excludeId: id,
    });
    if (duplicateRange.rowCount) {
      throw new Error(
        'A winter record with this date range already exists.'
      );
    }
  }

  const result = await updateWinterRepo({
    id,
    winterCode,
    winterDurationDays,
    winterStartDate,
    winterEndDate,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteWinterService = async ({
  id,
  winterCode,
}: {
  id?: string | number;
  winterCode?: string;
}) => {
  if (id !== undefined && id !== null) {
    return await softDeleteWinterByIdRepo(id);
  }

  if (winterCode) {
    return await softDeleteWinterByCodeRepo(winterCode);
  }

  throw new Error('Provide id or winterCode for delete');
};
