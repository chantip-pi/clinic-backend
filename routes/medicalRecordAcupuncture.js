const express = require("express");
const {
  listMedicalRecordAcupunctures,
  getMedicalRecordAcupuncturesByRecordId,
  addMedicalRecordAcupuncture,
  removeMedicalRecordAcupuncture,
  removeAllAcupuncturesForRecord,
} = require("../controllers/medicalRecordAcupuncture");

const router = express.Router();

router.get("/medicalRecordAcupunctures", listMedicalRecordAcupunctures);
router.get("/medicalRecordAcupunctures/:recordId", getMedicalRecordAcupuncturesByRecordId);
router.post("/medicalRecordAcupunctures/:recordId", addMedicalRecordAcupuncture);
router.delete("/medicalRecordAcupunctures/:recordId/:acupunctureId", removeMedicalRecordAcupuncture);
router.delete("/medicalRecordAcupunctures/:recordId", removeAllAcupuncturesForRecord);

module.exports = router;
