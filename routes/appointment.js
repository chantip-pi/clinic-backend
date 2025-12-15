const express = require('express');
const {
  listAllAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getUpcomingAppointmentDate,
  addAppointment,
  editAppointment,
  removeAppointment
} = require('../controllers/appointment');

const router = express.Router();

router.get('/appointments', listAllAppointments);
router.get('/appointments/upcoming/:patientId', getUpcomingAppointmentDate);
router.get('/appointments/date/:appointmentDate', getAppointmentsByDate);
router.get('/appointments/patient/:patientId', getAppointmentsByPatientId);
router.get('/appointments/:appointmentId', getAppointmentById);
router.post('/appointments', addAppointment);
router.put('/appointments/:appointmentId', editAppointment);
router.delete('/appointments/:appointmentId', removeAppointment);

module.exports = router;


