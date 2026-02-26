const express = require("express");
const {
  listMedicalRecordAcupunctures,
  getMedicalRecordAcupuncturesByRecordId,
  addMedicalRecordAcupuncture,
  removeMedicalRecordAcupuncture,
  removeAllAcupuncturesForRecord,
} = require("../controllers/medicalRecordAcupuncture");

const router = express.Router();
const auth = require("../middleware/auth");

router.get("/medicalRecordAcupunctures", auth, listMedicalRecordAcupunctures);
router.get("/medicalRecordAcupunctures/:recordId", auth, getMedicalRecordAcupuncturesByRecordId);
router.post("/medicalRecordAcupunctures/:recordId", auth, addMedicalRecordAcupuncture);
router.delete("/medicalRecordAcupunctures/:recordId/:acupunctureId", auth, removeMedicalRecordAcupuncture);
router.delete("/medicalRecordAcupunctures/:recordId", removeAllAcupuncturesForRecord);

module.exports = router;
