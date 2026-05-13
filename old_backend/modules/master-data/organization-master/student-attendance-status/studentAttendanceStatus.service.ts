import {
  createStudentAttendanceStatusRepo,
  existsStudentAttendanceStatusNameRepo,
  existsStudentAttendanceStatusShortRepo,
  listStudentAttendanceStatusesRepo,
  softDeleteStudentAttendanceStatusRepo,
  updateStudentAttendanceStatusRepo,
} from './studentAttendanceStatus.repository';

const normalizeStatus = (status?: string) =>
  status?.toUpperCase() === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';

export const createStudentAttendanceStatusService = async (args: {
  name: string;
  shortForm: string;
  status?: string;
  createdBy: string | null;
}) => {
  if ((await existsStudentAttendanceStatusNameRepo(args.name)).rowCount) {
    throw new Error(
      'A student attendance status with this name already exists. Please use a different name.'
    );
  }
  if ((await existsStudentAttendanceStatusShortRepo(args.shortForm)).rowCount) {
    throw new Error(
      'A student attendance status with this short form already exists. Please use a different short form.'
    );
  }
  const r = await createStudentAttendanceStatusRepo({
    name: args.name,
    shortForm: args.shortForm,
    status: normalizeStatus(args.status),
    createdBy: args.createdBy,
  });
  return r.rows[0];
};

export const listStudentAttendanceStatusesService = async () => {
  const r = await listStudentAttendanceStatusesRepo();
  return r.rows;
};

export const updateStudentAttendanceStatusService = async (args: {
  id: string | number;
  name: string;
  shortForm: string;
  status: string;
  updatedBy: string | null;
}) => {
  if ((await existsStudentAttendanceStatusNameRepo(args.name, args.id)).rowCount) {
    throw new Error(
      'A student attendance status with this name already exists. Please use a different name.'
    );
  }
  if (
    (await existsStudentAttendanceStatusShortRepo(args.shortForm, args.id))
      .rowCount
  ) {
    throw new Error(
      'A student attendance status with this short form already exists. Please use a different short form.'
    );
  }
  const r = await updateStudentAttendanceStatusRepo({
    id: args.id,
    name: args.name,
    shortForm: args.shortForm,
    status: normalizeStatus(args.status),
    updatedBy: args.updatedBy,
  });
  return r.rows[0] ?? null;
};

export const deleteStudentAttendanceStatusService = (id: string | number) =>
  softDeleteStudentAttendanceStatusRepo(id);
