const {
  getAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getUpcomingAppointmentDate,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctorId
} = require('../models/appointment');

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong' });
};

const listAllAppointments = async (req, res) => {
  try {
    const appointments = await getAppointments();
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
};

const getAppointmentByIdHandler = async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    handleError(res, error);
  }
};

const getAppointmentsByDateHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByDate(req.params.appointmentDate);
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
};

const getAppointmentsByPatientIdHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByPatientId(req.params.patientId);
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
};
const getAppointmentsByDoctorIdHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByDoctorId(req.params.doctorId);
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
};

const getUpcomingAppointmentDateHandler = async (req, res) => {
  try {
    const nextDate = await getUpcomingAppointmentDate(req.params.patientId);
    res.json(nextDate);
  } catch (error) {
    handleError(res, error);
  }
};

const addAppointment = async (req, res) => {
  try {
    const appointment = await createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    handleError(res, error);
  }
};

const editAppointment = async (req, res) => {
  try {
    const appointment = await updateAppointment(req.params.appointmentId, req.body);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    handleError(res, error);
  }
};

const removeAppointment = async (req, res) => {
  try {
    const deleted = await deleteAppointment(req.params.appointmentId);
    if (!deleted) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  listAllAppointments,
  getAppointmentById: getAppointmentByIdHandler,
  getAppointmentsByDate: getAppointmentsByDateHandler,
  getAppointmentsByPatientId: getAppointmentsByPatientIdHandler,
  getAppointmentsByDoctorId: getAppointmentsByDoctorIdHandler,
  getUpcomingAppointmentDate: getUpcomingAppointmentDateHandler,
  addAppointment,
  editAppointment,
  removeAppointment
};


