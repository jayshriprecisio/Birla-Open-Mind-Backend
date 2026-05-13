import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/backend/middleware/auth.middleware';
import { authorizeRole } from '@/backend/middleware/role.middleware';
import {
  createBrandService,
  deleteBrandService,
  getBrandsService,
  updateBrandService,
} from './brand.service';
import {
  createBrandSchema,
  deleteBrandSchema,
  updateBrandSchema,
} from './brand.validation';
import { formatApiError } from '@/backend/utils/api-error';

export const getBrandsController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const data = await getBrandsService();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 401 }
    );
  }
};

export const createBrandController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = createBrandSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await createBrandService({
      name: validated.name,
      brandCode: validated.brandCode,
      status: validated.status,
    });

    return NextResponse.json({
      success: true,
      data,
      message: 'Brand created successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};

export const updateBrandController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = updateBrandSchema.parse({
      ...body,
      status:
        typeof body.status === 'string'
          ? body.status.toUpperCase()
          : body.status,
    });

    const data = await updateBrandService({
      id: validated.id,
      name: validated.name,
      brandCode: validated.brandCode,
      status: validated.status,
    });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'Brand not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Brand updated successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};

export const deleteBrandController = async (
  req: NextRequest
) => {
  try {
    const user = authenticate(req);
    authorizeRole(user, ['SUPER_ADMIN']);

    const body = await req.json();
    const validated = deleteBrandSchema.parse(body);

    const result = await deleteBrandService(validated.id);

    if (!result.rowCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Brand not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: formatApiError(error),
      },
      { status: 400 }
    );
  }
};
