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
router.get('/acupoints/:acupunctureCode', getAcupointByCode);
router.post('/acupoints', addAcupoint);
router.put('/acupoints/:acupunctureCode', editAcupoint);
router.delete('/acupoints/:acupunctureCode', removeAcupoint);

module.exports = router;
