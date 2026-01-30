const express = require("express");
const {
  listMedicalRecordAcupunctures,
  getMedicalRecordAcupunctureById,
  addMedicalRecordAcupuncture,
  editMedicalRecordAcupuncture,
  removeMedicalRecordAcupuncture,
} = require("../controllers/medicalRecordAcupuncture");

const router = express.Router();

router.get("/medicalRecordAcupunctures", listMedicalRecordAcupunctures);
router.get("/medicalRecordAcupunctures/:recordAcupunctureId", getMedicalRecordAcupunctureById);
router.post("/medicalRecordAcupunctures", addMedicalRecordAcupuncture);
router.put("/medicalRecordAcupunctures/:recordAcupunctureId", editMedicalRecordAcupuncture);
router.delete("/medicalRecordAcupunctures/:recordAcupunctureId", removeMedicalRecordAcupuncture);

module.exports = router;
