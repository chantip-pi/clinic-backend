const { pool } = require("../config/database");

const mapMedicalRecordAcupuncture = (row) => ({
  recordId: row.record_id,
  acupunctureId: row.acupuncture_id,
});

const getMedicalRecordAcupunctures = async () => {
  const { rows } = await pool.query(
    `SELECT record_id, acupuncture_id 
        FROM medical_record_acupuncture 
        ORDER BY record_id DESC`,
  );
  return rows.map(mapMedicalRecordAcupuncture);
};

const getAcupuncturesByRecordId = async (recordId) => {
  const { rows } = await pool.query(
    `SELECT record_id, acupuncture_id
     FROM medical_record_acupuncture
     WHERE record_id = $1`,
    [recordId]
  );
  return rows.map(mapMedicalRecordAcupuncture);
};

const createMedicalRecordAcupuncture = async ({ recordId, acupunctureId }) => {
  const { rows } = await pool.query(
    `INSERT INTO medical_record_acupuncture (
            record_id,
            acupuncture_id
        )   VALUES ($1, $2) 
        RETURNING record_id,
                acupuncture_id`,
    [recordId, acupunctureId],
  );
  return mapMedicalRecordAcupuncture(rows[0]);
};

const updateMedicalRecordAcupuncture = async ({
  recordId,
  oldAcupunctureId,
  newAcupunctureId,
}) => {
  await pool.query(
    `DELETE FROM medical_record_acupuncture
     WHERE record_id = $1 AND acupuncture_id = $2`,
    [recordId, oldAcupunctureId]
  );

  const { rows } = await pool.query(
    `INSERT INTO medical_record_acupuncture (
      record_id,
      acupuncture_id
    )
    VALUES ($1, $2)
    RETURNING record_id, acupuncture_id`,
    [recordId, newAcupunctureId]
  );

  return mapMedicalRecordAcupuncture(rows[0]);
};

const deleteMedicalRecordAcupuncture = async (recordId, acupunctureId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM medical_record_acupuncture
     WHERE record_id = $1 AND acupuncture_id = $2`,
    [recordId, acupunctureId]
  );
  return rowCount > 0;
};

const deleteAllAcupuncturesForRecord = async (recordId) => {
  const { rowCount } = await pool.query(
    `DELETE FROM medical_record_acupuncture
     WHERE record_id = $1`,
    [recordId]
  );
  return rowCount;
};

module.exports = {
  getMedicalRecordAcupunctures,
  getAcupuncturesByRecordId,
  createMedicalRecordAcupuncture,
  updateMedicalRecordAcupuncture,
  deleteMedicalRecordAcupuncture,
  deleteAllAcupuncturesForRecord,
};
