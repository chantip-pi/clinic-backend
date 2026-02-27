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
const { patientValidation } = require('../middleware/validation');
const router = express.Router();

router.get('/patients', auth, listPatients);
router.get('/patients/appointment/:appointmentDate', auth, getPatientsByAppointmentDate);
router.get('/patients/:patientId', auth, getPatientById);
router.post('/patients', auth, patientValidation.create, addPatient);
router.put('/patients/:patientId', auth, patientValidation.update, editPatient);
router.delete('/patients/:patientId', auth, removePatient);

module.exports = router;


