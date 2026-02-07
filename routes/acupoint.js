const express = require('express');
const {
  listAcupoints,
  getAcupointByCode,
  addAcupoint,
  editAcupoint,
  removeAcupoint
} = require('../controllers/acupoint');

const router = express.Router();

router.get('/acupoints', listAcupoints);
router.get('/acupoints/:acupointCode', getAcupointByCode);
router.post('/acupoints', addAcupoint);
router.put('/acupoints/:acupointCode', editAcupoint);
router.delete('/acupoints/:acupointCode', removeAcupoint);

module.exports = router;
