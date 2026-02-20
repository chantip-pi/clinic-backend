const {
  getIllnesses,
  getIllnessById,
  createIllness,
  updateIllness,
  deleteIllness,
} = require("../models/illness");

const handleError = (res, error) => {
  console.error(error);

  // PostgreSQL unique constraint violation
  if (error.code === '23505') {
    const detail = error.detail || '';

    if (detail.includes('illness_name')) {
      return res.status(409).json({ error: 'Illness name is already in use' });
    }

    // Fallback for any other unique constraint
    return res.status(409).json({ error: 'An illness with this name already exists' });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

const listIllnesses = async (req, res) => {
  try {
    const illnesses = await getIllnesses();
    res.json(illnesses);
  } catch (error) {
    handleError(res, error);
  }
};

const getIllnessByIdHandler = async (req, res) => {
  try {
    const illness = await getIllnessById(req.params.illnessId);
    if (!illness) {
      return res.status(404).json({ error: "Illness not found" });
    }
    res.json(illness);
  } catch (error) {
    handleError(res, error);
  }
};

const addIllness = async (req, res) => {
  try {
    const illness = await createIllness(req.body);
    res.status(201).json(illness);
  } catch (error) {
    handleError(res, error);
  }
};

const editIllness = async (req, res) => {
  try {
    const illness = await updateIllness(req.params.illnessId, req.body);
    if (!illness) {
      return res.status(404).json({ error: "Illness not found" });
    }
    res.json(illness);
  } catch (error) {
    handleError(res, error);
  }
};

const removeIllness = async (req, res) => {
  try {
    const deleted = await deleteIllness(req.params.illnessId);
    if (!deleted) {
      return res.status(404).json({ error: "Illness not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listIllnesses,
  getIllnessById: getIllnessByIdHandler,
  addIllness,
  editIllness,
  removeIllness,
};
