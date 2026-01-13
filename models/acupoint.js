const { pool } = require("../config/database");

const mapAcupoints = (row) => ({
  acupunctureCode: row.acupuncture_code,
  acupunctureName: row.acupuncture_name,
  region: row.region,
  side: row.side,
  meridian: row.meridian,
  point_top: row.point_top,
  point_left: row.point_left,
});

const getAcupoints = async () => {
  const { rows } = await pool.query(
    `SELECT acupuncture_code, acupuncture_name, region, side, meridian, point_top, point_left FROM acupoints ORDER BY acupuncture_code DESC`
  );
  return rows.map(mapAcupoints);
};

const getAcupointByCode = async (acupunctureCode) => {
  const { rows } = await pool.query(
    `SELECT acupuncture_code,
            acupuncture_name,
            region,
            side,
            meridian,
            point_top,
            point_left
     FROM acupoints
     WHERE acupuncture_code = $1`,
    [acupunctureCode]
  );
  return rows[0] ? mapAcupoints(rows[0]) : null;
};

const createAcupoint = async ({
  acupuncture_code,
  acupuncture_name,
  region,
  side,
  meridian,
  point_top,
  point_left,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO acupoints (
       acupuncture_code,
            acupuncture_name,
            region,
            side,
            meridian,
            point_top,
            point_left
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING acupuncture_code,
            acupuncture_name,
            region,
            side,
            meridian,
            point_top,
            point_left`,
    [acupuncture_code, acupuncture_name, region, side, meridian, point_top, point_left]
  );
  return mapAcupoints(rows[0]);
};

const deleteAcupoint = async (acupunctureCode) => {
  const { rowCount } = await pool.query(
    "DELETE FROM acupoints WHERE acupuncture_code = $1",
    [acupunctureCode]
  );
  return rowCount > 0;
};

module.exports = {
  getAcupoints,
  getAcupointByCode,
  createAcupoint,
  deleteAcupoint,
};
