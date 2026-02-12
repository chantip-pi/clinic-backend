const { pool } = require("../config/database");

const mapIllnessAcupuncture = (row) => ({
  illnessId: row.illness_id,
  acupunctureId: row.acupuncture_id,
});

const getIllnessAcupunctures = async () => {
  const { rows } = await pool.query(
    `SELECT illness_id, acupuncture_id 
        FROM illness_acupuncture 
        ORDER BY illness_id ASC`,
  );
  return rows.map(mapIllnessAcupuncture);
};

const getAcupuncturesByIllnessId = async (illnessId) => {
  const { rows } = await pool.query(
    `SELECT illness_id, acupuncture_id
        FROM illness_acupuncture
        WHERE illness_id = $1`,
    [illnessId],
  );
  return rows.map(mapIllnessAcupuncture);
};

const createIllnessAcupuncture = async ({ illnessId, acupunctureId }) => {
  const { rows } = await pool.query(
    `INSERT INTO illness_acupuncture (  
            illness_id,
            acupuncture_id
        )   VALUES ($1, $2)
        RETURNING illness_id,
                acupuncture_id`,
    [illnessId, acupunctureId],
  );
  return mapIllnessAcupuncture(rows[0]);
};

const deleteIllnessAcupuncture = async (illnessId, acupunctureId) => {
  await pool.query(
    `DELETE FROM illness_acupuncture
        WHERE illness_id = $1 AND acupuncture_id = $2`,
    [illnessId, acupunctureId],
  );
};

const deleteAllAcupuncturesByIllnessId = async (illnessId) => {
  await pool.query(
    `DELETE FROM illness_acupuncture
        WHERE illness_id = $1`,
    [illnessId],
  );
};

module.exports = {
  getIllnessAcupunctures,
  getAcupuncturesByIllnessId,
  createIllnessAcupuncture,
  deleteIllnessAcupuncture,
  deleteAllAcupuncturesByIllnessId,
};
