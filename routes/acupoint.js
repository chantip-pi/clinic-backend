const express = require('express');
const {
  listAcupoints,
  getAcupointByCode,
  addAcupoint,
  editAcupoint,
  removeAcupoint
} = require('../controllers/acupoint');

const auth = require("../middleware/auth");
const { acupointValidation } = require('../middleware/validation');
const router = express.Router();

router.get('/acupoints', auth, listAcupoints);
router.get('/acupoints/:acupointCode', auth, getAcupointByCode);
router.post('/acupoints', auth, acupointValidation.create, addAcupoint);
router.put('/acupoints/:acupointCode', auth, acupointValidation.update, editAcupoint);
router.delete('/acupoints/:acupointCode', auth, removeAcupoint);

module.exports = router;
