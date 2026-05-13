import {
  createGradeRepo,
  existsGradeNameRepo,
  existsGradeShortRepo,
  listGradesRepo,
  softDeleteGradeRepo,
  updateGradeRepo,
} from './grade.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const nullableShortForm = (s?: string | null) => {
  const t = (s ?? '').trim();
  return t === '' ? null : t.slice(0, 20);
};

const nullableDisplayOrder = (displayOrder?: number | null) =>
  Number.isInteger(displayOrder) ? Number(displayOrder) : null;

export const createGradeService = async (args: {
  name: string;
  shortForm?: string | null;
  displayOrder?: number | null;
  status?: string;
  createdBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsGradeNameRepo(args.name)).rowCount) {
    throw new Error(
      'A grade with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsGradeShortRepo(sf)).rowCount) {
    throw new Error(
      'A grade with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createGradeRepo({
    name: args.name,
    shortForm: sf,
    displayOrder: nullableDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listGradesService = async () => {
  const r = await listGradesRepo();
  return r.rows;
};

export const updateGradeService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string | null;
  displayOrder?: number | null;
  status: string;
  updatedBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsGradeNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A grade with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsGradeShortRepo(sf, args.id)).rowCount) {
    throw new Error(
      'A grade with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateGradeRepo({
    id: args.id,
    name: args.name,
    shortForm: sf,
    displayOrder: nullableDisplayOrder(args.displayOrder),
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteGradeService = (id: string | number) =>
  softDeleteGradeRepo(id);
