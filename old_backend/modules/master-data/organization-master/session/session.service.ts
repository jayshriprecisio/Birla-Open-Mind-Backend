import {
  createSessionRepo,
  existsSessionNameRepo,
  getSessionsRepo,
  softDeleteSessionByIdRepo,
  updateSessionRepo,
} from './session.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createSessionService = async ({
  sessionName,
  status,
  createdBy,
}: {
  sessionName: string;
  status?: string;
  createdBy: number;
}) => {
  const duplicate = await existsSessionNameRepo({
    sessionName,
  });

  if (duplicate.rowCount) {
    throw new Error(
      'A session with this name already exists. Please use a different name.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createSessionRepo({
    sessionName,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getSessionsService = async () => {
  const result = await getSessionsRepo();
  return result.rows;
};

export const updateSessionService = async ({
  id,
  sessionName,
  status,
}: {
  id: string | number;
  sessionName?: string;
  status?: string;
}) => {
  if (sessionName) {
    const duplicate = await existsSessionNameRepo({
      sessionName,
      excludeId: id,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'A session with this name already exists. Please use a different name.'
      );
    }
  }

  const result = await updateSessionRepo({
    id,
    sessionName,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteSessionService = async (
  id: string | number
) => {
  return await softDeleteSessionByIdRepo(id);
};
