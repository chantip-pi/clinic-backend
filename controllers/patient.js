const {
  getPatients,
  getPatientsByAppointmentDate,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
} = require('../models/patient');

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};

const listPatients = async (req, res) => {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch (error) {
    handleError(res, error);
  }
};

const getPatientsByAppointmentDateHandler = async (req, res) => {
  try {
    const { appointmentDate } = req.params;
    const patients = await getPatientsByAppointmentDate(appointmentDate);
    res.json(patients);
  } catch (error) {
    handleError(res, error);
  }
};

const getPatientByIdHandler = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    handleError(res, error);
  }
};

const addPatient = async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json(patient);
  } catch (error) {
    handleError(res, error);
  }
};

const editPatient = async (req, res) => {
  try {
    const patient = await updatePatient(req.params.patientId, req.body);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (error) {
    handleError(res, error);
  }
};

const removePatient = async (req, res) => {
  try {
    const deleted = await deletePatient(req.params.patientId);
    if (!deleted) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listPatients,
  getPatientsByAppointmentDate: getPatientsByAppointmentDateHandler,
  getPatientById: getPatientByIdHandler,
  addPatient,
  editPatient,
  removePatient
};
