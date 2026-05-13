import {
  countFeesCategoriesRepo,
  createFeesCategoryRepo,
  existsFeesCategoryNameRepo,
  listFeesCategoriesPaginatedRepo,
  softDeleteFeesCategoryByIdRepo,
  updateFeesCategoryRepo,
} from './fees-category.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createFeesCategoryService = async ({
  feesCategoryName,
  status,
  createdBy,
}: {
  feesCategoryName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsFeesCategoryNameRepo({ feesCategoryName });
  if (dup.rowCount) {
    throw new Error(
      'A fees category with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createFeesCategoryRepo({
    feesCategoryName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export type ListFeesCategoryParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listFeesCategoriesPaginatedService = async (
  params: ListFeesCategoryParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countFeesCategoriesRepo(filterBase),
    listFeesCategoriesPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateFeesCategoryService = async ({
  id,
  feesCategoryName,
  status,
}: {
  id: string | number;
  feesCategoryName?: string;
  status?: string;
}) => {
  if (feesCategoryName) {
    const dup = await existsFeesCategoryNameRepo({
      feesCategoryName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A fees category with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateFeesCategoryRepo({
    id,
    feesCategoryName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteFeesCategoryService = async (id: string | number) => {
  return softDeleteFeesCategoryByIdRepo(id);
};
