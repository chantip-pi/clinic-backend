const express = require('express');
const {
  listAllAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  getUpcomingAppointmentDate,
  getScheduledAppointmentsByPatientId,
  addAppointment,
  updateAppointment,
  removeAppointment,
  cancelAppointment,
} = require('../controllers/appointment');

const router = express.Router();

router.get('/appointments', listAllAppointments);
router.get('/appointments/upcoming/:patientId', getUpcomingAppointmentDate);
router.get('/appointments/scheduled/:patientId', getScheduledAppointmentsByPatientId);
router.get('/appointments/date/:appointmentDate', getAppointmentsByDate);
router.get('/appointments/patient/:patientId', getAppointmentsByPatientId);
router.get('/appointments/doctor/:doctorId', getAppointmentsByDoctorId);
router.get('/appointments/:appointmentId', getAppointmentById);
router.post('/appointments', addAppointment);
router.put('/appointments/:appointmentId', updateAppointment);
router.put('/appointments/:appointmentId/cancel', cancelAppointment);
router.delete('/appointments/:appointmentId', removeAppointment);

module.exports = router;


