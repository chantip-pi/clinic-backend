const {
  getAcupointLocations,
  getAcupointLocationById,
  createAcupointLocation,
  updateAcupointLocation,
  deleteAcupointLocation,
} = require("../models/acupointLocation");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listAcupointLocations = async (req, res) => {
  try {
    const locations = await getAcupointLocations();
    res.json(locations);
  } catch (error) {
    handleError(res, error);
  }
};

const getAcupointLocationByIdHandler = async (req, res) => {
  try {
    const location = await getAcupointLocationById(req.params.locationId);
    if (!location) {
      return res.status(404).json({ error: "Acupoint Location not found" });
    }
    res.json(location);
  } catch (error) {
    handleError(res, error);
  } 
};

const addAcupointLocation = async (req, res) => {
  try {
    const location = await createAcupointLocation(req.body);
    res.status(201).json(location);
  } catch (error) {
    handleError(res, error);
  }
};

const editAcupointLocation = async (req, res) => {
  try {
    const location = await updateAcupointLocation(req.params.locationId, req.body);
    if (!location) {
      return res.status(404).json({ error: "Acupoint Location not found" });
    }
    res.json(location);
  } catch (error) {
    handleError(res, error);
  }
};

const removeAcupointLocation = async (req, res) => {
  try {
    const deleted = await deleteAcupointLocation(req.params.locationId);
    if (!deleted) {
      return res.status(404).json({ error: "Acupoint Location not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listAcupointLocations,
  getAcupointLocationById: getAcupointLocationByIdHandler,
  addAcupointLocation,
  editAcupointLocation,
  removeAcupointLocation,
};