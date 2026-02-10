const express = require("express");
const {
  listMeridians,
  getMeridianById,
  getMeridiansByRegionAndSide,
  getMeridianRegion,
  getMeridianSidesByRegion,
  addMeridian,
  editMeridian,
  removeMeridian,
} = require("../controllers/meridian");

const router = express.Router();

router.get("/meridians", listMeridians);
router.get("/meridians/meridian/:meridianId", getMeridianById);
router.get("/meridians/region/:region/side/:side", getMeridiansByRegionAndSide);
router.get("/meridians/regions", getMeridianRegion);
router.get("/meridians/regions/:region", getMeridianSidesByRegion);
router.post("/meridians", addMeridian);
router.put("/meridians/meridian/:meridianId", editMeridian);
router.delete("/meridians/meridian/:meridianId", removeMeridian);

module.exports = router;
