const {
  getMeridians,
  getUniqueMeridianNames,
  getMeridianById,
  getMeridiansByRegionAndSide,
  getMeridianRegion,
  getMeridianSidesByRegion,
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
const getUniqueMeridianNamesHandler = async (req, res) => {
  try {
    const names = await getUniqueMeridianNames();
    res.json(names);
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

const getMeridiansByRegionAndSideHandler = async (req, res) => {
  try {
    const { region, side } = req.params;
    const meridian = await getMeridiansByRegionAndSide(region, side);
    res.json(meridian);
  } catch (error) {
    handleError(res, error);
  }
};

const getMeridianRegionHandler = async (req, res) => {
  try {
    const meridians = await getMeridianRegion();
    res.json(meridians);
  } catch (error) {
    handleError(res, error);
  }
};

const getMeridianSidesByRegionHandler = async (req, res) => {
  try {
    const meridian = await getMeridianSidesByRegion(req.params.region);
    if (!meridian) {
      return res.status(404).json({ error: "Meridian region not found" });
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
  getUniqueMeridianNames: getUniqueMeridianNamesHandler,
  getMeridianById: getMeridianByIdHandler,
  getMeridiansByRegionAndSide: getMeridiansByRegionAndSideHandler,
  getMeridianRegion: getMeridianRegionHandler,
  getMeridianSidesByRegion: getMeridianSidesByRegionHandler,
  addMeridian,
  editMeridian,
  removeMeridian,
};
