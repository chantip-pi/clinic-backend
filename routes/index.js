const express = require('express');
const staffRoutes = require('./staff');
const patientRoutes = require('./patient');
const appointmentRoutes = require('./appointment');
const medicalRecordRoutes = require('./medicalRecord');
const acupointRoutes = require('./acupoint');
const geminiRoutes = require('./gemini');
const imageRoutes = require('./images');

const router = express.Router();

// Mount routes under the same /api prefix
router.use('/', staffRoutes);
router.use('/', patientRoutes);
router.use('/', appointmentRoutes);
router.use('/', medicalRecordRoutes);
router.use('/', acupointRoutes);
router.use('/', geminiRoutes);
router.use('/', imageRoutes);

module.exports = router;


