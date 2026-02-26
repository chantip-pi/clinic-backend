const express = require("express");
const {
  listMedicalRecordIllnesses,
  getMedicalRecordIllnessesByRecordId,
  addMedicalRecordIllness,
  removeMedicalRecordIllness,
  removeAllIllnessesForRecord,
} = require("../controllers/medicalRecordIllness");

const router = express.Router();
const auth = require("../middleware/auth");

router.get("/medicalRecordIllnesses", auth, listMedicalRecordIllnesses);
router.get("/medicalRecordIllnesses/:recordId", auth, getMedicalRecordIllnessesByRecordId);
router.post("/medicalRecordIllnesses/:recordId", auth, addMedicalRecordIllness);
router.delete("/medicalRecordIllnesses/:recordId/:illnessId", auth, removeMedicalRecordIllness);
router.delete("/medicalRecordIllnesses/:recordId", removeAllIllnessesForRecord);

module.exports = router;