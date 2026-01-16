const {
  getMeridians,
  getMeridianById,
  createMeridian,
  updateMeridian,
  deleteMeridian,
} = require("../models/meridian");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listMeridians = async (req, res) => {
  try {
    const meridians = await getMeridians();
    res.json(meridians);
  } catch (error) {
    handleError(res, error);
  }
};

const getMeridianByIdHandler = async (req, res) => {
  try {
    const meridian = await getMeridianById(req.params.meridianId);
    if (!meridian) {
      return res.status(404).json({ error: "Meridian not found" });
    }
    res.json(meridian);
  } catch (error) {
    handleError(res, error);
  }
};

const addMeridian = async (req, res) => {
  try {
    const meridian = await createMeridian(req.body);
    res.status(201).json(meridian);
  } catch (error) {
    handleError(res, error);
  }
};

const editMeridian = async (req, res) => {
  try {
    const meridian = await updateMeridian(req.params.meridianId, req.body);
    if (!meridian) {
      return res.status(404).json({ error: "Meridian not found" });
    }
    res.json(meridian);
  } catch (error) {
    handleError(res, error);
  }
};

const removeMeridian = async (req, res) => {
  try {
    const deleted = await deleteMeridian(req.params.meridianId);
    if (!deleted) {
      return res.status(404).json({ error: "Meridian not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listMeridians,
  getMeridianById: getMeridianByIdHandler,
  addMeridian,
  editMeridian,
  removeMeridian,
};
