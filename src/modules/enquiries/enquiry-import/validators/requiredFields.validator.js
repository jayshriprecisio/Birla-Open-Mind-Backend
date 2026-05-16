/**
 * @param {{ parent_name: string, phone_number: string, grade_raw: string }} n
 * @returns {string[]}
 */
function validateRequired(n) {
  const errors = [];
  if (!n.parent_first_name?.trim()) {
    errors.push('Parent first name is required');
  }
  if(!n.parent_last_name?.trim()) {
    errors.push('Parent last name is required');
  }
  if (!n.phone_number?.trim()) {
    errors.push('Phone number is required');
  }
  if (!n.grade_raw?.trim()) {
    errors.push('Grade is required');
  }
  return errors;
}

module.exports = {
  validateRequired,
};
