const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

const mapStaff = (row) => ({
  staffId: row.staff_id,
  username: row.username,
  nameSurname: row.name_surname,
  phoneNumber: row.phone_number,
  birthday: row.birthday,
  gender: row.gender,
  email: row.email,
  role: row.role
});

const isBcryptHash = (s) => typeof s === 'string' && /^\$2[aby]\$/.test(s);

const getStaff = async () => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staffs
     ORDER BY staff_id DESC`
  );
  return rows.map(mapStaff);
};

const getStaffById = async (staffId) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staffs
     WHERE staff_id = $1`,
    [staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const getStaffByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staffs
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
  // If the client already sent a bcrypt hash we store it as-is.
  // If client sends plaintext, hash it here before storing.
  const passwordToStore = isBcryptHash(password) ? password : await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `INSERT INTO staffs (username, password, name_surname, phone_number, birthday, gender, email, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, role`,
    [username, passwordToStore, nameSurname, phoneNumber, birthday, gender, email, role]
  );
  return mapStaff(rows[0]);
};

const updateStaff = async (
  staffId,
  { username, password, nameSurname, phoneNumber, birthday, gender, email, role }
) => {
  // If password provided and not already a bcrypt hash, hash it.
  const passwordToStore = password ? (isBcryptHash(password) ? password : await bcrypt.hash(password, 10)) : null;

  const { rows } = await pool.query(
    `UPDATE staffs
     SET username = $1,
         password = COALESCE($2, password),
         name_surname = $3,
         phone_number = $4,
         birthday = $5,
         gender = $6,
         email = $7,
         role = $8,
         updated_at = NOW()
     WHERE staff_id = $9
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, role`,
    [username, passwordToStore, nameSurname, phoneNumber, birthday, gender, email, role, staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const deleteStaff = async (staffId) => {
  const { rowCount } = await pool.query('DELETE FROM staffs WHERE staff_id = $1', [staffId]);
  return rowCount > 0;
};

const loginStaff = async (username, password) => {
  // We first fetch the user by username and then verify the password.
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, role
     FROM staffs
     WHERE username = $1`,
    [username]
  );

  const userRow = rows[0];
  if (!userRow) return null;

  // If the client sent a bcrypt hash (starts with $2...), compare equality only.
  // Note: bcrypt is one-way; hashes with different salts won't match even for same password.
  if (isBcryptHash(password)) {
    return password === userRow.password ? mapStaff(userRow) : null;
  }

  // Otherwise assume plaintext and use bcrypt.compare against stored hash.
  const match = await bcrypt.compare(password, userRow.password);
  return match ? mapStaff(userRow) : null;
};

module.exports = {
  getStaff,
  getStaffById,
  getStaffByUsername,
  loginStaff,
  createStaff,
  updateStaff,
  deleteStaff
};