import {
  createDivisionRepo,
  existsDivisionNameRepo,
  getDivisionsRepo,
  softDeleteDivisionByIdRepo,
  updateDivisionRepo,
} from './division.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createDivisionService = async ({
  divisionName,
  status,
  createdBy,
}: {
  divisionName: string;
  status?: string;
  createdBy: number;
}) => {
  const duplicate = await existsDivisionNameRepo({
    divisionName,
  });

  if (duplicate.rowCount) {
    throw new Error(
      'A division with this name already exists. Please use a different name.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createDivisionRepo({
    divisionName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getDivisionsService = async () => {
  const result = await getDivisionsRepo();
  return result.rows;
};

export const updateDivisionService = async ({
  id,
  divisionName,
  status,
}: {
  id: string | number;
  divisionName?: string;
  status?: string;
}) => {
  if (divisionName) {
    const duplicate = await existsDivisionNameRepo({
      divisionName,
      excludeId: id,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'A division with this name already exists. Please use a different name.'
      );
    }
  }

  const result = await updateDivisionRepo({
    id,
    divisionName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteDivisionService = async (
  id: string | number
) => {
  return await softDeleteDivisionByIdRepo(id);
};
