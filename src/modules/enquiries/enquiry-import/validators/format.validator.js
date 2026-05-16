const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {{ email: string, phone_number: string }} n
 * @returns {string[]}
 */
function validateFormats(n) {
  const errors = [];
  if (n.email && !EMAIL_RE.test(n.email)) {
    errors.push('Invalid email format');
  }
  if (n.phone_number) {
    if (!/^\d{10}$/.test(n.phone_number)) {
      errors.push('Invalid phone format (use 10-digit mobile)');
    }
  }
  return errors;
}

module.exports = {
  validateFormats,
};
