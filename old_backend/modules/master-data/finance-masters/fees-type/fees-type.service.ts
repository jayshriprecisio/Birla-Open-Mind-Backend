import {
  countFeesTypesRepo,
  createFeesTypeRepo,
  existsFeesTypeNameRepo,
  listFeesTypesPaginatedRepo,
  softDeleteFeesTypeByIdRepo,
  updateFeesTypeRepo,
} from './fees-type.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createFeesTypeService = async ({
  feesTypeName,
  status,
  createdBy,
}: {
  feesTypeName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsFeesTypeNameRepo({ feesTypeName });
  if (dup.rowCount) {
    throw new Error(
      'A fees type with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createFeesTypeRepo({
    feesTypeName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export type ListFeesTypeParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listFeesTypesPaginatedService = async (
  params: ListFeesTypeParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countFeesTypesRepo(filterBase),
    listFeesTypesPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateFeesTypeService = async ({
  id,
  feesTypeName,
  status,
}: {
  id: string | number;
  feesTypeName?: string;
  status?: string;
}) => {
  if (feesTypeName) {
    const dup = await existsFeesTypeNameRepo({
      feesTypeName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A fees type with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateFeesTypeRepo({
    id,
    feesTypeName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteFeesTypeService = async (id: string | number) => {
  return softDeleteFeesTypeByIdRepo(id);
};
