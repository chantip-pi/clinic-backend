const express = require('express');
const {
  listStaff,
  getStaffById,
  getStaffByUsername,
  loginStaff,
  addStaff,
  editStaff,
  removeStaff
} = require('../controllers/staff');
const patientRoutes = require('./patient');
const appointmentRoutes = require('./appointment');

const router = express.Router();

// Staff routes (existing)
router.get('/staff', listStaff);
router.get('/staff/id/:staffId', getStaffById);
router.get('/staff/username/:username', getStaffByUsername);
router.get('/staff/login/:username/:password', loginStaff);
router.post('/staff', addStaff);
router.put('/staff/:staffId', editStaff);
router.delete('/staff/:staffId', removeStaff);

// Patient routes (separate module)
router.use('/', patientRoutes);

// Appointment routes (separate module)
router.use('/', appointmentRoutes);

module.exports = router;