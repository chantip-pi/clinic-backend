const { pool } = require("../config/database");

const mapAcupoints = (row) => ({
  acupointCode: row.acupoint_code,
  acupointName: row.acupoint_name,
});

const getAcupoints = async () => {
  const { rows } = await pool.query(
    `SELECT acupoint_code, acupoint_name FROM acupoint ORDER BY acupoint_code DESC`
  );
  return rows.map(mapAcupoints);
};

const getAcupointByCode = async (acupointCode) => {
  const { rows } = await pool.query(
    `SELECT acupoint_code,
            acupoint_name
     FROM acupoint
     WHERE acupoint_code = $1`,
    [acupointCode]
  );
  return rows[0] ? mapAcupoints(rows[0]) : null;
};

const createAcupoint = async ({
  acupoint_code,
  acupoint_name,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO acupoint (
       acupoint_code,
            acupoint_name
     )
     VALUES ($1, $2)
     RETURNING acupoint_code,
            acupoint_name`,
    [acupoint_code, acupoint_name]
  );
  return mapAcupoints(rows[0]);
};

const updateAcupoint = async (
  acupointCode,
  { acupoint_name }
) => {
  const { rows } = await pool.query(
    `UPDATE acupoint
        SET acupoint_name = $1
      WHERE acupoint_code = $2
      RETURNING acupoint_code, acupoint_name`,
    [acupoint_name, acupointCode]
  );
  return rows[0] ? mapAcupoints(rows[0]) : null;
}

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
