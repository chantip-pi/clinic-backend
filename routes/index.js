const express = require('express');
const staffRoutes = require('./staff');
const patientRoutes = require('./patient');
const appointmentRoutes = require('./appointment');
const medicalRecordRoutes = require('./medicalRecord');
const acupointRoutes = require('./acupoint');
const acupointLocationRoutes = require('./acupointLocation');
const acupunctureRoutes = require('./acupuncture');
const illnessRoutes = require('./illness');
const meridianRoutes = require('./meridian');
const geminiRoutes = require('./gemini');
const imageRoutes = require('./images');
const medicalRecordAcupunctureRoutes = require('./medicalRecordAcupuncture');
const illnessAcupunctureRoutes = require('./illnessAcupuncture');
const medicalRecordIllnessRoutes = require('./medicalRecordIllness');

const router = express.Router();

// Mount routes under the same /api prefix
router.use('/', staffRoutes);
router.use('/', patientRoutes);
router.use('/', appointmentRoutes);
router.use('/', medicalRecordRoutes);
router.use('/', acupointRoutes);
router.use('/', acupointLocationRoutes);
router.use('/', acupunctureRoutes);
router.use('/', illnessRoutes);
router.use('/', meridianRoutes);
router.use('/', geminiRoutes);
router.use('/', imageRoutes);
router.use('/', medicalRecordAcupunctureRoutes);
router.use('/', illnessAcupunctureRoutes);
router.use('/', medicalRecordIllnessRoutes);

module.exports = router;


