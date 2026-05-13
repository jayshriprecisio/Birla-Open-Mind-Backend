import {
  countAcademicsRepo,
  createAcademicRepo,
  existsAcademicNameRepo,
  listAcademicsPaginatedRepo,
  softDeleteAcademicByIdRepo,
  updateAcademicRepo,
} from './academic.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createAcademicService = async ({
  academicName,
  status,
  createdBy,
}: {
  academicName: string;
  status?: string;
  createdBy: number;
}) => {
  const dup = await existsAcademicNameRepo({ academicName });
  if (dup.rowCount) {
    throw new Error(
      'An academic value with this name already exists. Please use a different value.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';
  const result = await createAcademicRepo({
    academicName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export type ListAcademicParams = {
  page: number;
  pageSize: number;
  q: string;
  statusFilter: '' | 'ACTIVE' | 'INACTIVE';
};

export const listAcademicsPaginatedService = async (
  params: ListAcademicParams
) => {
  const limit = params.pageSize;
  const offset = (params.page - 1) * params.pageSize;
  const filterBase = {
    q: params.q,
    statusFilter: params.statusFilter,
  };

  const [total, result] = await Promise.all([
    countAcademicsRepo(filterBase),
    listAcademicsPaginatedRepo({
      ...filterBase,
      limit,
      offset,
    }),
  ]);

  return { rows: result.rows, total };
};

export const updateAcademicService = async ({
  id,
  academicName,
  status,
}: {
  id: string | number;
  academicName?: string;
  status?: string;
}) => {
  if (academicName) {
    const dup = await existsAcademicNameRepo({
      academicName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'An academic value with this name already exists. Please use a different value.'
      );
    }
  }

  const result = await updateAcademicRepo({
    id,
    academicName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteAcademicService = async (id: string | number) => {
  return softDeleteAcademicByIdRepo(id);
};
