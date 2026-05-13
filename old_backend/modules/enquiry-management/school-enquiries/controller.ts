import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createEnquirySchema,
  deleteEnquirySchema,
  listSchoolEnquiriesQuerySchema,
  phoneLookupSchema,
  updateEnquiryStatusSchema,
} from './validation';
import {
  createSchoolEnquiryService,
  findAdmissionInquiryByPhoneService,
  listSchoolEnquiriesFilteredService,
  softDeleteSchoolEnquiryService,
  updateSchoolEnquiryStatusService,
} from './service';

export const admissionInquiryByPhoneController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const phone = req.nextUrl.searchParams.get('phone') ?? '';
    const v = phoneLookupSchema.parse({ phone });
    const data = await findAdmissionInquiryByPhoneService(v.phone);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const listSchoolEnquiriesController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const rawQuery = Object.fromEntries(req.nextUrl.searchParams.entries());
    const query = listSchoolEnquiriesQuerySchema.parse(rawQuery);
    const data = await listSchoolEnquiriesFilteredService(query);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 401 }
    );
  }
};

export const updateSchoolEnquiryStatusController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const parsed = updateEnquiryStatusSchema.parse(body);
    const data = await updateSchoolEnquiryStatusService(
      parsed.enquiry_id,
      parsed.status,
      String(user.id)
    );
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data, message: 'Status updated successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const deleteSchoolEnquiryController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const enquiryId = req.nextUrl.searchParams.get('enquiry_id') ?? '';
    const parsed = deleteEnquirySchema.parse({ enquiry_id: enquiryId });
    const data = await softDeleteSchoolEnquiryService(parsed.enquiry_id, String(user.id));
    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Enquiry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data, message: 'Enquiry deleted successfully' });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};

export const createSchoolEnquiryController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);
    const body = await req.json();
    const v = createEnquirySchema.parse(body);
    const data = await createSchoolEnquiryService(String(user.id), v as Record<string, unknown>);
    return NextResponse.json({
      success: true,
      data,
      message: 'Enquiry created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: formatApiError(error) },
      { status: 400 }
    );
  }
};
