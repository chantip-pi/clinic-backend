const { pool } = require('../config/database');

const mapAppointment = (row) => ({
  appointmentId: row.appointment_id,
  patientId: row.patient_id,
  appointmentDateTime: row.appointment_date_time,
  status: row.status,
  reason: row.reason,
  createdAt: row.created_at,
  patientName: row.patient_name
});

const getAppointments = async () => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     ORDER BY a.appointment_date_time DESC`
  );
  return rows.map(mapAppointment);
};

const getAppointmentById = async (appointmentId) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     WHERE a.appointment_id = $1`,
    [appointmentId]
  );
  return rows[0] ? mapAppointment(rows[0]) : null;
};

const getAppointmentsByPatientId = async (patientId) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     WHERE a.patient_id = $1
     ORDER BY a.appointment_date_time DESC`,
    [patientId]
  );
  return rows.map(mapAppointment);
};

const getAppointmentsByDate = async (appointmentDate) => {
  const { rows } = await pool.query(
    `SELECT a.appointment_id,
            a.patient_id,
            a.appointment_date_time,
            a.status,
            a.reason,
            a.created_at,
            p.name_surname AS patient_name
     FROM appointments a
     LEFT JOIN patients p ON p.patient_id = a.patient_id
     WHERE DATE(a.appointment_date_time) = $1
     ORDER BY a.appointment_date_time DESC`,
    [appointmentDate]
  );
  return rows.map(mapAppointment);
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
  appointmentDateTime,
  status,
  reason
}) => {
  const { rows } = await pool.query(
    `INSERT INTO appointments (
       patient_id,
       appointment_date_time,
       status,
       reason
     )
     VALUES ($1, $2, $3, $4)
     RETURNING appointment_id,
               patient_id,
               appointment_date_time,
               status,
               reason,
               created_at,
               (SELECT name_surname FROM patients p WHERE p.patient_id = $1) AS patient_name`,
    [patientId, appointmentDateTime, status, reason]
  );
  return mapAppointment(rows[0]);
};

const updateAppointment = async (
  appointmentId,
  {
    patientId,
    appointmentDateTime,
    status,
    reason
  }
) => {
  const { rows } = await pool.query(
    `UPDATE appointments
     SET patient_id = $1,
         appointment_date_time = $2,
         status = $3,
         reason = $4
     WHERE appointment_id = $5
     RETURNING appointment_id,
               patient_id,
               appointment_date_time,
               status,
               reason,
               created_at,
               (SELECT name_surname FROM patients p WHERE p.patient_id = $1) AS patient_name`,
    [patientId, appointmentDateTime, status, reason, appointmentId]
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

module.exports = {
  getAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getUpcomingAppointmentDate,
  createAppointment,
  updateAppointment,
  deleteAppointment
};


