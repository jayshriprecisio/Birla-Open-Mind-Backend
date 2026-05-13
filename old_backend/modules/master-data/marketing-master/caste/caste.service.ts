import {
  createCasteRepo,
  existsCasteNameRepo,
  existsCasteShortFormRepo,
  listCastesRepo,
  softDeleteCasteRepo,
  updateCasteRepo,
} from './caste.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const normalizeName = (name: string) => name.trim().slice(0, 150);

const normalizeShortForm = (shortForm?: string) => {
  const value = (shortForm ?? '').trim().slice(0, 20);
  return value === '' ? null : value;
};

const normalizeDisplayOrder = (displayOrder?: number) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createCasteService = async (args: {
  name: string;
  shortForm?: string;
  displayOrder?: number;
  status?: string;
  createdBy: number | null;
}) => {
  const name = normalizeName(args.name);
  const shortForm = normalizeShortForm(args.shortForm);

  if ((await existsCasteNameRepo(name)).rowCount) {
    throw new Error(
      'A caste with this name already exists. Please use a different name.'
    );
  }

  if (shortForm && (await existsCasteShortFormRepo(shortForm)).rowCount) {
    throw new Error(
      'A caste with this short form already exists. Please use a different short form.'
    );
  }

  const result = await createCasteRepo({
    name,
    shortForm,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });

  return result.rows[0];
};

export const listCastesService = async () => {
  const result = await listCastesRepo();
  return result.rows;
};

export const updateCasteService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string;
  displayOrder?: number;
  status: string;
}) => {
  const name = normalizeName(args.name);
  const shortForm = normalizeShortForm(args.shortForm);

  if ((await existsCasteNameRepo(name, args.id)).rowCount) {
    throw new Error(
      'A caste with this name already exists. Please use a different name.'
    );
  }

  if (
    shortForm &&
    (await existsCasteShortFormRepo(shortForm, args.id)).rowCount
  ) {
    throw new Error(
      'A caste with this short form already exists. Please use a different short form.'
    );
  }

  const result = await updateCasteRepo({
    id: args.id,
    name,
    shortForm,
    displayOrder: normalizeDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
  });

  return result.rows[0] ?? null;
};

export const deleteCasteService = (id: string | number) =>
  softDeleteCasteRepo(id);

