const express = require('express');
const {
  listPatients,
  getPatientsByAppointmentDate,
  getPatientById,
  addPatient,
  editPatient,
  removePatient
} = require('../controllers/patient');

const auth = require('../middleware/auth');
const router = express.Router();

router.get('/patients', auth, listPatients);
router.get('/patients/appointment/:appointmentDate', auth, getPatientsByAppointmentDate);
router.get('/patients/:patientId', auth, getPatientById);
router.post('/patients', auth, addPatient);
router.put('/patients/:patientId', auth, editPatient);
router.delete('/patients/:patientId', auth, removePatient);

module.exports = router;


