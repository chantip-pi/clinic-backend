const express = require('express');
const {
  listStaff,
  getStaffById,
  getStaffByUsername,
  getDoctorName,
  getStaffName,
  loginStaff,
  addStaff,
  editStaff,
  removeStaff
} = require('../controllers/staff');

const auth = require('../middleware/auth');

const router = express.Router();

// Staff routes (existing)
router.get('/staff', auth, listStaff);
router.get('/staff/id/:staffId', auth, getStaffById);
router.get('/staff/username/:username', auth, getStaffByUsername);
router.post('/staff/login', loginStaff);
router.get('/staff/doctors', auth, getDoctorName);
router.get('/staff/staffs', auth, getStaffName);
router.post('/staff', auth, addStaff);
router.put('/staff/:staffId', auth, editStaff);
router.delete('/staff/:staffId', auth, removeStaff);

module.exports = router;