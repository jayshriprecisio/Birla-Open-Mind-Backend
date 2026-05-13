import {
  countFeesSubTypesRepo,
  createFeesSubTypeRepo,
  existsFeesSubTypeNameRepo,
  listFeesSubTypesPaginatedRepo,
  softDeleteFeesSubTypeByIdRepo,
  updateFeesSubTypeRepo,
} from './fees-sub-type.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createFeesSubTypeService = async ({
  feesSubTypeName,
  status,
  createdBy,
}: {
  feesSubTypeName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsFeesSubTypeNameRepo({ feesSubTypeName });
  if (dup.rowCount) {
    throw new Error(
      'A fees sub type with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createFeesSubTypeRepo({
    feesSubTypeName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export type ListFeesSubTypeParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listFeesSubTypesPaginatedService = async (
  params: ListFeesSubTypeParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countFeesSubTypesRepo(filterBase),
    listFeesSubTypesPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateFeesSubTypeService = async ({
  id,
  feesSubTypeName,
  status,
}: {
  id: string | number;
  feesSubTypeName?: string;
  status?: string;
}) => {
  if (feesSubTypeName) {
    const dup = await existsFeesSubTypeNameRepo({
      feesSubTypeName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A fees sub type with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateFeesSubTypeRepo({
    id,
    feesSubTypeName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteFeesSubTypeService = async (id: string | number) => {
  return softDeleteFeesSubTypeByIdRepo(id);
};
