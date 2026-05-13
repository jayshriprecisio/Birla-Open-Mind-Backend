import {
  countCalculationBasisRepo,
  createCalculationBasisRepo,
  existsCalculationBasisNameRepo,
  listCalculationBasisPaginatedRepo,
  softDeleteCalculationBasisByIdRepo,
  updateCalculationBasisRepo,
} from './calculation-basis.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createCalculationBasisService = async ({
  calculationBasisName,
  status,
  createdBy,
}: {
  calculationBasisName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsCalculationBasisNameRepo({ calculationBasisName });
  if (dup.rowCount) {
    throw new Error(
      'A calculation basis value with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createCalculationBasisRepo({
    calculationBasisName,
    status: finalStatus,
    createdBy,
  });
  return result.rows[0];
};

export type ListCalculationBasisParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listCalculationBasisPaginatedService = async (
  params: ListCalculationBasisParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countCalculationBasisRepo(filterBase),
    listCalculationBasisPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateCalculationBasisService = async ({
  id,
  calculationBasisName,
  status,
}: {
  id: string | number;
  calculationBasisName?: string;
  status?: string;
}) => {
  if (calculationBasisName) {
    const dup = await existsCalculationBasisNameRepo({
      calculationBasisName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A calculation basis value with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateCalculationBasisRepo({
    id,
    calculationBasisName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteCalculationBasisService = async (id: string | number) => {
  return softDeleteCalculationBasisByIdRepo(id);
};
