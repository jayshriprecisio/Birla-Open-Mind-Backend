import {
  createZoneRepo,
  existsZoneNameRepo,
  existsZoneShortFormRepo,
  getZonesRepo,
  softDeleteZoneByIdRepo,
  updateZoneRepo,
} from './zone.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createZoneService = async ({
  zoneName,
  shortForm,
  status,
  createdBy,
}: {
  zoneName: string;
  shortForm: string;
  status?: string;
  createdBy: number;
}) => {
  const dupName = await existsZoneNameRepo({ zoneName });
  if (dupName.rowCount) {
    throw new Error(
      'A zone with this name already exists. Please use a different name.'
    );
  }

  const dupShort = await existsZoneShortFormRepo({ shortForm });
  if (dupShort.rowCount) {
    throw new Error(
      'A zone with this short form already exists. Please use a different short form.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createZoneRepo({
    zoneName,
    shortForm,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getZonesService = async () => {
  const result = await getZonesRepo();
  return result.rows;
};

export const updateZoneService = async ({
  id,
  zoneName,
  shortForm,
  status,
}: {
  id: string | number;
  zoneName?: string;
  shortForm?: string;
  status?: string;
}) => {
  if (zoneName) {
    const dup = await existsZoneNameRepo({
      zoneName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A zone with this name already exists. Please use a different name.'
      );
    }
  }

  if (shortForm) {
    const dup = await existsZoneShortFormRepo({
      shortForm,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A zone with this short form already exists. Please use a different short form.'
      );
    }
  }

  const result = await updateZoneRepo({
    id,
    zoneName,
    shortForm,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteZoneService = async (
  id: string | number
) => {
  return await softDeleteZoneByIdRepo(id);
};
