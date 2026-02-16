const { pool } = require("../config/database");

const mapAcupuncture = (row) => ({
  acupunctureId: row.acupuncture_id,
  acupointCode: row.acupoint_code,
  acupointName: row.acupoint_name,
  locationId: row.location_id,
  pointLeft: row.point_left,
  pointTop: row.point_top,
  meridianId: row.meridian_id,
  meridianName: row.meridian_name,
  region: row.region,
  side: row.side,
  image: row.image,
});

const getAcupunctures = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM vw_acupuncture ORDER BY acupuncture_id ASC`,
  );
  return rows.map(mapAcupuncture);
};

const getAcupunctureById = async (acupunctureId) => {
  const { rows } = await pool.query(
    `SELECT * 
      FROM vw_acupuncture 
      WHERE acupuncture_id = $1`,
    [acupunctureId],
  );
  return rows[0] ? mapAcupuncture(rows[0]) : null;
};

const getAcupuncturesByMeridianId = async (meridianId) => {
  const { rows } = await pool.query(
    `SELECT *
      FROM vw_acupuncture
      WHERE meridian_id = $1
      ORDER BY acupuncture_id ASC`,
    [meridianId],
  );
  return rows.map(mapAcupuncture);
};

const getAcupuncturesByMeridianName = async (meridianName) => {
  const { rows } = await pool.query(
    `SELECT *
      FROM vw_acupuncture
      WHERE meridian_name = $1
      ORDER BY acupuncture_id ASC`,
    [meridianName],
  );
  return rows.map(mapAcupuncture);
};

const getAcupuncturesByRegionAndSide = async (region, side) => {
  const { rows } = await pool.query(
    `SELECT *
      FROM vw_acupuncture
      WHERE LOWER(region) = $1 AND LOWER(side) = $2
      ORDER BY acupuncture_id ASC`,
    [region, side],
  );
  return rows.map(mapAcupuncture);
};

const createAcupuncture = async ({ acupointCode, meridianId }) => {
  const { rows } = await pool.query(
    `INSERT INTO acupuncture (
            acupoint_code,
            meridian_id
        )   VALUES ($1, $2) 
        RETURNING acupuncture_id,
                acupoint_code,
                meridian_id`,
    [acupointCode, meridianId],
  );
  return mapAcupuncture(rows[0]);
};

const updateAcupuncture = async (
  acupunctureId,
  { acupointCode, meridianId },
) => {
  const { rows } = await pool.query(
    `UPDATE acupuncture
        SET acupoint_code = $1,
            meridian_id = $2
        WHERE acupuncture_id = $3
        RETURNING acupuncture_id,
                acupoint_code,
                meridian_id`,
    [acupointCode, meridianId, acupunctureId],
  );
  return rows[0] ? mapAcupuncture(rows[0]) : null;
};

const deleteAcupuncture = async (acupunctureId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM acupuncture WHERE acupuncture_id = $1",
    [acupunctureId],
  );
  return rowCount > 0;
};

module.exports = {
  getAcupunctures,
  getAcupunctureById,
  getAcupuncturesByMeridianId,
  getAcupuncturesByMeridianName,
  getAcupuncturesByRegionAndSide,
  createAcupuncture,
  updateAcupuncture,
  deleteAcupuncture,
};
