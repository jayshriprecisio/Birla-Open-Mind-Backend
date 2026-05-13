import {
  createAcademicYearRepo,
  existsAcademicYearNameRepo,
  existsAcademicYearShortRepo,
  listAcademicYearsRepo,
  softDeleteAcademicYearRepo,
  updateAcademicYearRepo,
} from './academicYear.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createAcademicYearService = async (args: {
  name: string;
  shortForm: string;
  shortForm2Digit: string;
  status?: string;
  createdBy: string | null;
}) => {
  if ((await existsAcademicYearNameRepo(args.name)).rowCount) {
    throw new Error(
      'An academic year with this name already exists. Please use a different name.'
    );
  }
  if ((await existsAcademicYearShortRepo(args.shortForm)).rowCount) {
    throw new Error(
      'An academic year with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createAcademicYearRepo({
    name: args.name,
    shortForm: args.shortForm,
    shortForm2Digit: args.shortForm2Digit,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listAcademicYearsService = async () => {
  const r = await listAcademicYearsRepo();
  return r.rows;
};

export const updateAcademicYearService = async (args: {
  id: string | number;
  name: string;
  shortForm: string;
  shortForm2Digit: string;
  status: string;
  updatedBy: string | null;
}) => {
  if ((await existsAcademicYearNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'An academic year with this name already exists. Please use a different name.'
    );
  }
  if ((await existsAcademicYearShortRepo(args.shortForm, args.id)).rowCount) {
    throw new Error(
      'An academic year with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateAcademicYearRepo({
    id: args.id,
    name: args.name,
    shortForm: args.shortForm,
    shortForm2Digit: args.shortForm2Digit,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteAcademicYearService = (id: string | number) =>
  softDeleteAcademicYearRepo(id);
