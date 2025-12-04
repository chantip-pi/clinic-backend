const express = require('express');
const {
  listPatients,
  getPatientsByAppointmentDate,
  getPatientById,
  addPatient,
  editPatient,
  removePatient
} = require('../controllers/patient');

const router = express.Router();

router.get('/patients', listPatients);
router.get('/patients/appointment/:appointmentDate', getPatientsByAppointmentDate);
router.get('/patients/:patientId', getPatientById);
router.post('/patients', addPatient);
router.put('/patients/:patientId', editPatient);
router.delete('/patients/:patientId', removePatient);

module.exports = router;


