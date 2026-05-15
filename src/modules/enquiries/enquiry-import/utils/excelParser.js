const XLSX = require('xlsx');
const fs = require('fs');

/**
 * Normalize a sheet header cell to a snake_case key (for column matching).
 * @param {string} raw
 */
function normalizeHeaderKey(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

function rowHasAnyValue(cells) {
  return cells.some((c) => String(c ?? '').trim() !== '');
}

/**
 * Read first worksheet from .csv / .xls / .xlsx path.
 * Returns one object per data row with canonical keys + row_number (Excel row index, 1-based).
 *
 * @param {string} filePath
 * @returns {{ row_number: number, raw: Record<string, string> }[]}
 */
function parseEnquiryImportFile(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('Import file not found');
  }

  const workbook = XLSX.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return [];
  }

  const sheet = workbook.Sheets[sheetName];
  const rowsAoa = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false,
  });

  if (!rowsAoa.length) {
    return [];
  }

  const headerCells = rowsAoa[0].map((h) => normalizeHeaderKey(h));
  const out = [];

  for (let i = 1; i < rowsAoa.length; i += 1) {
    const cells = rowsAoa[i];
    if (!rowHasAnyValue(cells)) {
      continue;
    }

    const raw = {};
    for (let j = 0; j < headerCells.length; j += 1) {
      const key = headerCells[j] || `column_${j}`;
      raw[key] = cells[j] != null ? String(cells[j]).trim() : '';
    }

    out.push({
      row_number: i + 1,
      raw,
    });
  }

  return out;
}

module.exports = {
  parseEnquiryImportFile,
  normalizeHeaderKey,
};
