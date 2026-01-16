const express = require("express");
const {
  listMeridians,
  getMeridianById,
  addMeridian,
  editMeridian,
  removeMeridian,
} = require("../controllers/meridian");

const router = express.Router();

router.get("/meridians", listMeridians);
router.get("/meridians/:meridianId", getMeridianById);
router.post("/meridians", addMeridian);
router.put("/meridians/:meridianId", editMeridian);
router.delete("/meridians/:meridianId", removeMeridian);

module.exports = router;
