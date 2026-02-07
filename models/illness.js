const { pool } = require("../config/database");

const mapIllnesses = (row) => ({
  illnessId: row.illness_id,
  illnessName: row.illness_name,
  description: row.description,
  category: row.category,
});

const getIllnesses = async () => {
  const { rows } = await pool.query(
    `SELECT illness_id, illness_name, description, category FROM illness ORDER BY illness_id DESC`
  );
  return rows.map(mapIllnesses);
};

const getIllnessById = async (illnessId) => {
  const { rows } = await pool.query(
    `SELECT illness_id, illness_name, description, category
        FROM illness
        WHERE illness_id = $1`,
    [illnessId]
  );
  return rows[0] ? mapIllnesses(rows[0]) : null;
};

const createIllness = async ({ illnessName, description, category }) => {
  const { rows } = await pool.query(
    `INSERT INTO illness (
            illness_name,
            description,
            category
        )   VALUES ($1, $2, $3) 
        RETURNING illness_id,
                illness_name,
                description,
                category`,
    [illnessName, description, category]
  );
  return mapIllnesses(rows[0]);
};

const updateIllness = async (
  illnessId,
  { illnessName, description, category }
) => {
  const { rows } = await pool.query(
    `UPDATE illness
        SET illness_name = $1,
            description = $2,
            category = $3
        WHERE illness_id = $4
        RETURNING illness_id,
                illness_name,
                description,
                category`,
    [illnessName, description, category, illnessId]
  );
  return rows[0] ? mapIllnesses(rows[0]) : null;
};

const deleteIllness = async (illnessId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM illness WHERE illness_id = $1",
    [illnessId]
  );
  return rowCount > 0;
};

module.exports = {
  getIllnesses,
  getIllnessById,
  createIllness,
  updateIllness,
  deleteIllness,
};
