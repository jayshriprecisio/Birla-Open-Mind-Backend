/**
 * Detects the enquiry source name based on UTM parameters or provided source.
 * @param {Object} args - Arguments containing utm_source, utm_medium, etc.
 * @param {string} [defaultSource='Website'] - Default source name if no UTM is found.
 * @returns {string} The detected source name matching the SourceMaster records.
 */
const detectSource = (args, defaultSource = 'Website') => {
  if (args.utm_source) {
    const utm = args.utm_source.toLowerCase();
    if (utm.includes('instagram')) return 'Instagram';
    if (utm.includes('facebook') || utm.includes('fb')) return 'Facebook';
    if (utm.includes('whatsapp') || utm.includes('wa')) return 'WhatsApp';
    if (utm.includes('google') || utm.includes('ads')) return 'Google Ads';
  }

  // If a source is explicitly provided in the payload, use it
  if (args.source) {
    return args.source;
  }

  return defaultSource;
};

module.exports = {
  detectSource
};
