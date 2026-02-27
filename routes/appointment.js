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

const auth = require("../middleware/auth");
const router = express.Router();

router.get('/appointments', auth, listAllAppointments);
router.get('/appointments/upcoming/:patientId', auth, getUpcomingAppointmentDate);
router.get('/appointments/scheduled/:patientId', auth, getScheduledAppointmentsByPatientId);
router.get('/appointments/date/:appointmentDate', auth, getAppointmentsByDate);
router.get('/appointments/patient/:patientId', auth, getAppointmentsByPatientId);
router.get('/appointments/doctor/:doctorId', auth, getAppointmentsByDoctorId);
router.get('/appointments/:appointmentId', auth, getAppointmentById);
router.post('/appointments', auth, addAppointment);
router.put('/appointments/:appointmentId', auth, updateAppointment);
router.put('/appointments/:appointmentId/cancel', auth, cancelAppointment);
router.delete('/appointments/:appointmentId', auth, removeAppointment);

module.exports = router;


