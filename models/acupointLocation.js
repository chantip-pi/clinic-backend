const { pool } = require("../config/database");

const mapAcupointLocations = (row) => ({
  locationId: row.location_id,
  meridianId: row.meridian_id,
  acupointCode: row.acupoint_code,
  pointTop: row.point_top,
  pointLeft: row.point_left,
});

const getAcupointLocations = async () => {
  const { rows } = await pool.query(
    `SELECT location_id, meridian_id, acupoint_code, point_top, point_left FROM acupoint_location ORDER BY location_id DESC`
  );
  return rows.map(mapAcupoints);
};

const getAcupointLocationById = async (locationId) => {
  const { rows } = await pool.query(
    `SELECT location_id, meridian_id, acupoint_code, point_top, point_left
     FROM acupoint_location
     WHERE location_id = $1`,
    [locationId]
  );
  return rows[0] ? mapAcupointLocations(rows[0]) : null;
};

const createAcupointLocation = async ({
  meridian_id,
  acupoint_code,
  point_top,
  point_left,
}) => {
  const { rows } = await pool.query(
    `INSERT INTO acupoint_location (
       meridian_id,
            acupoint_code,
            point_top,
            point_left
     )
        VALUES ($1, $2, $3, $4)
        RETURNING location_id,
                meridian_id,
                acupoint_code,
                point_top,
                point_left`,
    [meridian_id, acupoint_code, point_top, point_left]
  );
  return mapAcupointLocations(rows[0]);
};

const updateAcupointLocation = async (
  locationId,
  { meridian_id, acupoint_code, point_top, point_left }
) => {
  const { rows } = await pool.query(
    `UPDATE acupoint_location
        SET meridian_id = $1,
            acupoint_code = $2,
            point_top = $3,
            point_left = $4
      WHERE location_id = $5
      RETURNING location_id,
                meridian_id,
                acupoint_code,
                point_top,
                point_left`,
    [meridian_id, acupoint_code, point_top, point_left, locationId]
  );
  return rows[0] ? mapAcupointLocations(rows[0]) : null;
};

const deleteAcupointLocation = async (locationId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM acupoint_location WHERE location_id = $1",
    [locationId]
  );
  return rowCount > 0;
};

module.exports = {
  getAcupointLocations,
  getAcupointLocationById,
  createAcupointLocation,
  updateAcupointLocation,
  deleteAcupointLocation,
};
