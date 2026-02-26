const { pool } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const mapStaff = (row) => ({
  staffId: row.staff_id,
  username: row.username,
  nameSurname: row.name_surname,
  phoneNumber: row.phone_number,
  birthday: row.birthday,
  gender: row.gender,
  email: row.email,
  title: row.title,
  token: row.token
});

const mapName = (row) => ({
  staffId: row.staff_id,
  nameSurname: row.name_surname
});

const isBcryptHash = (s) => typeof s === 'string' && /^\$2[aby]\$/.test(s);

const getStaff = async () => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, title, token
     FROM staffs
     ORDER BY staff_id DESC`
  );
  return rows.map(mapStaff);
};

const getStaffById = async (staffId) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, title, token
     FROM staffs
     WHERE staff_id = $1`,
    [staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const getStaffByUsername = async (username) => {
  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, birthday, gender, email, title, token
     FROM staffs
     WHERE username = $1`,
    [username]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const getDoctorName = async () => {
  const { rows } = await pool.query(
    `SELECT staff_id, name_surname
     FROM staffs
     WHERE title = 'Doctor'`);
  return rows.map(mapName);
};

const getStaffName = async () => {
  const { rows } = await pool.query(
    `SELECT staff_id, name_surname
      FROM staffs
      WHERE title = 'Staff'`);
  return rows.map(mapName);
}

const createStaff = async ({
  username,
  password,
  nameSurname,
  phoneNumber,
  birthday,
  gender,
  email,
  title
}) => {
  // If the client already sent a bcrypt hash we store it as-is.
  // If client sends plaintext, hash it here before storing.
  const passwordToStore = isBcryptHash(password) ? password : await bcrypt.hash(password, 10);

  // Create user token
  const token = jwt.sign({ id: username }, process.env.JWT_SECRET, { expiresIn: '2h' });


  const { rows } = await pool.query(
    `INSERT INTO staffs (username, password, name_surname, phone_number, birthday, gender, email, title, token)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, title, token`,
    [username, passwordToStore, nameSurname, phoneNumber, birthday, gender, email, title, token]
  );
  return mapStaff(rows[0]);
};

const updateStaff = async (
  staffId,
  { username, password, nameSurname, phoneNumber, birthday, gender, email, title }
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
         title = $8,
         updated_at = NOW()
     WHERE staff_id = $9
     RETURNING staff_id, username, password, name_surname, phone_number, birthday, gender, email, title`,
    [username, passwordToStore, nameSurname, phoneNumber, birthday, gender, email, title, staffId]
  );
  return rows[0] ? mapStaff(rows[0]) : null;
};

const deleteStaff = async (staffId) => {
  const { rowCount } = await pool.query('DELETE FROM staffs WHERE staff_id = $1', [staffId]);
  return rowCount > 0;
};

const loginStaff = async ({ username, password }) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const { rows } = await pool.query(
    `SELECT staff_id, username, password, name_surname, phone_number, 
            birthday, gender, email, title 
     FROM staffs 
     WHERE username = $1`,
    [username]
  );

  const userRow = rows[0];
  if (!userRow) return null;

  const isMatch = await bcrypt.compare(password, userRow.password);
  if (!isMatch) return null;

  const token = jwt.sign(
    { id: userRow.staff_id, username: userRow.username },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  await pool.query(
    'UPDATE staffs SET token = $1 WHERE staff_id = $2',
    [token, userRow.staff_id]
  );

  return mapStaff({ ...userRow, token });
};

module.exports = {
  getStaff,
  getStaffById,
  getStaffByUsername,
  getDoctorName,
  getStaffName,
  loginStaff,
  createStaff,
  updateStaff,
  deleteStaff
};