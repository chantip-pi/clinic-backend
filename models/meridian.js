const { pool } = require("../config/database");

const mapMeridians = (row) => ({
  meridianId: row.meridian_id,
  meridianName: row.meridian_name,
  region: row.region,
  side: row.side,
  image: row.image,
});

const getMeridians = async () => {
  const { rows } = await pool.query(
    `SELECT meridian_id, meridian_name, region, side, image FROM meridian ORDER BY meridian_id DESC`
  );
  return rows.map(mapMeridians);
};

const getMeridianById = async (meridianId) => {
  const { rows } = await pool.query(
    `SELECT meridian_id, meridian_name, region, side, image
     FROM meridian
     WHERE meridian_id = $1`,
    [meridianId]
  );
  return rows[0] ? mapMeridians(rows[0]) : null;
};

const getMeridianRegion = async () => {
  const { rows } = await pool.query(
    `SELECT DISTINCT region FROM meridian`
  );
  return rows.map(mapMeridians);
};

const getMeridianSidesByRegion = async (region) => {
  const res = await pool.query(
    `
    SELECT LOWER(region) AS region, LOWER(side) AS side
    FROM meridian
    WHERE LOWER(region) = ANY($1)
    GROUP BY region, side
    `,
    [region],
  );

  const map = {};

  res.rows.forEach(({ region, side }) => {
    if (!map[region]) map[region] = [];
    map[region].push(side);
  });

  return map;
};

const createMeridian = async ({ meridianName, region, side, image }) => {
  const { rows } = await pool.query(
    `INSERT INTO meridian (
         meridian_name,
            region,
            side,   
            image
        )  
        VALUES ($1, $2, $3, $4)
        RETURNING meridian_id,
                meridian_name,
                region,
                side,
                image`,
    [meridianName, region, side, image]
  );
  return mapMeridians(rows[0]);
};

const updateMeridian = async (
  meridianId,
  { meridianName, region, side, image }
) => {
  const { rows } = await pool.query(
    `UPDATE meridian
        SET meridian_name = $1,
            region = $2,
            side = $3,
            image = $4
      WHERE meridian_id = $5
      RETURNING meridian_id,
                meridian_name,
                region,
                side,
                image`,
    [meridianName, region, side, image, meridianId]
  );
  return rows[0] ? mapMeridians(rows[0]) : null;
};

const deleteMeridian = async (meridianId) => {
  const { rowCount } = await pool.query(
    "DELETE FROM meridian WHERE meridian_id = $1",
    [meridianId]
  );
  return rowCount > 0;
};

module.exports = {
  getMeridians,
  getMeridianById,
  getMeridianRegion,
  getMeridianSidesByRegion,
  createMeridian,
  updateMeridian,
  deleteMeridian,
};
