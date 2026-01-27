class AppointmentTimeUnavailableError extends Error {
  constructor(message = 'Appointment time is unavailable for the selected doctor') {
    super(message);
    this.name = 'AppointmentTimeUnavailableError';
  }
}

module.exports = { AppointmentTimeUnavailableError };


