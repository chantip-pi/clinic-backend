const express = require('express');
const staffRoutes = require('./staff');
const patientRoutes = require('./patient');
const appointmentRoutes = require('./appointment');
const acupointRoutes = require('./acupoint');
const acupointLocationRoutes = require('./acupointLocation');
const acupunctureRoutes = require('./acupuncture');
const illnessRoutes = require('./illness');
const meridianRoutes = require('./meridian');
const geminiRoutes = require('./gemini');
const imageRoutes = require('./images');

const router = express.Router();

// Mount routes under the same /api prefix
router.use('/', staffRoutes);
router.use('/', patientRoutes);
router.use('/', appointmentRoutes);
router.use('/', acupointRoutes);
router.use('/', acupointLocationRoutes);
router.use('/', acupunctureRoutes);
router.use('/', illnessRoutes);
router.use('/', meridianRoutes);
router.use('/', geminiRoutes);
router.use('/', imageRoutes);

module.exports = router;


