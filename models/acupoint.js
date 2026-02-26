const { pool } = require("../config/database");

const mapAcupoints = (row) => ({
  acupointCode: row.acupoint_code,
  acupointName: row.acupoint_name,
  isBilateral: row.is_bilateral
});

const getAcupoints = async () => {
  const { rows } = await pool.query(
    `SELECT acupoint_code, acupoint_name, is_bilateral FROM acupoint ORDER BY acupoint_code ASC`
  );
  return rows.map(mapAcupoints);
};

const getAcupointByCode = async (acupointCode) => {
  const { rows } = await pool.query(
    `SELECT acupoint_code,
            acupoint_name,
            is_bilateral
     FROM acupoint
     WHERE acupoint_code = $1`,
    [acupointCode]
  );
  return rows[0] ? mapAcupoints(rows[0]) : null;
};

const createAcupoint = async ({
  acupointCode,
  acupointName,
  isBilateral,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO acupoint (
       acupoint_code,
            acupoint_name,
            is_bilateral
     )
     VALUES ($1, $2, $3)
     RETURNING acupoint_code,
            acupoint_name,
            is_bilateral`,
    [acupointCode, acupointName, isBilateral]
  );
  return mapAcupoints(rows[0]);
};

const updateAcupoint = async (
  acupointCode,
  { acupointName, isBilateral }
) => {
  const { rows } = await pool.query(
    `UPDATE acupoint
        SET acupoint_name = $1
            is_bilateral = $2
      WHERE acupoint_code = $3
      RETURNING acupoint_code, acupoint_name, is_bilateral`,
    [acupointName, isBilateral, acupointCode]
  );
  return rows[0] ? mapAcupoints(rows[0]) : null;
};

const deleteAcupoint = async (acupointCode) => {
  const { rowCount } = await pool.query(
    "DELETE FROM acupoint WHERE acupoint_code = $1",
    [acupointCode]
  );
  return rowCount > 0;
};

module.exports = {
  getAcupoints,
  getAcupointByCode,
  createAcupoint,
  updateAcupoint,
  deleteAcupoint,
};
