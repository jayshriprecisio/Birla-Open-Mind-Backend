/**
 * Strip spaces; lowercase email.
 * @param {string} v
 */
function trimStr(v) {
  if (v == null) return '';
  return String(v).trim();
}

/**
 * Normalize phone to digits-only form used for storage and duplicate checks (10-digit India mobile when possible).
 * @param {string} phone
 */
function normalizePhone(phone) {
  const s = trimStr(phone);
  if (!s) return '';
  let digits = s.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

/**
 * Lowercase email, trim.
 * @param {string} email
 */
function normalizeEmail(email) {
  return trimStr(email).toLowerCase();
}

/**
 * Pick first non-empty mapped field from raw row keys.
 * @param {Record<string, string>} raw
 * @param {string[]} keys normalized snake_case keys to try in order
 */
function pickRaw(raw, keys) {
  for (const k of keys) {
    if (raw[k] != null && String(raw[k]).trim() !== '') {
      return String(raw[k]).trim();
    }
  }
  return '';
}

/**
 * Map sheet `raw` object (normalized header keys) to canonical import fields.
 * @param {Record<string, string>} raw
 */
function mapRawToFields(raw) {
  const gradeRaw = pickRaw(raw, [
    'grade',
    'grade_name',
    'class',
    'standard',
    'applying_grade',
  ]);
  const parentFirstName = pickRaw(raw, [
  'parent_first_name',
  'first_name',
  'parentfirstname',
]);

const parentLastName = pickRaw(raw, [
  'parent_last_name',
  'last_name',
  'parentlastname',
]);

const parentName = pickRaw(raw, [
  'parent_name',
  'parentname',
  'guardian_name',
]);

  const phoneRaw = pickRaw(raw, [
    'phone',
    'phone_number',
    'mobile',
    'mobile_no',
    'mobileno',
    'contact_number',
    'parent_mobile',
  ]);
  const emailRaw = pickRaw(raw, ['email', 'email_id', 'e_mail', 'parent_email']);

  const relationship = pickRaw(raw, [
    'relationship_with_student',
    'relationship',
    'relation',
    'i_am',
    'iam',
  ]);
  const source = pickRaw(raw, [
    'source',
    'lead_source',
    'enquirysource',
    'enquiry_source',
    'enquirytype',
    'enquiry_type',
    'enquirypurpose',
    'enquiry_purpose',
  ]);
  const counsellorName = pickRaw(raw, [
    'counsellor_name',
    'counsellor',
    'counselor_name',
    'assignuser',
    'assign_user',
  ]);
  const comment = pickRaw(raw, [
    'comment',
    'remarks',
    'notes',
    'address',
    'citystate',
    'city_state',
    'country',
    'studentdob',
    'student_dob',
    'previousschool',
    'previous_school',
    'gender',
    'fatheroccupation',
    'father_occupation',
    'mothermobileno',
    'mother_mobile_no',
  ]);

  return {
    grade_raw: gradeRaw,
    parent_first_name: parentFirstName,
    parent_last_name: parentLastName,
    parent_name: parentName,
    phone_raw: phoneRaw,
    email_raw: emailRaw,
    relationship_with_student: relationship || null,
    source: source || null,
    counsellor_name: counsellorName || null,
    comment: comment || null,
  };
}

/**
 * PDF: first word → first name, remainder → last name.
 * @param {string} fullName
 * @returns {{ parent_first_name: string, parent_last_name: string }}
 */
function splitParentName(fullName) {
  const name = trimStr(fullName);
  if (!name) {
    return { parent_first_name: '', parent_last_name: '' };
  }
  const parts = name.split(/\s+/);
  if (parts.length === 1) {
    return { parent_first_name: parts[0], parent_last_name: '' };
  }
  return {
    parent_first_name: parts[0],
    parent_last_name: parts.slice(1).join(' '),
  };
}

/**
 * Apply normalization rules from the spec (trim phone, lowercase email).
 * @param {ReturnType<typeof mapRawToFields>} mapped
 */
function normalizeMapped(mapped) {
  return {
    ...mapped,
    phone_number: normalizePhone(mapped.phone_raw),
    email: normalizeEmail(mapped.email_raw),
  };
}

module.exports = {
  trimStr,
  normalizePhone,
  normalizeEmail,
  mapRawToFields,
  splitParentName,
  normalizeMapped,
};
