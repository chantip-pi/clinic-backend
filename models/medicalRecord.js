const { pool } = require('../config/database');

const mapMedicalRecord = (row) => ({
  recordId: row.record_id,
  appointmentId: row.appointment_id,
  patientId: row.patient_id,
  doctorId: row.doctor_id,
  dateTime: row.date_time,
  diagnosis: row.diagnosis,
  symptoms: row.symptoms,
  prescriptions: row.prescriptions,
  remarks: row.remarks,
  createdAt: row.created_at,
  lastAmendedAt: row.last_amended_at,
  lastAmendedBy: row.last_amended_by,
  currentVersion: row.current_version,
  isLocked: row.is_locked,
  patientName: row.patient_name,
  doctorName: row.doctor_name,
  assignees: row.assignees || [],
  assigneesNames: row.assignees_names || []
});


async function getMedicalRecords() {
const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_medical_records
    ORDER BY created_at DESC
    `
  );

  return rows.map(mapMedicalRecord);
}

async function getMedicalRecordById(recordId) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_medical_records
    WHERE record_id = $1
    `,
    [recordId]
  );
  if (!rows[0]) return null;
  return mapMedicalRecord(rows[0]);
}

async function getMedicalRecordsByPatientId(patientId) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM vw_medical_records
    WHERE patient_id = $1
    ORDER BY created_at DESC
    `,
    [patientId]
  );

  return rows.map(mapMedicalRecord);
}


async function createMedicalRecord({
  appointmentId = null,
  doctorId,
  patientId,
  dateTime,
  diagnosis,
  symptoms,
  prescriptions,
  remarks,
  assignees = []
}) {
  const { rows } = await pool.query(
    `INSERT INTO medical_records (
       appointment_id,
       doctor_id,
       patient_id,
       date_time,
       diagnosis,
       symptoms,
       prescriptions,
       remarks,
       assignees
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING record_id`,
    [appointmentId, doctorId, patientId, dateTime, diagnosis, symptoms, prescriptions, remarks, assignees]
  );

  return getMedicalRecordById(rows[0].record_id);
}


async function updateMedicalRecord(recordId, {
  diagnosis,
  symptoms,
  prescriptions,
  remarks,
  dateTime,
  assignees,
  lastAmendedBy
}) {
  const { rows } = await pool.query(
    `UPDATE medical_records
     SET diagnosis = $1,
         symptoms = $2,
         prescriptions = $3,
         remarks = $4,
         date_time = $5,
         last_amended_at = NOW(),
         last_amended_by = $7,
         assignees = $8,
         current_version = COALESCE(current_version, 1) + 1
     WHERE record_id = $6
     RETURNING record_id`,
    [diagnosis, symptoms, prescriptions, remarks, dateTime, recordId, lastAmendedBy || null, assignees || []]
  );
  return rows[0] ? getMedicalRecordById(rows[0].record_id) : null;
}



module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
};