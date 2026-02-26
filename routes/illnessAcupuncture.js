const express = require("express");
const {
  listIllnessAcupunctures,
  getAcupuncturesByIllnessId,
  addIllnessAcupuncture,
  removeIllnessAcupuncture,
  removeAllAcupuncturesForIllness,
} = require("../controllers/illnessAcupuncture");

const auth = require("../middleware/auth");
const router = express.Router();

router.get("/illnessAcupunctures", auth, listIllnessAcupunctures);
router.get("/illnessAcupunctures/:illnessId", auth, getAcupuncturesByIllnessId);
router.post("/illnessAcupunctures", auth, addIllnessAcupuncture);
router.delete("/illnessAcupunctures/:illnessId/:acupunctureId", auth, removeIllnessAcupuncture);
router.delete("/illnessAcupunctures/:illnessId", auth, removeAllAcupuncturesForIllness);

module.exports = router;
