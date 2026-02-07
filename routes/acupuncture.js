const express = require("express");
const {
  listAcupunctures,
  getAcupunctureById,
  getAcupuncturesByMeridianId,
  getAcupuncturesByRegionAndSide,
  addAcupuncture,
  editAcupuncture,
  removeAcupuncture,
} = require("../controllers/acupuncture");

const router = express.Router();

router.get("/acupunctures", listAcupunctures);
router.get("/acupunctures/:acupunctureId", getAcupunctureById);
router.get("/acupunctures/meridian/:meridianId", getAcupuncturesByMeridianId);
router.get("/acupunctures/region/:region/side/:side", getAcupuncturesByRegionAndSide);
router.post("/acupunctures", addAcupuncture);
router.put("/acupunctures/:acupunctureId", editAcupuncture);
router.delete("/acupunctures/:acupunctureId", removeAcupuncture);

module.exports = router;
