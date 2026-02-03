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
  updatedAt: row.updated_at,
  patientName: row.patient_name,
  doctorName: row.doctor_name
});

const baseSelect = `
  SELECT mr.record_id,
         mr.appointment_id,
         mr.patient_id,
         mr.doctor_id,
         mr.date_time,
         mr.diagnosis,
         mr.symptoms,
         mr.prescriptions,
         mr.remarks,
         mr.created_at,
         mr.updated_at,
         p.name_surname AS patient_name,
         s.name_surname AS doctor_name
  FROM medical_records mr
  LEFT JOIN patients p ON p.patient_id = mr.patient_id
  LEFT JOIN staffs s ON s.staff_id = mr.doctor_id
`;

async function getMedicalRecords() {
  const { rows } = await pool.query(`${baseSelect} ORDER BY mr.created_at DESC`);
  return rows.map(mapMedicalRecord);
}

async function getMedicalRecordById(recordId) {
  const { rows } = await pool.query(`${baseSelect} WHERE mr.record_id = $1`, [
    recordId
  ]);
  return rows[0] ? mapMedicalRecord(rows[0]) : null;
}

async function getMedicalRecordsByPatientId(patientId) {
  const { rows } = await pool.query(
    `${baseSelect} WHERE a.patient_id = $1 ORDER BY mr.created_at DESC`,
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
  remarks
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
       remarks
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING record_id`,
    [appointmentId, doctorId, patientId, dateTime, diagnosis, symptoms, prescriptions, remarks]
  );

  return getMedicalRecordById(rows[0].record_id);
}


async function updateMedicalRecord(recordId, {
  diagnosis,
  symptoms,
  prescriptions,
  remarks,
  dateTime
}) {
  const { rows } = await pool.query(
    `UPDATE medical_records
     SET diagnosis = $1,
         symptoms = $2,
         prescriptions = $3,
         remarks = $4,
         date_time = $5,
         updated_at = NOW()
     WHERE record_id = $6
     RETURNING record_id`,
    [diagnosis, symptoms, prescriptions, remarks, dateTime, recordId]
  );

  return rows[0] ? getMedicalRecordById(rows[0].record_id) : null;
}


async function getStaffsByRecordId(recordId) {
  const { rows } = await pool.query(
    `SELECT s.staff_id,
            s.name_surname
     FROM medical_record_staffs mrn
     JOIN staffs s ON s.staff_id = mrn.staff_id
     WHERE mrn.record_id = $1`,
    [recordId]
  );

  return rows.map((row) => ({
    staffId: row.staff_id,
    nameSurname: row.name_surname
  }));
}

async function assignStaffsToRecord(recordId, staffIds) {
  await pool.query('DELETE FROM medical_record_staffs WHERE record_id = $1', [
    recordId
  ]);

  if (Array.isArray(staffIds) && staffIds.length > 0) {
    const values = staffIds
      .map((_, index) => `($1, $${index + 2})`)
      .join(', ');

    await pool.query(
      `INSERT INTO medical_record_staffs (record_id, staff_id)
       VALUES ${values}`,
      [recordId, ...staffIds]
    );
  }

  return getStaffsByRecordId(recordId);
}

module.exports = {
  getMedicalRecords,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
};

