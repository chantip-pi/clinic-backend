const { pool } = require('../config/database');

const mapAppointment = (row) => ({
  appointmentId: row.appointment_id,
  patientId: row.patient_id,
  doctorId: row.doctor_id,
  appointmentDateTime: row.appointment_date_time,
  status: row.status,
  reason: row.reason,
  createdAt: row.created_at,
  patientName: row.patient_name,
  doctorName: row.doctor_name
});

const mapAppointmentOutput = (row) => ({
  appointmentId: row.appointment_id,
  patientId: row.patient_id,
  patientName: row.patient_name,
  doctorId: row.doctor_id,
  doctorName: row.doctor_name,
  appointmentDateTime: row.appointment_date_time,
  status: row.status,
  reason: row.reason,
  createdAt: row.created_at,
  patientName: row.patient_name,
  doctorName: row.doctor_name
});


const getAppointments = async () => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name,
            s.name_surname AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     LEFT JOIN staffs s ON s.staff_id = a.doctor_id
     ORDER BY a.appointment_date_time DESC`
  );
  return rows.map(mapAppointmentOutput);
};

const getAppointmentById = async (appointmentId) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name,
            s.name_surname AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     LEFT JOIN staffs s ON s.staff_id = a.doctor_id
     WHERE a.appointment_id = $1`,
    [appointmentId]
  );
  return rows[0] ? mapAppointmentOutput(rows[0]) : null;
};

const getAppointmentsByPatientId = async (patientId) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name,
            s.name_surname AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     LEFT JOIN staffs s ON s.staff_id = a.doctor_id
     WHERE a.patient_id = $1
     ORDER BY a.appointment_date_time DESC`,
    [patientId]
  );
  return rows.map(mapAppointmentOutput);
};

const getAppointmentsByDate = async (appointmentDate) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id, 
            a.doctor_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name,
            s.name_surname AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     LEFT JOIN staffs s ON s.staff_id = a.doctor_id
     WHERE DATE(a.appointment_date_time) = $1
     ORDER BY a.appointment_date_time DESC`,
    [appointmentDate]
  );
  return rows.map(mapAppointmentOutput);
};

const getAppointmentsByDoctorId = async (doctorId) => {

  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.doctor_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name,
            s.name_surname AS doctor_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     LEFT JOIN staffs s ON s.staff_id = a.doctor_id
     WHERE a.doctor_id = $1
     AND a.status = 'scheduled'
     ORDER BY a.appointment_date_time DESC`,
    [doctorId]
  );
  return rows.map(mapAppointmentOutput);
};

const getUpcomingAppointmentDate = async (patientId) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_date_time
     FROM appointments a
     WHERE a.patient_id = $1
       AND a.appointment_date_time > NOW()
     ORDER BY a.appointment_date_time ASC
     LIMIT 1`,
    [patientId]
  );
  return rows[0] ? rows[0].appointment_date_time : null;
};

const createAppointment = async ({
  patientId,
  doctorId,
  appointmentDateTime,
  status,
  reason
}) => {
  const { rows } = await pool.query(
    `INSERT INTO appointments (
       patient_id,
       doctor_id,
       appointment_date_time,
       status,
       reason
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING appointment_id,
               patient_id,
               doctor_id,
               appointment_date_time,
               status,
               reason,
               created_at,
               (SELECT name_surname FROM patients p WHERE p.patient_id = $1) AS patient_name,
               (SELECT name_surname FROM staffs s WHERE s.staff_id = $2) AS doctor_name`,
    [patientId, doctorId, appointmentDateTime, status, reason]
  );
  return mapAppointment(rows[0]);
};

const updateAppointment = async (
  appointmentId,
  {
    patientId,
    doctorId,
    appointmentDateTime,
    status,
    reason
  }
) => {
  const { rows } = await pool.query(
    `UPDATE appointments
     SET patient_id = $1,
         doctor_id = $2,
         appointment_date_time = $3,
         status = $4,
         reason = $5,
         updated_at = NOW()
     WHERE appointment_id = $6
     RETURNING appointment_id,
               patient_id,
               doctor_id,
               appointment_date_time,
               status,
               reason,
               created_at,
               (SELECT name_surname FROM patients p WHERE p.patient_id = $1) AS patient_name,
               (SELECT name_surname FROM staffs s WHERE s.staff_id = $2) AS doctor_name`,
    [patientId, doctorId, appointmentDateTime, status, reason, appointmentId]
  );
  return rows[0] ? mapAppointment(rows[0]) : null;
};

const deleteAppointment = async (appointmentId) => {
  const { rowCount } = await pool.query(
    'DELETE FROM appointments WHERE appointment_id = $1',
    [appointmentId]
  );
  return rowCount > 0;
};

const findConflictingAppointment = async ({
  doctorId,
  appointmentDateTime,
  excludeAppointmentId
}) => {
  // "Conflict" = same doctor has another scheduled appointment at the same time
  const values = [doctorId, appointmentDateTime];
  let excludeClause = '';

  if (excludeAppointmentId) {
    values.push(excludeAppointmentId);
    excludeClause = 'AND appointment_id <> $3';
  }

  const { rows } = await pool.query(
    `SELECT appointment_id
     FROM appointments
     WHERE doctor_id = $1
       AND appointment_date_time = $2
       AND status = 'scheduled'
       ${excludeClause}
     LIMIT 1`,
    values
  );

  return rows[0] || null;
};

module.exports = {
  getAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getUpcomingAppointmentDate,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  findConflictingAppointment
};


