import { NextResponse } from 'next/server';
import { formatApiError } from '@/backend/utils/api-error';
import {
  listActiveGradesForEnquiryRepo,
  listActiveSchoolsForEnquiryRepo,
} from './repository';

/**
 * Public lookups for the unauthenticated Enquiry form.
 * Returns active schools + active grades in a single round-trip.
 */
export const getEnquiryLookupsController = async () => {
  try {
    const [schools, grades] = await Promise.all([
      listActiveSchoolsForEnquiryRepo(),
      listActiveGradesForEnquiryRepo(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: { schools, grades },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 500 }
    );
  }
};
