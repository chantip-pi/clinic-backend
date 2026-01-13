const express = require('express');
const {
  listAcupoints,
  getAcupointByCode,
  addAcupoint,
  removeAcupoint
} = require('../controllers/acupoint');

const router = express.Router();

router.get('/acupoints', listAcupoints);
router.get('/acupoints/:acupunctureCode', getAcupointByCode);
router.post('/acupoints', addAcupoint);
router.delete('/acupoints/:acupunctureCode', removeAcupoint);
;

module.exports = router;
