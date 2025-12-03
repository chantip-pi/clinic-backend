const { pool } = require('../config/database');

const mapStaff = (row) => ({
  staffId: row.staff_id,
  username: row.username,
  password: row.password,
  nameSurname: row.name_surname,
  phoneNumber: row.phone_number,
  birthday: row.birthday,
  gender: row.gender,
  email: row.email,
  role: row.role
});

const getStaff = async () => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staff
     ORDER BY staff_id DESC`
  );
  return rows.map(mapStaff);
};

const getStaffById = async (staffId) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staff
     WHERE staff_id = $1`,
    [staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const getStaffByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staff
     WHERE username = $1`,
    [username]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};


const createStaff = async ({
  username,
  password,
  nameSurname,
  phoneNumber,
  birthday,
  gender,
  email,
  role
}) => {
  const { rows } = await pool.query(
    `INSERT INTO staff (username, password, name_surname, phone_number, birthday, gender, email, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, role`,
    [username, password, nameSurname, phoneNumber, birthday, gender, email, role]
  );
  return mapStaff(rows[0]);
};

const updateStaff = async (
  staffId,
  { username, password, nameSurname, phoneNumber, birthday, gender, email, role }
) => {
  const { rows } = await pool.query(
    `UPDATE staff
     SET username = $1,
         password = $2,
         name_surname = $3,
         phone_number = $4,
         birthday = $5,
         gender = $6,
         email = $7,
         role = $8,
         updated_at = NOW()
     WHERE staff_id = $9
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, role`,
    [username, password, nameSurname, phoneNumber, birthday, gender, email, role, staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const deleteStaff = async (staffId) => {
  const { rowCount } = await pool.query('DELETE FROM staff WHERE staff_id = $1', [staffId]);
  return rowCount > 0;
};

module.exports = {
  getStaff,
  getStaffById,
  getStaffByUsername,

  createStaff,
  updateStaff,
  deleteStaff
};