const { pool } = require('../config/database');

const mapPatient = (row) => ({
  patientId: row.patient_id,
  nameSurname: row.name_surname,
  phoneNumber: row.phone_number,
  birthday: row.birthday,
  gender: row.gender,
  appointmentDate: row.appointment_date,
  courseCount: row.course_count,
  firstVistDate: row.first_visit_date
});

const getPatients = async () => {
  const { rows } = await pool.query(
    `SELECT patient_id,
            name_surname,
            phone_number,
            birthday,
            gender,
            appointment_date,
            course_count,
            first_visit_date
     FROM patients
     ORDER BY patient_id DESC`
  );
  return rows.map(mapPatient);
};

const getPatientsByAppointmentDate = async (appointmentDate) => {
  const { rows } = await pool.query(
    `SELECT patient_id,
            name_surname,
            phone_number,
            birthday,
            gender,
            appointment_date,
            course_count,
            first_visit_date
     FROM patients
     WHERE appointment_date = $1
     ORDER BY patient_id DESC`,
    [appointmentDate]
  );
  return rows.map(mapPatient);
};

const getPatientById = async (patientId) => {
  const { rows } = await pool.query(
    `SELECT patient_id,
            name_surname,
            phone_number,
            birthday,
            gender,
            appointment_date,
            course_count,
            first_visit_date
     FROM patients
     WHERE patient_id = $1`,
    [patientId]
  );
  return rows[0] ? mapPatient(rows[0]) : null;
};

const createPatient = async ({
  nameSurname,
  phoneNumber,
  birthday,
  gender,
  appointmentDate,
  courseCount,
  firstVistDate
}) => {
  const { rows } = await pool.query(
    `INSERT INTO patients (
       name_surname,
       phone_number,
       birthday,
       gender,
       appointment_date,
       course_count,
       first_visit_date
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING patient_id,
               name_surname,
               phone_number,
               birthday,
               gender,
               appointment_date,
               course_count,
               first_visit_date`,
    [nameSurname, phoneNumber, birthday, gender, appointmentDate, courseCount, firstVistDate]
  );
  return mapPatient(rows[0]);
};

const updatePatient = async (
  patientId,
  {
    nameSurname,
    phoneNumber,
    birthday,
    gender,
    appointmentDate,
    courseCount,
    firstVistDate
  }
) => {
  const { rows } = await pool.query(
    `UPDATE patients
     SET name_surname = $1,
         phone_number = $2,
         birthday = $3,
         gender = $4,
         appointment_date = $5,
         course_count = $6,
         first_visit_date = $7
     WHERE patient_id = $8
     RETURNING patient_id,
               name_surname,
               phone_number,
               birthday,
               gender,
               appointment_date,
               course_count,
               first_visit_date`,
    [
      nameSurname,
      phoneNumber,
      birthday,
      gender,
      appointmentDate,
      courseCount,
      firstVistDate,
      patientId
    ]
  );
  return rows[0] ? mapPatient(rows[0]) : null;
};

const deletePatient = async (patientId) => {
  const { rowCount } = await pool.query(
    'DELETE FROM patients WHERE patient_id = $1',
    [patientId]
  );
  return rowCount > 0;
};

module.exports = {
  getPatients,
  getPatientsByAppointmentDate,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
