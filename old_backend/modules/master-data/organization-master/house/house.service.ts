import {
  createHouseRepo,
  existsHouseNameRepo,
  existsHouseShortFormRepo,
  getHousesRepo,
  softDeleteHouseByIdRepo,
  updateHouseRepo,
} from './house.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createHouseService = async ({
  houseName,
  shortForm,
  status,
  createdBy,
}: {
  houseName: string;
  shortForm: string;
  status?: string;
  createdBy: number;
}) => {
  const dupName = await existsHouseNameRepo({ houseName });
  if (dupName.rowCount) {
    throw new Error(
      'A house with this name already exists. Please use a different name.'
    );
  }

  const dupShort = await existsHouseShortFormRepo({ shortForm });
  if (dupShort.rowCount) {
    throw new Error(
      'A house with this short form already exists. Please use a different short form.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createHouseRepo({
    houseName,
    shortForm,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getHousesService = async () => {
  const result = await getHousesRepo();
  return result.rows;
};

export const updateHouseService = async ({
  id,
  houseName,
  shortForm,
  status,
}: {
  id: string | number;
  houseName?: string;
  shortForm?: string;
  status?: string;
}) => {
  if (houseName) {
    const dup = await existsHouseNameRepo({
      houseName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A house with this name already exists. Please use a different name.'
      );
    }
  }

  if (shortForm) {
    const dup = await existsHouseShortFormRepo({
      shortForm,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A house with this short form already exists. Please use a different short form.'
      );
    }
  }

  const result = await updateHouseRepo({
    id,
    houseName,
    shortForm,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteHouseService = async (
  id: string | number
) => {
  return await softDeleteHouseByIdRepo(id);
};
