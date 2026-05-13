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

const nullableShortForm = (s?: string | null) => {
  const t = (s ?? '').trim();
  return t === '' ? null : t.slice(0, 20);
};

const nullableDisplayOrder = (displayOrder?: number | null) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createGenderService = async (args: {
  name: string;
  shortForm?: string | null;
  displayOrder?: number | null;
  status?: string;
  createdBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsGenderNameRepo(args.name)).rowCount) {
    throw new Error(
      'A gender with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsGenderShortRepo(sf)).rowCount) {
    throw new Error(
      'A gender with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createGenderRepo({
    name: args.name,
    shortForm: sf,
    displayOrder: nullableDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listGendersService = async () => {
  const r = await listGendersRepo();
  return r.rows;
};

export const updateGenderService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string | null;
  displayOrder?: number | null;
  status: string;
  updatedBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsGenderNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A gender with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsGenderShortRepo(sf, args.id)).rowCount) {
    throw new Error(
      'A gender with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateGenderRepo({
    id: args.id,
    name: args.name,
    shortForm: sf,
    displayOrder: nullableDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteGenderService = (id: string | number) =>
  softDeleteGenderRepo(id);
