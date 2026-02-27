const express = require('express');
const {
  listAcupoints,
  getAcupointByCode,
  addAcupoint,
  editAcupoint,
  removeAcupoint
} = require('../controllers/acupoint');

const auth = require("../middleware/auth");
const router = express.Router();

router.get('/acupoints', auth, listAcupoints);
router.get('/acupoints/:acupointCode', auth, getAcupointByCode);
router.post('/acupoints', auth, addAcupoint);
router.put('/acupoints/:acupointCode', auth, editAcupoint);
router.delete('/acupoints/:acupointCode', auth, removeAcupoint);

module.exports = router;
