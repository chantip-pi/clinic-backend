const express = require('express');
const {
  getMedicalRecordList,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
  getAssignedStaffs
} = require('../controllers/medicalRecord');

const router = express.Router();

router.get('/medicalRecords', getMedicalRecordList);
router.get('/medicalRecords/patient/:patientId', getMedicalRecordsByPatientId);
router.get('/medicalRecords/:medicalRecordId', getMedicalRecordById);
router.post('/medicalRecords', createMedicalRecord);
router.put('/medicalRecords/update/:medicalRecordId', updateMedicalRecord);

module.exports = router;