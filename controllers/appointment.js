const {
  getAppointments,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByPatientId,
  getUpcomingAppointmentDate,
  getScheduledAppointmentsByPatientId,
  createAppointment,
  updateAppointment,
  getAppointmentsByDoctorId,
  deleteAppointment
} = require('../models/appointment');
const { assertDoctorAvailable } = require('../services/appointmentAvailability');
const {
  AppointmentTimeUnavailableError
} = require('../errors/AppointmentTimeUnavailableError');

// Normalize incoming appointment data so that if the date/time is in the past
// AND the status is currently "scheduled", the status is automatically set to
// "canceled". Completed or other non-scheduled appointments are left unchanged.
const normalizeAppointmentPayload = (payload) => {
  const { appointmentDateTime } = payload;
  let { status } = payload;

  if (
    appointmentDateTime &&
    new Date(appointmentDateTime) < new Date() &&
    status === 'scheduled'
  ) {
    status = 'canceled';
  }

  return { ...payload, status };
};

// Applies normalization to an appointment coming from the database and, if the
// status changes (e.g. from "scheduled" to "canceled" because it is in the past),
// persists that change back to the database.
const normalizeAndPersistAppointment = async (appointment) => {
  if (!appointment) return appointment;

  const normalized = normalizeAppointmentPayload(appointment);

  if (normalized.status !== appointment.status) {
    await updateAppointment(appointment.appointmentId, {
      patientId: normalized.patientId,
      doctorId: normalized.doctorId,
      appointmentDateTime: normalized.appointmentDateTime,
      status: normalized.status,
      reason: normalized.reason
    });
  }

  return normalized;
};

const handleError = (res, error) => {
  console.error(error);

  if (error instanceof AppointmentTimeUnavailableError) {
    return res.status(409).json({
      error: error.message,
      code: 'AppointmentTimeUnavailableError'
    });
  }

  res.status(500).json({ error: 'Something went wrong' });
};

const listAllAppointments = async (req, res) => {
  try {
    const appointments = await getAppointments();
    const normalized = await Promise.all(
      appointments.map(normalizeAndPersistAppointment)
    );
    res.json(normalized);
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
    const normalized = await normalizeAndPersistAppointment(appointment);
    res.json(normalized);
  } catch (error) {
    handleError(res, error);
  }
};

const getAppointmentsByDateHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByDate(req.params.appointmentDate);
    const normalized = await Promise.all(
      appointments.map(normalizeAndPersistAppointment)
    );
    res.json(normalized);
  } catch (error) {
    handleError(res, error);
  }
};

const getAppointmentsByPatientIdHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByPatientId(req.params.patientId);
    const normalized = await Promise.all(
      appointments.map(normalizeAndPersistAppointment)
    );
    res.json(normalized);
  } catch (error) {
    handleError(res, error);
  }
};
const getAppointmentsByDoctorIdHandler = async (req, res) => {
  try {
    const appointments = await getAppointmentsByDoctorId(req.params.doctorId);
    const normalized = await Promise.all(
      appointments.map(normalizeAndPersistAppointment)
    );
    res.json(normalized);
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
    const payload = normalizeAppointmentPayload(req.body);
    const { doctorId, appointmentDateTime, status } = payload;

    // Only check availability for appointments that are actually scheduled
    if (status === 'scheduled') {
      await assertDoctorAvailable({
        doctorId,
        appointmentDateTime
      });
    }

    const appointment = await createAppointment(payload);
    res.status(201).json(appointment);
  } catch (error) {
    handleError(res, error);
  }
};

const updateAppointmentHandler = async (req, res) => {
  try {
    const existing = await getAppointmentById(req.params.appointmentId);
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const merged = normalizeAppointmentPayload({ ...existing, ...req.body });

    // Only check availability for appointments that are actually scheduled
    if (merged.status === 'scheduled') {
      await assertDoctorAvailable({
        doctorId: merged.doctorId,
        appointmentDateTime: merged.appointmentDateTime,
        excludeAppointmentId: req.params.appointmentId
      });
    }

    const appointment = await updateAppointment(req.params.appointmentId, merged);
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

const getScheduledAppointmentsByPatientIdHandler = async (req, res) => {
  try {
    const appointments = await getScheduledAppointmentsByPatientId(req.params.patientId);
    res.json(appointments);
  } catch (error) {
    handleError(res, error);
  }
};


const cancelAppointmentHandler = async (req, res) => {
  try {
    const existing = await getAppointmentById(req.params.appointmentId);
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const appointment = await updateAppointment(req.params.appointmentId, {
      ...existing,
      status: 'canceled'
    });
    res.json(appointment);
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
  getScheduledAppointmentsByPatientId: getScheduledAppointmentsByPatientIdHandler,
  addAppointment,
  updateAppointment: updateAppointmentHandler,
  cancelAppointment: cancelAppointmentHandler,
  removeAppointment,
};


