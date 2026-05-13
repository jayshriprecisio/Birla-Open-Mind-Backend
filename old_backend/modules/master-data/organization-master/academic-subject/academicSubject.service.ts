import {
  createAcademicSubjectRepo,
  existsAcademicSubjectNameRepo,
  existsAcademicSubjectShortFormRepo,
  listAcademicSubjectsRepo,
  softDeleteAcademicSubjectRepo,
  updateAcademicSubjectRepo,
} from './academicSubject.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return 'ACTIVE';
  return status.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
};

const nullableShortForm = (s?: string | null) => {
  const t = (s ?? '').trim();
  return t === '' ? null : t.slice(0, 20);
};

export const createAcademicSubjectService = async ({
  name,
  shortForm,
  status,
  createdBy,
}: {
  name: string;
  shortForm?: string | null;
  status?: string;
  createdBy: string | null;
}) => {
  const sf = nullableShortForm(shortForm);
  const dupName = await existsAcademicSubjectNameRepo({ name });
  if (dupName.rowCount) {
    throw new Error(
      'A subject with this name already exists. Please use a different name.'
    );
  }
  if (sf) {
    const dupSf = await existsAcademicSubjectShortFormRepo({
      shortForm: sf,
    });
    if (dupSf.rowCount) {
      throw new Error(
        'A subject with this short form already exists. Please use a different short form.'
      );
    }
  }

  const r = await createAcademicSubjectRepo({
    name,
    shortForm: sf,
    status: normalizeStatus(status),
    createdBy,
  });
  return r.rows[0];
};

export const listAcademicSubjectsService = async () => {
  const r = await listAcademicSubjectsRepo();
  return r.rows;
};

export const updateAcademicSubjectService = async ({
  id,
  name,
  shortForm,
  status,
  updatedBy,
}: {
  id: string | number;
  name: string;
  shortForm?: string | null;
  status: string;
  updatedBy: string | null;
}) => {
  const sf = nullableShortForm(shortForm);
  const dupName = await existsAcademicSubjectNameRepo({
    name,
    excludeId: id,
  });
  if (dupName.rowCount) {
    throw new Error(
      'A subject with this name already exists. Please use a different name.'
    );
  }
  if (sf) {
    const dupSf = await existsAcademicSubjectShortFormRepo({
      shortForm: sf,
      excludeId: id,
    });
    if (dupSf.rowCount) {
      throw new Error(
        'A subject with this short form already exists. Please use a different short form.'
      );
    }
  }

  const r = await updateAcademicSubjectRepo({
    id,
    name,
    shortForm: sf,
    status: normalizeStatus(status),
    updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteAcademicSubjectService = async (id: string | number) => {
  return softDeleteAcademicSubjectRepo(id);
};
