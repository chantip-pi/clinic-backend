const express = require('express');
const {
  getMedicalRecordList,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
  getAssignedStaffs
} = require('../controllers/medicalRecord');

const auth = require("../middleware/auth");
const { medicalRecordValidation } = require('../middleware/validation');
const router = express.Router();

router.get('/medicalRecords', auth, getMedicalRecordList);
router.get('/medicalRecords/patient/:patientId', auth, getMedicalRecordsByPatientId);
router.get('/medicalRecords/:medicalRecordId', auth, getMedicalRecordById);
router.post('/medicalRecords', auth, medicalRecordValidation.create, createMedicalRecord);
router.put('/medicalRecords/update/:medicalRecordId', auth, medicalRecordValidation.update, updateMedicalRecord);

module.exports = router;