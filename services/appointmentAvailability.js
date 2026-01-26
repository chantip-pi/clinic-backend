const { findConflictingAppointment } = require('../models/appointment');
const { AppointmentTimeUnavailableError } = require('../errors/AppointmentTimeUnavailableError');

async function assertDoctorAvailable({
  doctorId,
  appointmentDateTime,
  excludeAppointmentId
}) {
  if (!doctorId || !appointmentDateTime) return;

  const conflict = await findConflictingAppointment({
    doctorId,
    appointmentDateTime,
    excludeAppointmentId
  });

  if (conflict) {
    throw new AppointmentTimeUnavailableError();
  }
}

module.exports = { assertDoctorAvailable };


