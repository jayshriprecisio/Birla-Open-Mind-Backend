import {
  createGenderRepo,
  existsGenderNameRepo,
  existsGenderShortRepo,
  listGendersRepo,
  softDeleteGenderRepo,
  updateGenderRepo,
} from './gender.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 150);

const normalizeShortForm = (shortForm?: string) => {
  const value = (shortForm ?? '').trim().slice(0, 20);
  return value === '' ? null : value;
};

const normalizeDisplayOrder = (displayOrder?: number) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createGenderService = async (args: {
  name: string;
  shortForm?: string;
  displayOrder?: number;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  const shortForm = normalizeShortForm(args.shortForm);

  if ((await existsGenderNameRepo(name)).rowCount) {
    throw new Error(
      'A gender with this name already exists. Please use a different name.'
    );
  }
  if (shortForm && (await existsGenderShortRepo(shortForm)).rowCount) {
    throw new Error(
      'A gender with this short form already exists. Please use a different short form.'
    );
  }

  const result = await createGenderRepo({
    name,
    shortForm,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return result.rows[0];
};

export const listGendersService = async () => {
  const result = await listGendersRepo();
  return result.rows;
};

export const updateGenderService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string;
  displayOrder?: number;
  status: string;
}) => {
  const name = normalizeName(args.name);
  const shortForm = normalizeShortForm(args.shortForm);

  if ((await existsGenderNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A gender with this name already exists. Please use a different name.'
    );
  }
  if (shortForm && (await existsGenderShortRepo(shortForm, args.id)).rowCount) {
    throw new Error(
      'A gender with this short form already exists. Please use a different short form.'
    );
  }

  const result = await updateGenderRepo({
    id: args.id,
    name,
    shortForm,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
  });
  return result.rows[0] ?? null;
};

export const deleteGenderService = (id: string | number) =>
  softDeleteGenderRepo(id);

