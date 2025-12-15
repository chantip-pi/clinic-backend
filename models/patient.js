const { pool } = require('../config/database');

const mapPatient = (row) => ({
  patientId: row.patient_id,
  nameSurname: row.name_surname,
  phoneNumber: row.phone_number,
  birthday: row.birthday,
  gender: row.gender,
  remainingCourse: row.remaining_course,
});

const getPatients = async () => {
  const { rows } = await pool.query(
    `SELECT patient_id,
            name_surname,
            phone_number,
            birthday,
            gender,
            remaining_course
     FROM patients
     ORDER BY patient_id DESC`
  );
  return rows.map(mapPatient);
};

const getPatientsByAppointmentDate = async () => {
  const { rows } = await pool.query(
    `SELECT patient_id,
            name_surname,
            phone_number,
            birthday,
            gender,
            remaining_course
     FROM patients
     ORDER BY patient_id DESC`
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
            remaining_course
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
  remainingCourse,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO patients (
       name_surname,
       phone_number,
       birthday,
       gender,
       remaining_course
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING patient_id,
               name_surname,
               phone_number,
               birthday,
               gender,
               remaining_course`,
    [nameSurname, phoneNumber, birthday, gender, remainingCourse]
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
    remainingCourse,
  }
) => {
  const { rows } = await pool.query(
    `UPDATE patients
     SET name_surname = $1,
         phone_number = $2,
         birthday = $3,
         gender = $4,
         remaining_course = $5
     WHERE patient_id = $6
     RETURNING patient_id,
               name_surname,
               phone_number,
               birthday,
               gender,
               remaining_course`,
    [
      nameSurname,
      phoneNumber,
      birthday,
      gender,
      remainingCourse,
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
