import {
  createNationalityRepo,
  existsNationalityNameRepo,
  listNationalitiesRepo,
  softDeleteNationalityRepo,
  updateNationalityRepo,
} from './nationality.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 150);

const normalizeDisplayOrder = (displayOrder?: number) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createNationalityService = async (args: {
  name: string;
  displayOrder?: number;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  if ((await existsNationalityNameRepo(name)).rowCount) {
    throw new Error(
      'A nationality with this name already exists. Please use a different name.'
    );
  }
  const result = await createNationalityRepo({
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return result.rows[0];
};

export const listNationalitiesService = async () => {
  const result = await listNationalitiesRepo();
  return result.rows;
};

export const updateNationalityService = async (args: {
  id: string | number;
  name: string;
  displayOrder?: number;
  status: string;
}) => {
  const name = normalizeName(args.name);
  if ((await existsNationalityNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A nationality with this name already exists. Please use a different name.'
    );
  }
  const result = await updateNationalityRepo({
    id: args.id,
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
  });
  return result.rows[0] ?? null;
};

export const deleteNationalityService = (id: string | number) =>
  softDeleteNationalityRepo(id);
