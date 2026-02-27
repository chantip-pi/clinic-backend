const express = require("express");
const {
  listAcupunctures,
  getAcupunctureById,
  getAcupuncturesByMeridianId,
  getAcupuncturesByMeridianName,
  getAcupuncturesByRegionAndSide,
  addAcupuncture,
  editAcupuncture,
  removeAcupuncture,
} = require("../controllers/acupuncture");

const auth = require("../middleware/auth");
const { acupunctureValidation } = require('../middleware/validation');
const router = express.Router();

router.get("/acupunctures", auth, listAcupunctures);
router.get("/acupunctures/:acupunctureId", auth, getAcupunctureById);
router.get("/acupunctures/meridian/:meridianId", auth, getAcupuncturesByMeridianId);
router.get("/acupunctures/meridianName/:meridianName", auth, getAcupuncturesByMeridianName);
router.get("/acupunctures/region/:region/side/:side", auth, getAcupuncturesByRegionAndSide);
router.post("/acupunctures", auth, acupunctureValidation.create, addAcupuncture);
router.put("/acupunctures/:acupunctureId", auth, acupunctureValidation.update, editAcupuncture);
router.delete("/acupunctures/:acupunctureId", auth, removeAcupuncture);

module.exports = router;
