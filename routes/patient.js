const express = require('express');
const {
  listPatients,
  getPatientById,
  addPatient,
  editPatient,
  removePatient
} = require('../controllers/patient');

const router = express.Router();

router.get('/patients', listPatients);
router.get('/patients/:patientId', getPatientById);
router.post('/patients', addPatient);
router.put('/patients/:patientId', editPatient);
router.delete('/patients/:patientId', removePatient);

module.exports = router;


