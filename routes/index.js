const express = require('express');
const {
  listStaff,
  getStaffById,
  getStaffByUsername,
  addStaff,
  editStaff,
  removeStaff
} = require('../controllers');

const router = express.Router();

router.get('/staff', listStaff);
router.get('/staff/id/:staffId', getStaffById);
router.get('/staff/username/:username', getStaffByUsername);
router.post('/staff', addStaff);
router.put('/staff/:staffId', editStaff);
router.delete('/staff/:staffId', removeStaff);

module.exports = router;