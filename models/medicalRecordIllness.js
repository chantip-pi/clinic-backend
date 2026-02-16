const { pool } = require("../config/database");

const mapMedicalRecordIllness = (row) => ({
  recordId: row.record_id,
  illnessId: row.illness_id,
});

const getMedicalRecordIllnesses = async () => {
  const { rows } = await pool.query(
    `SELECT record_id, illness_id 
        FROM medical_record_illness 
        ORDER BY record_id ASC`,
  );
  return rows.map(mapMedicalRecordIllness);
};

const getIllnessesByRecordId = async (recordId) => {
  const { rows } = await pool.query(
    `SELECT record_id, illness_id
     FROM medical_record_illness
     WHERE record_id = $1`,
    [recordId],
  );
  return rows.map(mapMedicalRecordIllness);
};

const createMedicalRecordIllness = async ({ recordId, illnessId }) => {
  const { rows } = await pool.query(
    `INSERT INTO medical_record_illness (
            record_id,
            illness_id
        )   VALUES ($1, $2) 
        RETURNING record_id,
                illness_id`,
    [recordId, illnessId],
  );
  return mapMedicalRecordIllness(rows[0]);
};

const deleteMedicalRecordIllness = async (recordId, illnessId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM medical_record_illness
     WHERE record_id = $1 AND illness_id = $2`,
    [recordId, illnessId],
  );
  return rowCount > 0;
};

const deleteAllIllnessesForRecord = async (recordId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM medical_record_illness
     WHERE record_id = $1`,
    [recordId],
  );
  return rowCount;
};

module.exports = {
  getMedicalRecordIllnesses,
  getIllnessesByRecordId,
  createMedicalRecordIllness,
  deleteMedicalRecordIllness,
  deleteAllIllnessesForRecord,
};
