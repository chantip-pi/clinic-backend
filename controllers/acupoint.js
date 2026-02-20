const {
  getAcupoints,
  getAcupointByCode,
  createAcupoint,
  updateAcupoint,
  deleteAcupoint
} = require('../models/acupoint');

const handleError = (res, error) => {
  console.error(error);

  // PostgreSQL unique constraint violation
  if (error.code === '23505') {
    const detail = error.detail || '';

    if (detail.includes('acupoint_code')) {
      return res.status(409).json({ error: 'Acupuncture point code is already exist' });
    }

    if (detail.includes('acupoint_name')) {
      return res.status(409).json({ error: 'Acupuncture point name is already exist' });
    }

    // Fallback for any other unique constraint
    return res.status(409).json({ error: 'An acupuncture point with these details already exists' });
  }

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
    const acupoint = await getAcupointByCode(req.params.acupointCode);
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

const editAcupoint = async (req, res) => {
  try {
    const acupoint = await updateAcupoint(req.params.acupointCode, req.body);
    if (!acupoint) {
      return res.status(404).json({ error: 'Acupuncture Point not found' });
    }
    res.json(acupoint);
  } catch (error) {
    handleError(res, error);
  }
};

const removeAcupoint = async (req, res) => {
  try {
    const deleted = await deleteAcupoint(req.params.acupointCode);
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
  editAcupoint,
  removeAcupoint
};
