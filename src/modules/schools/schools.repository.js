const { pool } = require('../../config/db');

const createSchool = async (schoolBody) => {
  const { name, code, address } = schoolBody;
  const result = await pool.query(
    'INSERT INTO schools (name, code, address) VALUES ($1, $2, $3) RETURNING *',
    [name, code, address]
  );
  return result.rows[0];
};

const getSchools = async () => {
  const result = await pool.query('SELECT * FROM schools ORDER BY created_at DESC');
  return result.rows;
};

const getSchoolById = async (id) => {
  const result = await pool.query('SELECT * FROM schools WHERE id = $1', [id]);
  return result.rows[0];
};

const updateSchoolById = async (id, updateBody) => {
  const fields = Object.keys(updateBody);
  const values = Object.values(updateBody);
  
  const setString = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
  
  const query = `UPDATE schools SET ${setString} WHERE id = $1 RETURNING *`;
  const result = await pool.query(query, [id, ...values]);
  
  return result.rows[0];
};

const deleteSchoolById = async (id) => {
  const result = await pool.query('DELETE FROM schools WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchoolById,
  deleteSchoolById,
};
