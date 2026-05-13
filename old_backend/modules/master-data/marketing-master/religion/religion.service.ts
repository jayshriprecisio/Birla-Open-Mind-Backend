import {
  createReligionRepo,
  existsReligionNameRepo,
  listReligionsRepo,
  softDeleteReligionRepo,
  updateReligionRepo,
} from './religion.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 150);

const normalizeDisplayOrder = (displayOrder?: number) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createReligionService = async (args: {
  name: string;
  displayOrder?: number;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  if ((await existsReligionNameRepo(name)).rowCount) {
    throw new Error(
      'A religion with this name already exists. Please use a different name.'
    );
  }
  const result = await createReligionRepo({
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return result.rows[0];
};

export const listReligionsService = async () => {
  const result = await listReligionsRepo();
  return result.rows;
};

export const updateReligionService = async (args: {
  id: string | number;
  name: string;
  displayOrder?: number;
  status: string;
}) => {
  const name = normalizeName(args.name);
  if ((await existsReligionNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A religion with this name already exists. Please use a different name.'
    );
  }
  const result = await updateReligionRepo({
    id: args.id,
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
  });
  return result.rows[0] ?? null;
};

export const deleteReligionService = (id: string | number) =>
  softDeleteReligionRepo(id);

