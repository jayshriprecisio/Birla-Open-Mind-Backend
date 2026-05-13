import {
  createBatchRepo,
  existsBatchNameRepo,
  existsBatchShortFormRepo,
  getBatchesRepo,
  softDeleteBatchByIdRepo,
  updateBatchRepo,
} from './batch.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createBatchService = async ({
  batchName,
  shortForm,
  status,
  createdBy,
}: {
  batchName: string;
  shortForm: string;
  status?: string;
  createdBy: number;
}) => {
  const dupName = await existsBatchNameRepo({ batchName });
  if (dupName.rowCount) {
    throw new Error(
      'A batch with this name already exists. Please use a different name.'
    );
  }

  const dupShort = await existsBatchShortFormRepo({
    shortForm,
  });
  if (dupShort.rowCount) {
    throw new Error(
      'A batch with this short form already exists. Please use a different short form.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createBatchRepo({
    batchName,
    shortForm,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getBatchesService = async () => {
  const result = await getBatchesRepo();
  return result.rows;
};

export const updateBatchService = async ({
  id,
  batchName,
  shortForm,
  status,
}: {
  id: string | number;
  batchName?: string;
  shortForm?: string;
  status?: string;
}) => {
  if (batchName) {
    const dup = await existsBatchNameRepo({
      batchName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A batch with this name already exists. Please use a different name.'
      );
    }
  }

  if (shortForm) {
    const dup = await existsBatchShortFormRepo({
      shortForm,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A batch with this short form already exists. Please use a different short form.'
      );
    }
  }

  const result = await updateBatchRepo({
    id,
    batchName,
    shortForm,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteBatchService = async (
  id: string | number
) => {
  return await softDeleteBatchByIdRepo(id);
};
