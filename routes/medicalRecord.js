const express = require('express');
const {
  getMedicalRecordList,
  getMedicalRecordById,
  getMedicalRecordsByPatientId,
  createMedicalRecord,
  updateMedicalRecord,
  assignStaffs,
  getAssignedStaffs
} = require('../controllers/medicalRecord');

const router = express.Router();

router.get('/medicalRecords', getMedicalRecordList);
router.get('/medicalRecords/patient/:patientId', getMedicalRecordsByPatientId);
router.get('/medicalRecords/:medicalRecordId', getMedicalRecordById);
router.get('/medicalRecords/assignStaffs/:medicalRecordId', getAssignedStaffs);
router.post('/medicalRecords', createMedicalRecord);
router.put('/medicalRecords/update/:medicalRecordId', updateMedicalRecord);
router.post('/medicalRecords/assignStaffs/:medicalRecordId', assignStaffs);

module.exports = router;
