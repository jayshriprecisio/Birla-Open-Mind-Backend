import {
  createPrePrimarySubjectRepo,
  existsPpSubjectNameRepo,
  existsPpSubjectShortRepo,
  listPrePrimarySubjectsRepo,
  softDeletePrePrimarySubjectRepo,
  updatePrePrimarySubjectRepo,
} from './prePrimarySubject.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

const nullableShortForm = (s?: string | null) => {
  const t = (s ?? '').trim();
  return t === '' ? null : t.slice(0, 20);
};

export const createPrePrimarySubjectService = async (args: {
  name: string;
  shortForm?: string | null;
  status?: string;
  createdBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsPpSubjectNameRepo(args.name)).rowCount) {
    throw new Error(
      'A subject with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsPpSubjectShortRepo(sf)).rowCount) {
    throw new Error(
      'A subject with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createPrePrimarySubjectRepo({
    name: args.name,
    shortForm: sf,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listPrePrimarySubjectsService = async () => {
  const r = await listPrePrimarySubjectsRepo();
  return r.rows;
};

export const updatePrePrimarySubjectService = async (args: {
  id: string | number;
  name: string;
  shortForm?: string | null;
  status: string;
  updatedBy: string | null;
}) => {
  const sf = nullableShortForm(args.shortForm);
  if ((await existsPpSubjectNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A subject with this name already exists. Please use a different name.'
    );
  }
  if (sf && (await existsPpSubjectShortRepo(sf, args.id)).rowCount) {
    throw new Error(
      'A subject with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updatePrePrimarySubjectRepo({
    id: args.id,
    name: args.name,
    shortForm: sf,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deletePrePrimarySubjectService = (id: string | number) =>
  softDeletePrePrimarySubjectRepo(id);
