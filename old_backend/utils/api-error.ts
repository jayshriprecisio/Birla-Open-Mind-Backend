import { ZodError } from 'zod';

/** Friendly labels for API field names shown in validation toasts */
const FIELD_LABELS: Record<string, string> = {
  timing_gap: 'Winter Timing Gap',
  winter_start_date: 'Winter Start Date',
  winter_end_date: 'Winter End Date',
  winter_duration_days: 'Winter Duration (in Days)',
  gap_minutes: 'Winter Timing Gap',
  boardName: 'Board Name',
  courseName: 'Course Name',
  divisionName: 'Division',
  batchName: 'Batch name',
  shortForm: 'Short form',
  termName: 'Term name',
  houseName: 'House name',
  zoneName: 'Zone name',
  brandCode: 'Brand code',
  sessionName: 'Session name',
  shiftName: 'Shift Name',
  totalMinutes: 'Total Minutes',
  durationName: 'Duration',
};

/**
 * Returns a single user-facing message for API responses.
 * Zod v4's `error.message` is often a JSON string of issues — never use it directly.
 */
export function formatApiError(error: unknown): string {
  if (error instanceof ZodError) {
    return error.issues
      .map((issue) => {
        const msg = issue.message;
        const path = issue.path?.filter(
          (p) => p !== undefined && p !== ''
        );
        if (!path?.length) return msg;
        const key = String(path[path.length - 1]);
        const label = FIELD_LABELS[key] ?? key.replace(/_/g, ' ');
        return `${label}: ${msg}`;
      })
      .join(' ');
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}

/**
 * Maps an unknown error to an HTTP-correct `{ status, message }`. Use this
 * in controller catch blocks so auth failures aren't reported as `400`s
 * and so unexpected exceptions don't leak DB internals to the client.
 */
export function toErrorResponse(error: unknown): {
  status: number;
  message: string;
} {
  if (error instanceof ZodError) {
    return { status: 400, message: formatApiError(error) };
  }
  if (error instanceof Error) {
    const m = error.message || '';
    if (/^Unauthorized/i.test(m) || /jwt|token/i.test(m)) {
      return { status: 401, message: 'Unauthorized' };
    }
    if (/^Forbidden/i.test(m)) {
      return { status: 403, message: 'Forbidden' };
    }
    if (/not found/i.test(m)) {
      return { status: 404, message: m };
    }
    return { status: 400, message: m };
  }
  return { status: 500, message: 'Something went wrong. Please try again.' };
}
