import {
  createBrandRepo,
  deleteBrandByIdRepo,
  existsBrandCodeRepo,
  existsBrandNameRepo,
  getBrandsRepo,
  updateBrandRepo,
} from './brand.repository';

const normalizeStatus = (status?: string) => {
  if (!status) return undefined;
  return status.toUpperCase();
};

export const createBrandService = async ({
  name,
  brandCode,
  status,
}: {
  name: string;
  brandCode: string;
  status?: string;
}) => {
  const dupCode = await existsBrandCodeRepo({ brandCode });
  if (dupCode.rowCount) {
    throw new Error(
      'This brand code is already in use. Please choose another.'
    );
  }

  const dupName = await existsBrandNameRepo({ name });
  if (dupName.rowCount) {
    throw new Error(
      'A brand with this name already exists. Please use a different name.'
    );
  }

  const finalStatus = normalizeStatus(status) || 'ACTIVE';

  const result = await createBrandRepo({
    name,
    brandCode,
    status: finalStatus,
  });

  return result.rows[0];
};

export const getBrandsService = async () => {
  const result = await getBrandsRepo();
  return result.rows;
};

export const updateBrandService = async ({
  id,
  name,
  brandCode,
  status,
}: {
  id: string | number;
  name?: string;
  brandCode?: string;
  status?: string;
}) => {
  if (brandCode) {
    const dup = await existsBrandCodeRepo({
      brandCode,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'This brand code is already in use. Please choose another.'
      );
    }
  }

  if (name) {
    const dup = await existsBrandNameRepo({
      name,
      excludeId: id,
    });
    if (dup.rowCount) {
      throw new Error(
        'A brand with this name already exists. Please use a different name.'
      );
    }
  }

  const result = await updateBrandRepo({
    id,
    name,
    brandCode,
    status: normalizeStatus(status),
  });

  return result.rows[0] || null;
};

export const deleteBrandService = async (
  id: string | number
) => {
  return await deleteBrandByIdRepo(id);
};
