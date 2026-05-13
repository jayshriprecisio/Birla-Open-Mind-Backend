import {
  createTermRepo,
  existsTermNameRepo,
  existsTermShortFormRepo,
  getTermsRepo,
  softDeleteTermByIdRepo,
  updateTermRepo,
} from './term.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createTermService = async ({
  termName,
  shortForm,
  status,
  createdBy,
}: {
  termName: string;
  shortForm: string;
  status?: string;
  createdBy: number;
}) => {
  const dupName = await existsTermNameRepo({ termName });
  if (dupName.rowCount) {
    throw new Error(
      'A term with this name already exists. Please use a different name.'
    );
  }

  const dupShort = await existsTermShortFormRepo({ shortForm });
  if (dupShort.rowCount) {
    throw new Error(
      'A term with this short form already exists. Please use a different short form.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createTermRepo({
    termName,
    shortForm,
    status: finalStatus,
    createdBy,
  });

  return result.rows[0];
};

export const getTermsService = async () => {
  const result = await getTermsRepo();
  return result.rows;
};

export const updateTermService = async ({
  id,
  termName,
  shortForm,
  status,
}: {
  id: string | number;
  termName?: string;
  shortForm?: string;
  status?: string;
}) => {
  if (termName) {
    const dup = await existsTermNameRepo({
      termName,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A term with this name already exists. Please use a different name.'
      );
    }
  }

  if (shortForm) {
    const dup = await existsTermShortFormRepo({
      shortForm,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A term with this short form already exists. Please use a different short form.'
      );
    }
  }

  const result = await updateTermRepo({
    id,
    termName,
    shortForm,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteTermService = async (
  id: string | number
) => {
  return await softDeleteTermByIdRepo(id);
};
