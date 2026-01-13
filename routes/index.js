const express = require('express');
const staffRoutes = require('./staff');
const patientRoutes = require('./patient');
const appointmentRoutes = require('./appointment');
const acupointRoutes = require('./acupoint');

const router = express.Router();

// Mount routes under the same /api prefix
router.use('/', staffRoutes);
router.use('/', patientRoutes);
router.use('/', appointmentRoutes);
router.use('/', acupointRoutes);

module.exports = router;


