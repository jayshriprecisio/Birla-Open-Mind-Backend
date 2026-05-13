import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import { formatApiError } from '@/backend/utils/api-error';
import {
  createCalculationBasisService,
  deleteCalculationBasisService,
  listCalculationBasisPaginatedService,
  updateCalculationBasisService,
} from './calculation-basis.service';
import {
  createCalculationBasisSchema,
  deleteCalculationBasisSchema,
  listCalculationBasisQuerySchema,
  updateCalculationBasisSchema,
} from './calculation-basis.validation';

function httpStatusForError(message: string): number {
  if (message.startsWith('Unauthorized')) return 401;
  if (message.startsWith('Forbidden')) return 403;
  return 400;
}

const getUserId = (id: string) => {
  const parsed = Number(id);
  return Number.isNaN(parsed) ? 1 : parsed;
};

export const getCalculationBasisController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const { searchParams } = req.nextUrl;
    const raw = {
      page: searchParams.get('page') ?? undefined,
      pageSize: searchParams.get('pageSize') ?? undefined,
      q: searchParams.get('q') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    };

    const validated = listCalculationBasisQuerySchema.parse(raw);
    const statusFilter =
      validated.status === 'ACTIVE' || validated.status === 'INACTIVE'
        ? validated.status
        : '';

    const { rows, total } = await listCalculationBasisPaginatedService({
      page: validated.page,
      pageSize: validated.pageSize,
      q: validated.q ?? '',
      statusFilter,
    });

    return NextResponse.json({
      success: true,
      data: rows,
      total,
      page: validated.page,
      pageSize: validated.pageSize,
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: httpStatusForError(message) }
    );
  }
};

export const createCalculationBasisController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      calculationBasisName:
        body.calculationBasisName ??
        body.CalculationBasisName ??
        body.CalculationBasis ??
        body['Calculation Basis For Charges'] ??
        body.Name,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = createCalculationBasisSchema.parse(merged);

    const data = await createCalculationBasisService({
      calculationBasisName: validated.calculationBasisName,
      status: validated.status,
      createdBy: getUserId(user.id),
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Calculation basis created successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const updateCalculationBasisController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const merged = {
      ...body,
      id: body.id ?? body.internalId ?? body.ID,
      calculationBasisName:
        body.calculationBasisName ??
        body.CalculationBasisName ??
        body.CalculationBasis ??
        body['Calculation Basis For Charges'] ??
        body.Name,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    };
    const validated = updateCalculationBasisSchema.parse(merged);

    const data = await updateCalculationBasisService({
      id: validated.id,
      calculationBasisName: validated.calculationBasisName,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, message: 'Calculation basis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Calculation basis updated successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};

export const deleteCalculationBasisController = async (req: NextRequest) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteCalculationBasisSchema.parse({
      id: body.id ?? body.internalId ?? body.ID,
    });

    const result = await deleteCalculationBasisService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        { success: false, message: 'Calculation basis not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Calculation basis deleted successfully',
    });
  } catch (error: unknown) {
    const message = formatApiError(error);
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
};
