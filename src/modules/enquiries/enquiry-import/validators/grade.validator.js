/**
 * Resolve Excel grade text to grade_master.id using in-memory master rows.
 * Matches full `name` or `short_form` (case-insensitive, trimmed); then loose contains match.
 *
 * @param {string} gradeText
 * @param {{ id: number, name?: string, short_form?: string }[]} gradeRows
 * @returns {{ grade_id: number|null, error?: string }}
 */
function resolveGradeId(gradeText, gradeRows) {
  const q = String(gradeText ?? '').trim().toLowerCase();
  if (!q) {
    return { grade_id: null };
  }

  const norm = (s) => String(s ?? '').trim().toLowerCase();

  for (const g of gradeRows) {
    if (norm(g.name) === q || norm(g.short_form) === q) {
      return { grade_id: g.id };
    }
  }

  const qCompact = q.replace(/\s+/g, '');
  for (const g of gradeRows) {
    const n = norm(g.name).replace(/\s+/g, '');
    const s = norm(g.short_form).replace(/\s+/g, '');
    if (n === qCompact || s === qCompact) {
      return { grade_id: g.id };
    }
  }

  for (const g of gradeRows) {
    const n = norm(g.name);
    const s = norm(g.short_form);
    if ((n && (n.includes(q) || q.includes(n))) || (s && (s.includes(q) || q.includes(s)))) {
      return { grade_id: g.id };
    }
  }

  return { grade_id: null, error: 'Invalid grade' };
}

module.exports = {
  resolveGradeId,
};
