const request = require('supertest');

jest.mock('../models/appointment', () => ({
  getAppointments: jest.fn().mockResolvedValue([
    { appointmentId: 1, patientId: 1, appointmentDateTime: '2025-01-01T10:00:00Z' }
  ]),
  getAppointmentById: jest
    .fn()
    .mockResolvedValue({ appointmentId: 1, patientId: 1, appointmentDateTime: '2025-01-01T10:00:00Z' }),
  getAppointmentsByDate: jest.fn().mockResolvedValue([
    { appointmentId: 1, patientId: 1, appointmentDateTime: '2025-01-01T10:00:00Z' }
  ]),
  getAppointmentsByPatientId: jest.fn().mockResolvedValue([
    { appointmentId: 1, patientId: 1, appointmentDateTime: '2025-01-01T10:00:00Z' }
  ]),
  getUpcomingAppointmentDate: jest.fn().mockResolvedValue('2025-01-01T10:00:00Z'),
  createAppointment: jest
    .fn()
    .mockResolvedValue({ appointmentId: 2, patientId: 1, appointmentDateTime: '2025-02-01T10:00:00Z' }),
  updateAppointment: jest
    .fn()
    .mockResolvedValue({ appointmentId: 1, patientId: 1, appointmentDateTime: '2025-03-01T10:00:00Z' }),
  deleteAppointment: jest.fn().mockResolvedValue(true)
}));

const app = require('../app');

describe('Appointment routes', () => {
  it('GET /api/appointments should list appointments', async () => {
    const res = await request(app).get('/api/appointments');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/appointments/:appointmentId should return one appointment', async () => {
    const res = await request(app).get('/api/appointments/1');
    expect(res.status).toBe(200);
    expect(res.body.appointmentId).toBe(1);
  });

  it('GET /api/appointments/date/:appointmentDate should filter by date', async () => {
    const res = await request(app).get('/api/appointments/date/2025-01-01');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/appointments/patient/:patientId should filter by patient', async () => {
    const res = await request(app).get('/api/appointments/patient/1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/appointments/upcoming/:patientId should return upcoming date or null', async () => {
    const res = await request(app).get('/api/appointments/upcoming/1');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('POST /api/appointments should create appointment', async () => {
    const res = await request(app)
      .post('/api/appointments')
      .send({ patientId: 1, appointmentDateTime: '2025-02-01T10:00:00Z', status: 'scheduled' });
    expect(res.status).toBe(201);
    expect(res.body.appointmentId).toBe(2);
  });

  it('PUT /api/appointments/:appointmentId should update appointment', async () => {
    const res = await request(app)
      .put('/api/appointments/1')
      .send({ status: 'completed' });
    expect(res.status).toBe(200);
    expect(res.body.appointmentId).toBe(1);
  });

  it('DELETE /api/appointments/:appointmentId should delete appointment', async () => {
    const res = await request(app).delete('/api/appointments/1');
    expect(res.status).toBe(204);
  });
});


