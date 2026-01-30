const { pool } = require("../config/database");

const mapAcupuncture = (row) => ({
  acupunctureId: row.acupuncture_id,
  acupointCode: row.acupoint_code,
  meridianId: row.meridian_id,
});

const getAcupunctures = async () => {
  const { rows } = await pool.query(
    `SELECT acupuncture_id, acupoint_code, meridian_id FROM acupuncture ORDER BY acupuncture_id DESC`
  );
  return rows.map(mapAcupuncture);
};

const getAcupunctureById = async (acupunctureId) => {
  const { rows } = await pool.query(
    `SELECT acupuncture_id, acupoint_code, meridian_id
         FROM acupuncture
            WHERE acupuncture_id = $1`,
    [acupunctureId]
  );
  return rows[0] ? mapAcupuncture(rows[0]) : null;
};

const createAcupuncture = async ({ acupointCode, meridianId }) => {
  const { rows } = await pool.query(
    `INSERT INTO acupuncture (
            acupoint_code,
            meridian_id
        )   VALUES ($1, $2) 
        RETURNING acupuncture_id,
                acupoint_code,
                meridian_id`,
    [acupointCode, meridianId]
  );
  return mapAcupuncture(rows[0]);
};

const updateAcupuncture = async (
  acupunctureId,
  { acupointCode, meridianId }
) => {
  const { rows } = await pool.query(
    `UPDATE acupuncture
        SET acupoint_code = $1,
            meridian_id = $2
        WHERE acupuncture_id = $3
        RETURNING acupuncture_id,
                acupoint_code,
                meridian_id`,
    [acupointCode, meridianId, acupunctureId]
  );
  return rows[0] ? mapAcupuncture(rows[0]) : null;
};

const deleteAcupuncture = async (acupunctureId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM acupuncture WHERE acupuncture_id = $1",
    [acupunctureId]
  );
  return rowCount > 0;
};

module.exports = {
  getAcupunctures,
  getAcupunctureById,
  createAcupuncture,
  updateAcupuncture,
  deleteAcupuncture,
};
