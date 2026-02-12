const express = require("express");
const {
  listIllnessAcupunctures,
  getAcupuncturesByIllnessId,
  addIllnessAcupuncture,
  removeIllnessAcupuncture,
  removeAllAcupuncturesForIllness,
} = require("../controllers/illnessAcupuncture");

const router = express.Router();

router.get("/illnessAcupunctures", listIllnessAcupunctures);
router.get("/illnessAcupunctures/:illnessId", getAcupuncturesByIllnessId);
router.post("/illnessAcupunctures", addIllnessAcupuncture);
router.delete("/illnessAcupunctures/:illnessId/:acupunctureId", removeIllnessAcupuncture);
router.delete("/illnessAcupunctures/:illnessId", removeAllAcupuncturesForIllness);

module.exports = router;
