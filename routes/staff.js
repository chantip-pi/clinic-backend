const express = require('express');
const {
  listStaff,
  getStaffById,
  getStaffByUsername,
  getDoctorName,
  getNurseName,
  loginStaff,
  addStaff,
  editStaff,
  removeStaff
} = require('../controllers/staff');

const router = express.Router();

// Staff routes (existing)
router.get('/staff', listStaff);
router.get('/staff/id/:staffId', getStaffById);
router.get('/staff/username/:username', getStaffByUsername);
router.get('/staff/login/:username/:password', loginStaff);
router.get('/staff/doctors', getDoctorName);
router.get('/staff/nurses', getNurseName);
router.post('/staff', addStaff);
router.put('/staff/:staffId', editStaff);
router.delete('/staff/:staffId', removeStaff);

module.exports = router;