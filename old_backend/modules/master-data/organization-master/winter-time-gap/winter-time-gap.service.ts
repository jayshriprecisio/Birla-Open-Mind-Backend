import {
  createWinterTimeGapRepo,
  existsWinterTimeGapRepo,
  getWinterTimeGapsRepo,
  softDeleteWinterTimeGapByIdRepo,
  updateWinterTimeGapRepo,
} from './winter-time-gap.repository';

const normalizeStatus = (status?: string) => {
  return status ? status.toUpperCase() : undefined;
};

/**
 * Parse UI "HH:MM" into total minutes (stored as INTERVAL via SQL).
 */
export const parseTimingGapToMinutes = (
  raw: string | undefined
) => {
  const trimmed = String(raw ?? '').trim();
  const match = /^(\d{1,2}):([0-5]\d)$/.exec(trimmed);
  if (!match) {
    throw new Error(
      'Use HH:MM format (example: 00:30).'
    );
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const total = hours * 60 + minutes;
  if (total < 1 || total > 1440) {
    throw new Error(
      'Timing gap must be between 1 and 1440 minutes (24:00).'
    );
  }
  return total;
};

export const getWinterTimeGapService = async () => {
  const result = await getWinterTimeGapsRepo();
  return result.rows;
};

export const createWinterTimeGapService = async ({
  timing_gap,
  status,
  createdBy,
}: {
  timing_gap: string;
  status?: string;
  createdBy: number;
}) => {
  const minutes = parseTimingGapToMinutes(timing_gap);

  const duplicate = await existsWinterTimeGapRepo({
    gapMinutes: minutes,
  });

  if (duplicate.rowCount) {
    throw new Error(
      'This winter timing gap already exists.'
    );
  }

  const result = await createWinterTimeGapRepo({
    gapMinutes: minutes,
    status: normalizeStatus(status) || 'ACTIVE',
    createdBy,
  });

  return result.rows[0];
};

export const updateWinterTimeGapService = async ({
  id,
  timing_gap,
  status,
}: {
  id: number | string;
  timing_gap?: string;
  status?: string;
}) => {
  let minutes: number | undefined;
  if (timing_gap !== undefined && timing_gap !== '') {
    minutes = parseTimingGapToMinutes(timing_gap);
    const duplicate = await existsWinterTimeGapRepo({
      gapMinutes: minutes,
      excludeId: id,
    });

    if (duplicate.rowCount) {
      throw new Error(
        'This winter timing gap already exists.'
      );
    }
  }

  const result = await updateWinterTimeGapRepo({
    id,
    gapMinutes: minutes ?? null,
    status: normalizeStatus(status),
  });

  return result.rows[0];
};

export const deleteWinterTimeGapService = async (
  id: number | string
) => {
  return await softDeleteWinterTimeGapByIdRepo(id);
};
