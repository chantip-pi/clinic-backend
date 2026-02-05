const {
  getMedicalRecordAcupunctures,
  getAcupuncturesByRecordId,
  createMedicalRecordAcupuncture,
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
    const { recordId } = req.params;

    const acupunctures = await getAcupuncturesByRecordId(recordId);

    res.json(acupunctures);
  } catch (error) {
    handleError(res, error);
  }
};

const addMedicalRecordAcupuncture = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { acupunctureId } = req.body;

    const medicalRecordAcupuncture =
      await createMedicalRecordAcupuncture({
        recordId,
        acupunctureId,
      });

    res.status(201).json(medicalRecordAcupuncture);
  } catch (error) {
    handleError(res, error);
  }
};

const removeMedicalRecordAcupuncture = async (req, res) => {
  try {
    const { recordId, acupunctureId } = req.params;

    const deleted = await deleteMedicalRecordAcupuncture(
      recordId,
      acupunctureId
    );

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Medical Record Acupuncture not found" });
    }

    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

const removeAllAcupuncturesForRecord = async (req, res) => {
  try {
    const { recordId } = req.params;

    const deletedCount = await deleteAllAcupuncturesForRecord(recordId);

    res.status(204).send({ deletedCount });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listMedicalRecordAcupunctures,
  getMedicalRecordAcupuncturesByRecordId: getMedicalRecordAcupuncturesByRecordIdHandler,
  addMedicalRecordAcupuncture,
  removeMedicalRecordAcupuncture,
  removeAllAcupuncturesForRecord,
};
