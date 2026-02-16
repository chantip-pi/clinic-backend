const express = require("express");
const {
  listMedicalRecordIllnesses,
  getMedicalRecordIllnessesByRecordId,
  addMedicalRecordIllness,
  removeMedicalRecordIllness,
  removeAllIllnessesForRecord,
} = require("../controllers/medicalRecordIllness");

const router = express.Router();

router.get("/medicalRecordIllnesses", listMedicalRecordIllnesses);
router.get("/medicalRecordIllnesses/:recordId", getMedicalRecordIllnessesByRecordId);
router.post("/medicalRecordIllnesses/:recordId", addMedicalRecordIllness);
router.delete("/medicalRecordIllnesses/:recordId/:illnessId", removeMedicalRecordIllness);
router.delete("/medicalRecordIllnesses/:recordId", removeAllIllnessesForRecord);

module.exports = router;