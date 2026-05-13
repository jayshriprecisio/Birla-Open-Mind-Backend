import {
  createMotherTongueRepo,
  existsMotherTongueNameRepo,
  listMotherTonguesRepo,
  softDeleteMotherTongueRepo,
  updateMotherTongueRepo,
} from './mother-tongue.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 150);

const normalizeDisplayOrder = (displayOrder?: number) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createMotherTongueService = async (args: {
  name: string;
  displayOrder?: number;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  if ((await existsMotherTongueNameRepo(name)).rowCount) {
    throw new Error(
      'A mother tongue with this name already exists. Please use a different name.'
    );
  }
  const result = await createMotherTongueRepo({
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return result.rows[0];
};

export const listMotherTonguesService = async () => {
  const result = await listMotherTonguesRepo();
  return result.rows;
};

export const updateMotherTongueService = async (args: {
  id: string | number;
  name: string;
  displayOrder?: number;
  status: string;
}) => {
  const name = normalizeName(args.name);
  if ((await existsMotherTongueNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A mother tongue with this name already exists. Please use a different name.'
    );
  }
  const result = await updateMotherTongueRepo({
    id: args.id,
    name,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
  });
  return result.rows[0] ?? null;
};

export const deleteMotherTongueService = (id: string | number) =>
  softDeleteMotherTongueRepo(id);
