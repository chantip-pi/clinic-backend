const {
  getAcupunctures,
  getAcupunctureById,
  getAcupuncturesByMeridianId,
  getAcupuncturesByMeridianName,
  getAcupuncturesByRegionAndSide,
  createAcupuncture,
  updateAcupuncture,
  deleteAcupuncture,
} = require("../models/acupuncture");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listAcupunctures = async (req, res) => {
  try {
    const acupunctures = await getAcupunctures();
    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupunctureByIdHandler = async (req, res) => {
  try {
    const acupuncture = await getAcupunctureById(req.params.acupunctureId);
    if (!acupuncture) {
      return res.status(404).json({ error: "Acupuncture not found" });
    }
    res.json(acupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupuncturesByMeridianIdHandler = async (req, res) => {
  try {
    const acupunctures = await getAcupuncturesByMeridianId(
      req.params.meridianId,
    );
    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupuncturesByMeridianNameHandler = async (req, res) => {
  try {
    const acupunctures = await getAcupuncturesByMeridianName(
      req.params.meridianName,
    );
    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupuncturesByRegionAndSideHandler = async (req, res) => {
  try {
    const { region, side } = req.params;
    const acupunctures = await getAcupuncturesByRegionAndSide(region, side);
    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const addAcupuncture = async (req, res) => {
  try {
    const acupuncture = await createAcupuncture(req.body);
    res.status(201).json(acupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const editAcupuncture = async (req, res) => {
  try {
    const acupuncture = await updateAcupuncture(
      req.params.acupunctureId,
      req.body,
    );
    if (!acupuncture) {
      return res.status(404).json({ error: "Acupuncture not found" });
    }
    res.json(acupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const removeAcupuncture = async (req, res) => {
  try {
    const deleted = await deleteAcupuncture(req.params.acupunctureId);
    if (!deleted) {
      return res.status(404).json({ error: "Acupuncture not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listAcupunctures,
  getAcupunctureById: getAcupunctureByIdHandler,
  getAcupuncturesByMeridianId: getAcupuncturesByMeridianIdHandler,
  getAcupuncturesByRegionAndSide: getAcupuncturesByRegionAndSideHandler,
  getAcupuncturesByMeridianName: getAcupuncturesByMeridianNameHandler,
  addAcupuncture,
  editAcupuncture,
  removeAcupuncture,
};
