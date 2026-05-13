const { pool } = require('../../config/db');

async function createSchoolTransaction(input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const schoolRes = await client.query(
      `
      INSERT INTO schools (
        zone_id, brand_id, brand_code, school_name, school_code, board, session_month,
        total_capacity, operational_capacity,
        address_line1, address_line2, address_line3, pin_code, country, state_province, city,
        phone_number, official_email, website_url,
        billing_name, billing_same_as_school,
        billing_address_line1, billing_address_line2, billing_address_line3,
        billing_pin_code, billing_country, billing_state_province, billing_city,
        affiliation_number, cbse_school_code, udise_code, status, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9,
        $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19,
        $20, $21,
        $22, $23, $24,
        $25, $26, $27, $28,
        $29, $30, $31, $32, $33::uuid
      )
      RETURNING school_id::text
      `,
      [
        input.zone_id,
        input.brand_id,
        input.brand_code,
        input.school_name,
        input.school_code,
        input.board,
        input.session_month,
        input.total_capacity,
        input.operational_capacity,
        input.address_line1,
        input.address_line2,
        input.address_line3,
        input.pin_code,
        input.country,
        input.state_province,
        input.city,
        input.phone_number,
        input.official_email,
        input.website_url,
        input.billing_name,
        input.billing_same_as_school,
        input.billing_address_line1,
        input.billing_address_line2,
        input.billing_address_line3,
        input.billing_pin_code,
        input.billing_country,
        input.billing_state_province,
        input.billing_city,
        input.affiliation_number,
        input.cbse_school_code,
        input.udise_code,
        input.status,
        input.created_by,
      ]
    );

    const school_id = schoolRes.rows[0]?.school_id;
    if (!school_id) {
      throw new Error('Failed to create school');
    }

    let order = 0;
    for (const p of (input.partners || [])) {
      const hasAny =
        (p.partner_name && p.partner_name.trim()) ||
        (p.partner_email && p.partner_email.trim()) ||
        (p.partner_mobile && p.partner_mobile.trim());
      if (!hasAny) continue;

      await client.query(
        `
        INSERT INTO school_partners (
          school_id, partner_name, partner_email, partner_mobile, sort_order
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          school_id,
          p.partner_name?.trim() || null,
          p.partner_email?.trim() || null,
          p.partner_mobile?.trim() || null,
          p.sort_order ?? order,
        ]
      );
      order += 1;
    }

    const isBomps = (input.brand_code || '').trim().toUpperCase() === 'BOMPS';

    if (isBomps) {
      await client.query(
        `
        INSERT INTO school_contacts (school_id, contact_type, full_name, email_login_id, phone_number)
        VALUES ($1, 'centre_head', $2, $3, $4)
        `,
        [
          school_id,
          input.centre_head.full_name,
          input.centre_head.email_login_id,
          input.centre_head.phone_number,
        ]
      );
    } else {
      const p = input.principal;
      if (!p) {
        throw new Error('Principal contact is required for this brand');
      }
      await client.query(
        `
        INSERT INTO school_contacts (school_id, contact_type, full_name, email_login_id, phone_number)
        VALUES
          ($1, 'centre_head', $2, $3, $4),
          ($1, 'principal', $5, $6, $7)
        `,
        [
          school_id,
          input.centre_head.full_name,
          input.centre_head.email_login_id,
          input.centre_head.phone_number,
          p.full_name,
          p.email_login_id,
          p.phone_number,
        ]
      );
    }

    await client.query('COMMIT');
    return { school_id };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

const JOIN_ZONE_SQL = `z.id::text = NULLIF(TRIM(BOTH FROM COALESCE(s.zone_id::text, '')), '')`;
const JOIN_BRAND_SQL = `b.id::text = NULLIF(TRIM(BOTH FROM COALESCE(s.brand_id::text, '')), '')`;

const SCHOOL_LIST_SELECT = `
  SELECT
    s.school_id::text AS school_id,
    s.school_name,
    s.school_code,
    s.brand_code,
    s.board,
    s.city,
    s.state_province,
    s.status,
    s.official_email,
    s.phone_number,
    s.udise_code,
    s.cbse_school_code,
    COALESCE(s.created_at, s.updated_at) AS created_at,
    COALESCE(z.zone_name, '') AS zone_name,
    CASE trim(both FROM COALESCE(s.session_month::text, ''))
      WHEN '1' THEN 'JAN' WHEN '2' THEN 'FEB' WHEN '3' THEN 'MAR' WHEN '4' THEN 'APR'
      WHEN '5' THEN 'MAY' WHEN '6' THEN 'JUN' WHEN '7' THEN 'JUL' WHEN '8' THEN 'AUG'
      WHEN '9' THEN 'SEP' WHEN '10' THEN 'OCT' WHEN '11' THEN 'NOV' WHEN '12' THEN 'DEC'
      ELSE ''
    END AS session_label,
    b.name AS brand_name,
    b.brand_code AS brand_master_code
  FROM schools s
  LEFT JOIN zone_master z ON ${JOIN_ZONE_SQL}
  INNER JOIN brand_master b ON ${JOIN_BRAND_SQL}
`;

const SORT_SQL = {
  created_at: 'COALESCE(s.created_at, s.updated_at)',
  school_name: 's.school_name',
  school_code: 's.school_code',
  city: 's.city',
};

const HAS_UDISE = `NULLIF(TRIM(COALESCE(s.udise_code, '')), '') IS NOT NULL`;
const HAS_CBSE = `NULLIF(TRIM(COALESCE(s.cbse_school_code, '')), '') IS NOT NULL`;

function buildSchoolListFilters(params) {
  const conditions = ['s.deleted_at IS NULL'];
  const values = [];
  let i = 1;

  const needle = (params.q || '').trim().toLowerCase();
  if (needle.length > 0) {
    values.push(needle);
    conditions.push(`(
      position($${i} in lower(s.school_name)) > 0 OR
      position($${i} in lower(s.school_code)) > 0 OR
      position($${i} in lower(s.city)) > 0 OR
      position($${i} in lower(s.official_email)) > 0 OR
      position($${i} in lower(z.zone_name)) > 0 OR
      position($${i} in lower(b.name)) > 0
    )`);
    i += 1;
  }

  if (params.status && params.status !== 'all') {
    values.push(params.status);
    conditions.push(`s.status = $${i}`);
    i += 1;
  }

  const zone = (params.zone || '').trim();
  if (zone.length > 0) {
    values.push(zone);
    conditions.push(`z.zone_name = $${i}`);
    i += 1;
  }

  const board = (params.board || '').trim();
  if (board.length > 0) {
    values.push(board);
    conditions.push(`s.board = $${i}`);
    i += 1;
  }

  if (params.brand && params.brand !== 'all') {
    values.push(params.brand);
    conditions.push(
      `upper(trim(COALESCE(b.brand_code::text, ''))) = upper($${i}::text)`
    );
    i += 1;
  }

  if (params.mapping === 'mapped') {
    conditions.push(`((${HAS_UDISE}) AND (${HAS_CBSE}))`);
  } else if (params.mapping === 'partial') {
    conditions.push(
      `((${HAS_UDISE}) OR (${HAS_CBSE})) AND NOT ((${HAS_UDISE}) AND (${HAS_CBSE}))`
    );
  } else if (params.mapping === 'unmapped') {
    conditions.push(`NOT ((${HAS_UDISE}) OR (${HAS_CBSE}))`);
  }

  return { whereSql: conditions.join(' AND '), values };
}

async function listSchoolsFilteredRepo(params) {
  const { whereSql, values } = buildSchoolListFilters(params);
  const orderCol = SORT_SQL[params.sortBy || 'school_name'];
  const orderDir = (params.sortOrder || 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const limit = parseInt(params.limit || 20, 10);
  const page = parseInt(params.page || 1, 10);
  const offset = (page - 1) * limit;

  const limitPlaceholder = values.length + 1;
  const offsetPlaceholder = values.length + 2;
  const dataValues = [...values, limit, offset];

  const countSql = `
    SELECT COUNT(*)::bigint AS c
    FROM schools s
    LEFT JOIN zone_master z ON ${JOIN_ZONE_SQL}
    INNER JOIN brand_master b ON ${JOIN_BRAND_SQL}
    WHERE ${whereSql}
  `;
  const dataSql = `
    ${SCHOOL_LIST_SELECT}
    WHERE ${whereSql}
    ORDER BY ${orderCol} ${orderDir}, s.school_id ASC
    LIMIT $${limitPlaceholder} OFFSET $${offsetPlaceholder}
  `;

  const [countResult, dataResult] = await Promise.all([
    pool.query(countSql, values),
    pool.query(dataSql, dataValues),
  ]);

  return { rows: dataResult.rows, total: Number(countResult.rows[0]?.c ?? 0) };
}

async function getSchoolsDashboardSummaryRepo() {
  const r = await pool.query(
    `
    SELECT
      COUNT(*)::bigint AS total,
      COUNT(*) FILTER (
        WHERE upper(trim(COALESCE(b.brand_code::text, ''))) = 'BOMIS'
      )::bigint AS bomis,
      COUNT(*) FILTER (
        WHERE upper(trim(COALESCE(b.brand_code::text, ''))) = 'BOMPS'
      )::bigint AS bomps,
      COUNT(*) FILTER (
        WHERE (${HAS_UDISE}) AND (${HAS_CBSE})
      )::bigint AS mapped,
      COUNT(*) FILTER (WHERE s.status = 'active')::bigint AS active
    FROM schools s
    INNER JOIN brand_master b ON ${JOIN_BRAND_SQL}
    WHERE s.deleted_at IS NULL
    `
  );
  const row = r.rows[0];
  return {
    total: Number(row?.total ?? 0),
    bomis: Number(row?.bomis ?? 0),
    bomps: Number(row?.bomps ?? 0),
    mapped: Number(row?.mapped ?? 0),
    active: Number(row?.active ?? 0),
  };
}

async function getSchoolByIdRepo(schoolId) {
  const school = await pool.query(
    `
    SELECT
      s.*,
      z.zone_name,
      b.name AS brand_name,
      b.brand_code AS brand_master_code
    FROM schools s
    INNER JOIN zone_master z ON ${JOIN_ZONE_SQL}
    INNER JOIN brand_master b ON ${JOIN_BRAND_SQL}
    WHERE s.school_id = $1::uuid AND s.deleted_at IS NULL
    `,
    [schoolId]
  );

  if (!school.rows.length) return null;

  const partners = await pool.query(
    `
    SELECT partner_id::text, partner_name, partner_email, partner_mobile, sort_order
    FROM school_partners
    WHERE school_id = $1::uuid
    ORDER BY sort_order ASC, created_at ASC
    `,
    [schoolId]
  );

  const contacts = await pool.query(
    `
    SELECT contact_type, full_name, email_login_id, phone_number, is_active
    FROM school_contacts
    WHERE school_id = $1::uuid
    `,
    [schoolId]
  );

  return {
    school: school.rows[0],
    partners: partners.rows,
    contacts: contacts.rows,
  };
}

async function softDeleteSchoolRepo(schoolId) {
  return pool.query(
    `
    UPDATE schools
    SET deleted_at = NOW(), updated_at = NOW()
    WHERE school_id = $1::uuid AND deleted_at IS NULL
    RETURNING school_id
    `,
    [schoolId]
  );
}

async function patchSchoolStatusRepo(schoolId, status) {
  return pool.query(
    `
    UPDATE schools
    SET status = $2, updated_at = NOW()
    WHERE school_id = $1::uuid AND deleted_at IS NULL
    RETURNING school_id::text
    `,
    [schoolId, status]
  );
}

async function updateSchoolTransaction(schoolId, input) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const upd = await client.query(
      `
      UPDATE schools SET
        zone_id = $2,
        brand_id = $3,
        brand_code = $4,
        school_name = $5,
        school_code = $6,
        board = $7,
        session_month = $8,
        total_capacity = $9,
        operational_capacity = $10,
        address_line1 = $11,
        address_line2 = $12,
        address_line3 = $13,
        pin_code = $14,
        country = $15,
        state_province = $16,
        city = $17,
        phone_number = $18,
        official_email = $19,
        website_url = $20,
        billing_name = $21,
        billing_same_as_school = $22,
        billing_address_line1 = $23,
        billing_address_line2 = $24,
        billing_address_line3 = $25,
        billing_pin_code = $26,
        billing_country = $27,
        billing_state_province = $28,
        billing_city = $29,
        affiliation_number = $30,
        cbse_school_code = $31,
        udise_code = $32,
        status = $33,
        updated_at = NOW()
      WHERE school_id = $1::uuid AND deleted_at IS NULL
      RETURNING school_id::text
      `,
      [
        schoolId,
        input.zone_id,
        input.brand_id,
        input.brand_code,
        input.school_name,
        input.school_code,
        input.board,
        input.session_month,
        input.total_capacity,
        input.operational_capacity,
        input.address_line1,
        input.address_line2,
        input.address_line3,
        input.pin_code,
        input.country,
        input.state_province,
        input.city,
        input.phone_number,
        input.official_email,
        input.website_url,
        input.billing_name,
        input.billing_same_as_school,
        input.billing_address_line1,
        input.billing_address_line2,
        input.billing_address_line3,
        input.billing_pin_code,
        input.billing_country,
        input.billing_state_province,
        input.billing_city,
        input.affiliation_number,
        input.cbse_school_code,
        input.udise_code,
        input.status,
      ]
    );

    if (!upd.rows.length) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `DELETE FROM school_partners WHERE school_id = $1::uuid`,
      [schoolId]
    );

    let order = 0;
    for (const p of (input.partners || [])) {
      const hasAny =
        (p.partner_name && p.partner_name.trim()) ||
        (p.partner_email && p.partner_email.trim()) ||
        (p.partner_mobile && p.partner_mobile.trim());
      if (!hasAny) continue;

      await client.query(
        `
        INSERT INTO school_partners (
          school_id, partner_name, partner_email, partner_mobile, sort_order
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          schoolId,
          p.partner_name?.trim() || null,
          p.partner_email?.trim() || null,
          p.partner_mobile?.trim() || null,
          p.sort_order ?? order,
        ]
      );
      order += 1;
    }

    await client.query(
      `DELETE FROM school_contacts WHERE school_id = $1::uuid`,
      [schoolId]
    );

    const isBomps = (input.brand_code || '').trim().toUpperCase() === 'BOMPS';

    if (isBomps) {
      await client.query(
        `
        INSERT INTO school_contacts (school_id, contact_type, full_name, email_login_id, phone_number)
        VALUES ($1, 'centre_head', $2, $3, $4)
        `,
        [
          schoolId,
          input.centre_head.full_name,
          input.centre_head.email_login_id,
          input.centre_head.phone_number,
        ]
      );
    } else {
      const p = input.principal;
      if (!p) {
        throw new Error('Principal contact is required for this brand');
      }
      await client.query(
        `
        INSERT INTO school_contacts (school_id, contact_type, full_name, email_login_id, phone_number)
        VALUES
          ($1, 'centre_head', $2, $3, $4),
          ($1, 'principal', $5, $6, $7)
        `,
        [
          schoolId,
          input.centre_head.full_name,
          input.centre_head.email_login_id,
          input.centre_head.phone_number,
          p.full_name,
          p.email_login_id,
          p.phone_number,
        ]
      );
    }

    await client.query('COMMIT');
    return { school_id: schoolId };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  createSchoolTransaction,
  listSchoolsFilteredRepo,
  getSchoolsDashboardSummaryRepo,
  getSchoolByIdRepo,
  softDeleteSchoolRepo,
  patchSchoolStatusRepo,
  updateSchoolTransaction,
};
