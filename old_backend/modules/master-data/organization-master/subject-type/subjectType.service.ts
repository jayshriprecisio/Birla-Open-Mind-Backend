import {
  createSubjectTypeRepo,
  existsSubjectTypeNameRepo,
  existsSubjectTypeShortRepo,
  listSubjectTypesRepo,
  softDeleteSubjectTypeRepo,
  updateSubjectTypeRepo,
} from './subjectType.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const nullableShortForm = (s?: string | null) => {
  const t = (s ?? '').trim();
  return t === '' ? null : t.slice(0, 20);
};

export const createSubjectTypeService = async (args: {
  name: string;
  shortForm?: string | null;
  status?: string;
  createdBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsSubjectTypeNameRepo(args.name)).rowCount) {
    throw new Error(
      'A subject type with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsSubjectTypeShortRepo(sf)).rowCount) {
    throw new Error(
      'A subject type with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createSubjectTypeRepo({
    name: args.name,
    shortForm: sf,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listSubjectTypesService = async () => {
  const r = await listSubjectTypesRepo();
  return r.rows;
};

export const updateSubjectTypeService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string | null;
  status: string;
  updatedBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsSubjectTypeNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A subject type with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsSubjectTypeShortRepo(sf, args.id)).rowCount) {
    throw new Error(
      'A subject type with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateSubjectTypeRepo({
    id: args.id,
    name: args.name,
    shortForm: sf,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteSubjectTypeService = (id: string | number) =>
  softDeleteSubjectTypeRepo(id);
