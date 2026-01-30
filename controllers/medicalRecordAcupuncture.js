const {
  getMedicalRecordAcupunctures,
  getAcupuncturesByRecordId,
  createMedicalRecordAcupuncture,
  updateMedicalRecordAcupuncture,
  deleteMedicalRecordAcupuncture,
  deleteAllAcupuncturesForRecord,
} = require("../models/medicalRecordAcupuncture");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listMedicalRecordAcupunctures = async (req, res) => {
  try {
    const medicalRecordAcupunctures = await getMedicalRecordAcupunctures();
    res.json(medicalRecordAcupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const getMedicalRecordAcupuncturesByRecordIdHandler = async (req, res) => {
  try {
    const medicalRecordAcupuncture = await getMedicalRecordAcupunctureById(req.params.recordId);
    if (!medicalRecordAcupuncture) {
      return res.status(404).json({ error: "Medical Record Acupuncture not found" });
    }
    res.json(medicalRecordAcupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const addMedicalRecordAcupuncture = async (req, res) => {
  try {
    const medicalRecordAcupuncture = await createMedicalRecordAcupuncture(req.body);
    res.status(201).json(medicalRecordAcupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const editMedicalRecordAcupuncture = async (req, res) => {
  try {
    const medicalRecordAcupuncture = await updateMedicalRecordAcupuncture(
      req.params.recordAcupunctureId,
      req.params.acupunctureId,
      req.body
    );
    if (!medicalRecordAcupuncture) {
      return res.status(404).json({ error: "Medical Record Acupuncture not found" });
    }
    res.json(medicalRecordAcupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const removeMedicalRecordAcupuncture = async (req, res) => {
  try {
    const deleted = await deleteMedicalRecordAcupuncture(req.params.recordId);
    if (!deleted) {
      return res.status(404).json({ error: "Medical Record Acupuncture not found" });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listMedicalRecordAcupunctures,
  getMedicalRecordAcupunctureById: getMedicalRecordAcupuncturesByIdHandler,
  addMedicalRecordAcupuncture,
  editMedicalRecordAcupuncture,
  removeMedicalRecordAcupuncture,
};
