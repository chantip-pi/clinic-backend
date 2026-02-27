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
const { staffValidation } = require('../middleware/validation');
const { authLimiter, createLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Staff routes with rate limiting
router.get('/staff', auth, listStaff);
router.get('/staff/id/:staffId', auth, getStaffById);
router.get('/staff/username/:username', auth, getStaffByUsername);
router.post('/staff/login', authLimiter, staffValidation.login, loginStaff);
router.get('/staff/doctors', auth, getDoctorName);
router.get('/staff/staffs', auth, getStaffName);
router.post('/staff', createLimiter, auth, staffValidation.create, addStaff);
router.put('/staff/:staffId', auth, staffValidation.update, editStaff);
router.delete('/staff/:staffId', auth, removeStaff);

module.exports = router;