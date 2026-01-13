const {
  getAcupoints,
  getAcupointByCode,
  createAcupoint,
  deleteAcupoint
} = require('../models/acupoint');

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};

const listAcupoints = async (req, res) => {
  try {
    const acupoints = await getAcupoints();
    res.json(acupoints);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupointByCodeHandler = async (req, res) => {
  try {
    const acupoint = await getAcupointByCode(req.params.acupunctureCode);
    if (!acupoint) {
      return res.status(404).json({ error: 'Acupuncture point not found' });
    }
    res.json(acupoint);
  } catch (error) {
    handleError(res, error);
  }
};

const addAcupoint = async (req, res) => {
  try {
    const acupoint = await createAcupoint(req.body);
    res.status(201).json(acupoint);
  } catch (error) {
    handleError(res, error);
  }
};

const removeAcupoint = async (req, res) => {
  try {
    const deleted = await deleteAcupoint(req.params.acupunctureCode);
    if (!deleted) {
      return res.status(404).json({ error: 'Acupuncture Point not found' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listAcupoints,
  getAcupointByCode: getAcupointByCodeHandler,
  addAcupoint,
  removeAcupoint
};
