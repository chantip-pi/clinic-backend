const {
  getIllnessAcupunctures,
  getAcupuncturesByIllnessId,
  createIllnessAcupuncture,
  deleteIllnessAcupuncture,
  deleteAllAcupuncturesByIllnessId,
} = require("../models/illnessAcupuncture");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listIllnessAcupunctures = async (req, res) => {
  try {
    const illnessAcupunctures = await getIllnessAcupunctures();
    res.json(illnessAcupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupuncturesByIllnessIdHandler = async (req, res) => {
  try {
    const { illnessId } = req.params;
    const acupunctures = await getAcupuncturesByIllnessId(illnessId);
    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const addIllnessAcupuncture = async (req, res) => {
  try {
    const { illnessId, acupunctureId } = req.body;
    const illnessAcupuncture = await createIllnessAcupuncture({
      illnessId,
      acupunctureId,
    });
    res.status(201).json(illnessAcupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const removeIllnessAcupuncture = async (req, res) => {
  try {
    const { illnessId, acupunctureId } = req.params;
    const deleted = await deleteIllnessAcupuncture(illnessId, acupunctureId);
    if (!deleted) {
      return res.status(404).json({ error: "Illness Acupuncture not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

const removeAllAcupuncturesForIllness = async (req, res) => {
  try {
    const { illnessId } = req.params;

    const deletedCount = await deleteAllAcupuncturesByIllnessId(illnessId);

    res.status(204).send({ deletedCount });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listIllnessAcupunctures,
  getAcupuncturesByIllnessId: getAcupuncturesByIllnessIdHandler,
  addIllnessAcupuncture,
  removeIllnessAcupuncture,
  removeAllAcupuncturesForIllness,
};
