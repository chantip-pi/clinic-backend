const {
  getMedicalRecordIllnesses,
  getIllnessesByRecordId,
  createMedicalRecordIllness,
  deleteMedicalRecordIllness,
  deleteAllIllnessesForRecord,
} = require("../models/medicalRecordIllness");

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
};

const listMedicalRecordIllnesses = async (req, res) => {
  try {
    const medicalRecordIllnesses = await getMedicalRecordIllnesses();
    res.json(medicalRecordIllnesses);
  } catch (error) {
    handleError(res, error);
  }
};

const getMedicalRecordIllnessesByRecordIdHandler = async (req, res) => {
  try {
    const { recordId } = req.params;

    const illnesses = await getIllnessesByRecordId(recordId);

    res.json(illnesses);
  } catch (error) {
    handleError(res, error);
  }
};

const addMedicalRecordIllness = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { illnessId } = req.body;

    const medicalRecordIllness = await createMedicalRecordIllness({
      recordId,
      illnessId,
    });

    res.status(201).json(medicalRecordIllness);
  } catch (error) {
    handleError(res, error);
  }
};

const removeMedicalRecordIllness = async (req, res) => {
  try {
    const { recordId, illnessId } = req.params;

    const deleted = await deleteMedicalRecordIllness(
      recordId,
      illnessId,
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Medical Record Illness not found" });
    }

    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

const removeAllIllnessesForRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const deletedCount = await deleteAllIllnessesForRecord(recordId);

    res.status(204).send({ deletedCount });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listMedicalRecordIllnesses,
  getMedicalRecordIllnessesByRecordId: getMedicalRecordIllnessesByRecordIdHandler,
  addMedicalRecordIllness,
  removeMedicalRecordIllness,
  removeAllIllnessesForRecord,
};
